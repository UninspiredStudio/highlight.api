import type { ControllerProps } from "./types";
import type { Request, Response } from "express";
import { slugValidator } from "../validators/slugValidator";
import { highlightValidator } from "../validators/highlightValidator";
import { z } from "zod";
import type { Redis } from "ioredis";
import { Prisma, type PrismaClient } from "@prisma/client";

export interface HighlightControllerProps extends ControllerProps {}

export class HighlightController {
  private prismaClient: PrismaClient;
  private redisClient: Redis | null;

  constructor(props: HighlightControllerProps) {
    this.prismaClient = props.prismaClient;
    this.redisClient = props.redisClient;
  }

  addHighlightsBySlug = async (req: Request, res: Response) => {
    try {
      const slugResult = await slugValidator.spa(req.params.slug);
      if (!slugResult.success) {
        return res.status(400).json({ message: "Invalid slug" });
      }
      const slug = slugResult.data;

      const highlightsResult = await z.array(highlightValidator).spa(req.body);
      if (!highlightsResult.success) {
        console.error(highlightsResult.error);
        return res.status(400).json({ message: "Invalid highlights" });
      }
      const highlights = highlightsResult.data;

      let page =
        (await this.prismaClient.page.findUnique({
          where: {
            slug,
          },
        })) ??
        (await this.prismaClient.page.create({
          data: {
            slug,
          },
        }));

      if (!page) {
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const highlightData = highlights.map((highlight) => ({
        pageId: page.id,
        userId: res.locals.uid,
        ...highlight,
      }));

      await this.prismaClient.highlight.createMany({
        data: highlightData,
        skipDuplicates: true,
      });

      const newHighlights = await this.prismaClient.highlight.findMany({
        where: {
          page: {
            slug,
          },
        },
      });

      return res.status(200).json(newHighlights);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === "P2002") {
          return res.status(400).json({ message: "Already sent" });
        }
      }
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getHighlightsBySlug = async (req: Request, res: Response) => {
    try {
      const slugResult = await slugValidator.spa(req.params.slug);
      if (!slugResult.success) {
        return res.status(400).json({ message: "Invalid slug" });
      }
      const slug = slugResult.data;

      const highlights = await this.prismaClient.highlight.findMany({
        where: {
          page: {
            slug,
          },
        },
      });

      if (!highlights) {
        return res.status(404).json({ message: "Page not found" });
      }

      await this.redisClient?.set(
        req.originalUrl,
        JSON.stringify(highlights),
        "EX",
        10
      );

      return res.status(200).json(highlights);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

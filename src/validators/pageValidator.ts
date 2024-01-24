import { z } from "zod";
import { slugRegex } from "../util/slugRegex";
import { highlightValidator } from "./highlightValidator";

export const pageValidator = z.object({
  id: z.number().optional(),
  slug: z.string().regex(slugRegex),
  highlights: z
    .array(
      z.object({
        ...highlightValidator.shape,
      })
    )
    .optional(),
});

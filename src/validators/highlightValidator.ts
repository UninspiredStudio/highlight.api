import { z } from "zod";

const highlightBaseValidator = z.object({
  id: z.number().optional(),
  xPath: z.string(),
  text: z.string(),
});

const highlightWithPageIdValidator = z.object({
  ...highlightBaseValidator.shape,
});

export const highlightValidator = highlightWithPageIdValidator;

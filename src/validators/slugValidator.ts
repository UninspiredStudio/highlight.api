import { z } from "zod";
import { slugRegex } from "../util/slugRegex";

export const slugValidator = z.string().regex(slugRegex);

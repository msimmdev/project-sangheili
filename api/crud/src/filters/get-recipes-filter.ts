import { z } from "zod";
import { OwnedResourceSchema } from "@msimmdev/project-sangheili-types";

const RecipeFilterSchema = z
  .object({
    name: z
      .object({
        $contains: z.string().optional(),
        $eq: z.string().optional(),
      })
      .strict()
      .optional(),
    visibility: z
      .object({
        $eq: OwnedResourceSchema.shape.visibility.optional(),
      })
      .strict()
      .optional(),
    createdOn: z
      .object({
        $lt: z.string().datetime().optional(),
        $gt: z.string().datetime().optional(),
        $lte: z.string().datetime().optional(),
        $gte: z.string().datetime().optional(),
      })
      .strict()
      .optional(),
    lastUpdatedOn: z
      .object({
        $lt: z.string().datetime().optional(),
        $gt: z.string().datetime().optional(),
        $lte: z.string().datetime().optional(),
        $gte: z.string().datetime().optional(),
      })
      .strict()
      .optional(),
    owner: z
      .object({
        $eq: z.union([z.literal("$me"), z.string().uuid()]).optional(),
      })
      .strict()
      .optional(),
    shared: z
      .object({
        $eq: z.union([z.literal("$me"), z.string().uuid()]).optional(),
      })
      .strict()
      .optional(),
    limit: z.coerce.number().positive().int().optional(),
    offset: z.coerce.number().nonnegative().int().optional(),
  })
  .strict()
  .optional();

type RecipeFilter = z.infer<typeof RecipeFilterSchema>;

export { RecipeFilterSchema, RecipeFilter };

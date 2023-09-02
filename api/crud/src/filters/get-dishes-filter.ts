import { z } from "zod";
import { OwnedResourceSchema } from "@msimmdev/project-sangheili-types";

const DishFilterSchema = z
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
  })
  .strict()
  .optional();

type DishFilter = z.infer<typeof DishFilterSchema>;

export { DishFilterSchema, DishFilter };
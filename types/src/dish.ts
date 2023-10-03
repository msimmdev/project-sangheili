import { z } from "zod";
import { RecipeSummarySchema } from "./recipe-summary";
import { ImageSchema } from "./image";
import { ImageUploadSchema } from "./image-upload";

const DishSchema = z.object({
  name: z.string(),
  description: z.string(),
  defaultRecipe: RecipeSummarySchema.optional(),
  mainImage: z.union([ImageSchema, ImageUploadSchema]),
});

type Dish = z.infer<typeof DishSchema>;

export { DishSchema };
export default Dish;

import { z } from "zod";
import { RecipeSummarySchema } from "./recipe-summary";
import { ImageSchema } from "./image";

const DishSchema = z.object({
  name: z.string(),
  description: z.string(),
  defaultRecipe: RecipeSummarySchema.optional(),
  mainImage: ImageSchema,
});

type Dish = z.infer<typeof DishSchema>;

export { DishSchema };
export default Dish;

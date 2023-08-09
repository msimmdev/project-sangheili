import { RecipeIngredientSchema } from "./recipe-ingredient";
import { RecipeSectionSchema } from "./recipe-section";
import { RecipeSummarySchema } from "./recipe-summary";
import { ImageSchema } from "./image";

import { z } from "zod";

const RecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["StandAlone", "Remix"]),
  ingredientList: z.array(RecipeIngredientSchema),
  productList: z.array(RecipeIngredientSchema),
  sections: z.array(RecipeSectionSchema),
  totalTime: z.bigint().positive().optional(),
  prepTime: z.bigint().positive().optional(),
  cookTime: z.bigint().positive().optional(),
  mainImage: ImageSchema,
  remixParent: RecipeSummarySchema,
  remixChildren: z.array(RecipeSummarySchema),
});

type Recipe = z.infer<typeof RecipeSchema>;

export { RecipeSchema };
export default Recipe;

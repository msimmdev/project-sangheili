import { RecipeIngredientSchema } from "./recipe-ingredient";
import { RecipeSectionSchema } from "./recipe-section";
import { RecipeSummarySchema } from "./recipe-summary";
import { ImageSchema } from "./image";
import { ImageUploadSchema } from "./image-upload";

import { z } from "zod";

const RecipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum(["StandAlone", "Remix"]).default("StandAlone"),
  ingredientList: z.array(RecipeIngredientSchema),
  productList: z.array(RecipeIngredientSchema),
  sections: z.array(RecipeSectionSchema),
  totalTime: z.bigint().positive().optional(),
  prepTime: z.bigint().positive().optional(),
  cookTime: z.bigint().positive().optional(),
  mainImage: z.union([ImageSchema, ImageUploadSchema]).optional(),
  isDraft: z.boolean().default(true),
});

type Recipe = z.infer<typeof RecipeSchema>;

export { RecipeSchema };
export default Recipe;

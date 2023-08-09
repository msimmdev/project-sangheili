import { z } from "zod";

const RecipeIngredientSchema = z.object({
  text: z.string(),
});

type RecipeIngredient = z.infer<typeof RecipeIngredientSchema>;

export { RecipeIngredientSchema };
export default RecipeIngredient;

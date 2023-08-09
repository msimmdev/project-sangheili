import { RecipeStepSchema } from "./recipe-step";
import { z } from "zod";

const RecipeSectionSchema = z.object({
  heading: z.string().optional(),
  step: RecipeStepSchema,
});

type RecipeSection = z.infer<typeof RecipeSectionSchema>;

export { RecipeSectionSchema };
export default RecipeSection;

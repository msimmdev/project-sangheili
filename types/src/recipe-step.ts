import { z } from "zod";

const RecipeStepSchema = z.object({
  method: z.string(),
});

type RecipeStep = z.infer<typeof RecipeStepSchema>;

export { RecipeStepSchema };
export default RecipeStep;

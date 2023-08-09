import { z } from "zod";
import { ImageSchema } from "./image";

const RecipeSummarySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  mainImage: ImageSchema,
});

type RecipeSummary = z.infer<typeof RecipeSummarySchema>;

export { RecipeSummarySchema };
export default RecipeSummary;

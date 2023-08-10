import { z } from "zod";

const ImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  sizeX: z.number().int().positive(),
  sizeY: z.number().int().positive(),
});

type Image = z.infer<typeof ImageSchema>;

export { ImageSchema };
export default Image;

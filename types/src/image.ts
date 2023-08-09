import { z } from "zod";

const ImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  sizeX: z.bigint().positive(),
  sizeY: z.bigint().positive(),
});

type Image = z.infer<typeof ImageSchema>;

export { ImageSchema };
export default Image;

import { z } from "zod";

const ImageSchema = z.object({
  alt: z.string(),
  variants: z.array(
    z.object({
      url: z.string().url(),
      sizeTag: z.enum(["xs", "sm", "md", "lg", "xl"]),
      sizeX: z.number().int().positive(),
      sizeY: z.number().int().positive(),
    })
  ),
});

type Image = z.infer<typeof ImageSchema>;

export { ImageSchema };
export default Image;

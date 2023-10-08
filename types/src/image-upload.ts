import { z } from "zod";

const ImageUploadSchema = z.object({
  fileId: z.string().uuid(),
  container: z.string().nonempty(),
  crop: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    x: z.number().int().nonnegative(),
    y: z.number().int().nonnegative(),
  }),
});

type ImageUpload = z.infer<typeof ImageUploadSchema>;

export { ImageUploadSchema };
export default ImageUpload;

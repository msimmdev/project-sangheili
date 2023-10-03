import { z } from "zod";

const ImageUploadSchema = z.object({
  uploadKey: z.string().uuid(),
  crop: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    x: z.number().int().positive(),
    y: z.number().int().positive(),
  }),
});

type ImageUpload = z.infer<typeof ImageUploadSchema>;

export { ImageUploadSchema };
export default ImageUpload;

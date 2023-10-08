import z from "zod";

const ImageVariantSchema = z.object({
  url: z.string().url(),
  sizeTag: z.enum(["xs", "sm", "md", "lg", "xl"]),
  sizeX: z.number().int().positive(),
  sizeY: z.number().int().positive(),
});

type ImageVariant = z.infer<typeof ImageVariantSchema>;

export type { ImageVariant };

export default ImageVariantSchema;

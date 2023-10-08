import {
  Image,
  ImageUpload,
  ImageVariant,
} from "@msimmdev/project-sangheili-types";
import { getBlobClient } from "../storage";
import sharp from "sharp";

const uploadContainer = process.env.STORAGE_UPLOAD_CONTAINER;
const publicImageBaseUrl = process.env.PUBLIC_IMAGE_BASE_URL;

if (typeof uploadContainer === "undefined") {
  throw new Error("Upload Container Not Defined");
}

const variants: { sizeTag: "sm" | "lg"; sizeX: number }[] = [
  {
    sizeTag: "sm",
    sizeX: 300,
  },
  {
    sizeTag: "lg",
    sizeX: 1200,
  },
];

async function processImage(
  uploadData: ImageUpload,
  storeType: string
): Promise<Image> {
  const imageVariants: ImageVariant[] = [];
  const uploadClient = getBlobClient(uploadData.container, uploadData.fileId);

  const fileBuffer = await uploadClient.downloadToBuffer();
  const file = sharp(fileBuffer).extract({
    left: uploadData.crop.x,
    top: uploadData.crop.y,
    width: uploadData.crop.width,
    height: uploadData.crop.height,
  });

  for (const variant of variants) {
    const resizedFile = file.clone().resize({ width: variant.sizeX }).webp();
    const resizedFileBuffer = await resizedFile.toBuffer();
    const metadata = await sharp(resizedFileBuffer).metadata();
    const fileName = `${uploadData.fileId}_${variant.sizeTag}.webp`;
    const publicClient = getBlobClient("publicimages", fileName);
    await publicClient.getBlockBlobClient().uploadData(resizedFileBuffer, {
      blobHTTPHeaders: { blobContentType: "image/webp" },
    });
    imageVariants.push({
      url: publicImageBaseUrl + new URL(publicClient.url).pathname,
      sizeTag: variant.sizeTag,
      sizeX: metadata.width ?? 0,
      sizeY: metadata.height ?? 0,
    });
    await uploadClient.deleteIfExists();
  }

  return {
    alt: "",
    variants: imageVariants,
  };
}

export default processImage;

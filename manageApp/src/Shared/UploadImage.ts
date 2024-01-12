import { Area } from "react-easy-crop";
import { User } from "oidc-client-ts";
import { BlockBlobClient } from "@azure/storage-blob";
import { ImageUpload } from "@msimmdev/project-sangheili-types";

const api_url = import.meta.env.VITE_CRUD_API_URL;
const upload_base_url = import.meta.env.VITE_UPLOAD_BASE_URL;

type ImageUploadData = {
  imageFile: File;
  imageURL: string;
  cropArea: Area;
};

async function uploadImage(
  fileData: ImageUploadData,
  user: User
): Promise<ImageUpload> {
  const sessionResponse = await fetch(`${api_url}/upload-session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.access_token}`,
    },
  });

  if (!sessionResponse.ok) {
    throw new Error(`Invalid file upload response: ${sessionResponse.status}}`);
  }
  const result = await sessionResponse.json();

  const blobClient = new BlockBlobClient(
    `${upload_base_url}/${result["container"]}/${result["fileId"]}?${result["uploadParams"]}`
  );
  await blobClient.uploadData(fileData.imageFile, {
    blobHTTPHeaders: {
      blobContentType: fileData.imageFile.type,
    },
    onProgress: (ev) => {
      console.log(`Uploaded ${ev.loadedBytes} of ${fileData.imageFile.size}`);
    },
  });

  return {
    fileId: result["fileId"],
    container: result["container"],
    crop: fileData.cropArea,
  };
}

export type { ImageUploadData };

export { uploadImage };

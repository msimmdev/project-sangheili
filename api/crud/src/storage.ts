import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASQueryParameters,
  BlobClient,
} from "@azure/storage-blob";

const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;
const url = process.env.STORAGE_URL;
const uploadContainer = process.env.STORAGE_UPLOAD_CONTAINER;

if (
  typeof account === "undefined" ||
  typeof accountKey === "undefined" ||
  typeof url === "undefined" ||
  typeof uploadContainer === "undefined"
) {
  throw new Error("Invalid Storage Configuration");
}
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `${url}/${account}`,
  sharedKeyCredential
);

function getBlobClient(containerName: string, blobName: string): BlobClient {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  return containerClient.getBlobClient(blobName);
}

function getUploadParams(
  containerName: string,
  blobName: string
): SASQueryParameters {
  const blobClient = getBlobClient(containerName, blobName);

  const permissions = BlobSASPermissions.parse("w");

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 15);

  const sasQueryParameters = generateBlobSASQueryParameters(
    {
      containerName: containerName,
      blobName: blobClient.name,
      permissions: permissions,
      expiresOn: expiresOn,
    },
    sharedKeyCredential
  );

  return sasQueryParameters;
}

export { blobServiceClient, getUploadParams, getBlobClient };

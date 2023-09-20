import express from "express";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

const router = express.Router();

const account = "devstoreaccount1";
const accountKey =
  "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `http://project-sangheili-azurite-1/devstoreaccount1`,
  sharedKeyCredential
);

router.post("/", async (req, res, next) => {
  const uploadType = "dishImage";

  const containerName = "testContainer";
  const blobName = "testBlob";

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const permissions = BlobSASPermissions.parse("w");

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 15);

  const sasQueryParameters = generateBlobSASQueryParameters(
    {
      containerName: containerClient.containerName,
      blobName: blobClient.name,
      permissions: permissions,
      expiresOn: expiresOn,
    },
    sharedKeyCredential
  );

  res.status(200).json({
    token: `${blobClient.url}?${sasQueryParameters}`,
  });
});

export default router;

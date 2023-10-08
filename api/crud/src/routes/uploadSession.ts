import express from "express";
import { randomUUID } from "crypto";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

const router = express.Router();

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

router.post("/", async (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.sendStatus(403);
  }

  const containerName = uploadContainer;
  const blobName = randomUUID();

  try {
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

    return res.status(200).json({
      sessionExpires: expiresOn.toJSON(),
      uploadUrl: `${blobClient.url}?${sasQueryParameters}`,
      fileId: blobName,
      container: containerName,
    });
  } catch (e) {
    return next(e);
  }
});

export default router;

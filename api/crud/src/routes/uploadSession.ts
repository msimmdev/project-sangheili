import express from "express";
import { randomUUID } from "crypto";
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
  `http://127.0.0.1:10000/devstoreaccount1`,
  sharedKeyCredential
);

router.post("/", async (req, res, next) => {
  if (typeof req.user === "undefined") {
    return res.sendStatus(403);
  }

  const containerName = "fileupload";
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
      uploadKey: blobName,
    });
  } catch (e) {
    return next(e);
  }
});

export default router;

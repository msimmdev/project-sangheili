import express from "express";
import { randomUUID } from "crypto";
import { getUploadParams } from "../storage";

const router = express.Router();

const uploadContainer = process.env.STORAGE_UPLOAD_CONTAINER;

if (typeof uploadContainer === "undefined") {
  throw new Error("Upload Container Not Defined");
}

router.post("/", async (req, res, next) => {
  if (typeof req.user === "undefined") {
    console.log(req.user);
    return res.sendStatus(403);
  }

  const blobName = randomUUID();

  try {
    const sasQueryParameters = getUploadParams(uploadContainer, blobName);

    return res.status(200).json({
      sessionExpires: sasQueryParameters.expiresOn?.toJSON(),
      uploadParams: `${sasQueryParameters}`,
      fileId: blobName,
      container: uploadContainer,
    });
  } catch (e) {
    return next(e);
  }
});

export default router;

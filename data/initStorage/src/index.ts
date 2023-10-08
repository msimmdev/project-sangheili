import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  CorsRule,
} from "@azure/storage-blob";

const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;
const url = "http://project-sangheili-azurite:10000";
const uploadContainer = process.env.STORAGE_UPLOAD_CONTAINER;

async function createContainerWithCors(): Promise<void> {
  if (
    typeof account === "undefined" ||
    typeof accountKey === "undefined" ||
    typeof url === "undefined" ||
    typeof uploadContainer === "undefined"
  ) {
    throw new Error("Invalid Storage Configuration");
  }

  const sharedKeyCredential = new StorageSharedKeyCredential(
    account,
    accountKey
  );
  const blobServiceClient = new BlobServiceClient(
    `${url}/${account}`,
    sharedKeyCredential
  );

  // Create the container
  const containerClient = blobServiceClient.getContainerClient(uploadContainer);
  if (!(await containerClient.exists())) {
    await containerClient.create();
    console.log(`Container "${uploadContainer}" created successfully.`);
  } else {
    console.log(`Container "${uploadContainer}" already exists.`);
  }

  // Set up CORS rules
  const corsRule: CorsRule = {
    allowedOrigins: "*",
    allowedMethods: "GET,PUT",
    allowedHeaders: "*",
    exposedHeaders: "*",
    maxAgeInSeconds: 3600,
  };

  const properties = await blobServiceClient.getProperties();
  properties.cors = [corsRule];

  await blobServiceClient.setProperties(properties);
  console.log("CORS policy applied successfully.");
}

createContainerWithCors().catch((error: Error) => {
  console.error("Error occurred:", error);
});

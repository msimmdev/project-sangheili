import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  CorsRule,
} from "@azure/storage-blob";

const accountName = "devstoreaccount1";
const accountKey =
  "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==";
const containerName = "fileupload";

async function createContainerWithCors(): Promise<void> {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  const blobServiceClient = new BlobServiceClient(
    `http://127.0.0.1:10000/devstoreaccount1`,
    sharedKeyCredential
  );

  // Create the container
  const containerClient = blobServiceClient.getContainerClient(containerName);
  if (!(await containerClient.exists())) {
    await containerClient.create();
    console.log(`Container "${containerName}" created successfully.`);
  } else {
    console.log(`Container "${containerName}" already exists.`);
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

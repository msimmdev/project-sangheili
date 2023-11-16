import { Dish } from "@msimmdev/project-sangheili-types";
import { readdir } from "node:fs/promises";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const testData = require("../testData/dishes.json") as Array<Dish>;

const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;
const url = "http://project-sangheili-azurite:10000";

if (
  typeof account === "undefined" ||
  typeof accountKey === "undefined" ||
  typeof url === "undefined"
) {
  throw new Error("Invalid Storage Configuration");
}

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `${url}/${account}`,
  sharedKeyCredential
);

const containerClient = blobServiceClient.getContainerClient("publicimages");

async function loadImages(): Promise<void> {
  const files = await readdir(process.cwd() + "/testData/images/");
  for (const file of files) {
    await containerClient
      .getBlobClient(file)
      .getBlockBlobClient()
      .uploadFile(process.cwd() + "/testData/images/" + file, {
        blobHTTPHeaders: { blobContentType: "image/webp" },
      });
  }
}

async function loadDishData(): Promise<void> {
  const access_token = await getAccessToken();
  for (const dish of testData) {
    const getDishparams = new URLSearchParams();
    getDishparams.append("name[$eq]", dish.name);
    getDishparams.append("owner[$eq]", "$me");
    getDishparams.append("limit", "1");
    const getResponse = await fetch(
      "http://localhost:3100/dish?" + getDishparams.toString(),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error(`Get error response ${getResponse.status}`);
    }

    const getDishData = (await getResponse.json()) as Array<any>;
    if (getDishData.length === 1) {
      continue;
    }

    const dishData: Dish = {
      name: dish.name,
      description: dish.description,
      mainImage: dish.mainImage,
    };

    const response = await fetch("http://localhost:3100/dish", {
      method: "POST",
      body: JSON.stringify(dishData),
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Error response ${response.status}`);
      console.error(await response.text());
      throw new Error(`Error response ${response.status}`);
    }
  }
}

async function getAccessToken() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Cookie",
    "fpc=ApJvBINMt9dJq1Gc1GSXRconYzKCAQAAAP1KvtwOAAAA; stsservicecookie=estsfd; x-ms-gateway-slice=estsfd"
  );

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append(
    "scope",
    "https://sangheili.onmicrosoft.com/76dcec81-27ef-4b4b-ad4a-e722a65963b5/.default"
  );
  urlencoded.append("client_id", "5c78529d-ae39-45bc-b39c-51b22c009799");
  urlencoded.append("client_secret", process.env.AD_CLIENT_SECRET ?? "");

  const response = await fetch(
    "https://login.microsoftonline.com/1a317a16-ba37-4af9-8a64-63537fc2b34e/oauth2/v2.0/token",
    {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    }
  );

  if (!response.ok) {
    throw new Error(`Invalid Token Response ${response.status}`);
  }

  const responseData = await response.json();

  return responseData["access_token"];
}

loadImages()
  .then(() => loadDishData())
  .catch((error: Error) => {
    console.error("Error occurred:", error);
  });

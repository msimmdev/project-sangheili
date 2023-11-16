import { Dish } from "@msimmdev/project-sangheili-types";
import { readdir } from "node:fs/promises";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

const testData = require("../testData/dishes.json") as Array<Dish>;

const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;
const url = process.env.STORAGE_URL;
const apiUrl = process.env.CRUD_API_URL;
const tokenScope = process.env.TOKEN_SCOPE;
const tokenUrl = process.env.TOKEN_URL;
const adClientId = process.env.AD_CLIENT_ID;
const adClientSecret = process.env.AD_CLIENT_SECRET;

if (
  typeof account === "undefined" ||
  typeof accountKey === "undefined" ||
  typeof url === "undefined" ||
  typeof apiUrl === "undefined"
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
      apiUrl + "/dish?" + getDishparams.toString(),
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

    const response = await fetch(apiUrl + "/dish", {
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
  if (
    typeof tokenScope === "undefined" ||
    typeof tokenUrl === "undefined" ||
    typeof adClientId === "undefined" ||
    typeof adClientSecret === "undefined"
  ) {
    throw new Error("Invalid Storage Configuration");
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("scope", tokenScope);
  urlencoded.append("client_id", adClientId);
  urlencoded.append("client_secret", adClientSecret);

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  });

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

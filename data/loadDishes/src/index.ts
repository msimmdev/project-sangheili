import { Dish } from "@msimmdev/project-sangheili-types";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { randomUUID } from "crypto";

const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_KEY;
const url = "http://project-sangheili-azurite:10000";
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

const containerClient = blobServiceClient.getContainerClient(uploadContainer);

async function loadDishData(): Promise<void> {
  const access_token = await getAccessToken();
  for (const letter of letters) {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?f=" + letter
    );

    if (!response.ok) {
      throw new Error(`Invalid Response: ${response.status}`);
    }

    const jsonData = await response.json();
    if (jsonData["meals"] === null) {
      continue;
    }
    const mealData = jsonData["meals"] as Array<any>;

    for (const meal of mealData) {
      const imageResponse = await fetch(meal["strMealThumb"]);
      if (!imageResponse.ok) {
        throw new Error("Invalid Image Response: " + imageResponse.status);
      }
      const imageData = await imageResponse.blob();
      const imageBuffer = await imageData.arrayBuffer();

      const blobName = randomUUID();

      containerClient
        .getBlobClient(blobName)
        .getBlockBlobClient()
        .uploadData(imageBuffer, {
          blobHTTPHeaders: { blobContentType: imageData.type },
        });

      const dishData: Dish = {
        name: meal["strMeal"],
        description: meal["strTags"],
        mainImage: {
          fileId: blobName,
          container: uploadContainer ?? "",
          crop: {
            y: 117,
            x: 0,
            width: 700,
            height: 467,
          },
        },
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
      }
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
  urlencoded.append(
    "client_secret",
    "bCU8Q~BaJ6DywNyyClQ64wcZ4quuFdOuq783bda7"
  );

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

loadDishData().catch((error: Error) => {
  console.error("Error occurred:", error);
});

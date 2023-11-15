import { Dish } from "@msimmdev/project-sangheili-types";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import sharp from "sharp";
import { exit } from "process";

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

const openai = new OpenAI();

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
  for (const letter of letters) {
    const access_token = await getAccessToken();
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
      const getDishparams = new URLSearchParams();
      getDishparams.append("name[$eq]", meal["strMeal"]);
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

      const imageResponse = await fetch(meal["strMealThumb"]);
      if (!imageResponse.ok) {
        throw new Error("Invalid Image Response: " + imageResponse.status);
      }
      const imageData = await imageResponse.blob();
      const imageBuffer = await imageData.arrayBuffer();

      const imageObj = sharp(imageBuffer);
      const imageMeta = await imageObj.metadata();

      const blobName = randomUUID();

      await containerClient
        .getBlobClient(blobName)
        .getBlockBlobClient()
        .uploadData(imageBuffer, {
          blobHTTPHeaders: { blobContentType: imageData.type },
        });

      const dishDescriptionResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a food website author. Respond only with single paragraph descriptions to the type of dish named by the user.",
          },
          { role: "user", content: meal["strMeal"] },
        ],
      });

      const dishData: Dish = {
        name: meal["strMeal"],
        description:
          dishDescriptionResponse.choices[0].message.content ?? meal["strTags"],
        mainImage: {
          fileId: blobName,
          container: uploadContainer ?? "",
          crop: {
            y: imageMeta.width ? Math.round(imageMeta.width / 6) : 117,
            x: 0,
            width: imageMeta.width ?? 700,
            height: imageMeta.width ? Math.round(imageMeta.width / 1.5) : 467,
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
        console.log(dishData);
        console.log(meal);
        console.error(`Error response ${response.status}`);
        console.error(await response.text());
        throw new Error(`Error response ${response.status}`);
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

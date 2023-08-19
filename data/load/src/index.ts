import { z } from "zod";
import { AppUser, DbMeta } from "@msimmdev/project-sangheili-types";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

type DbAppUser = AppUser & DbMeta;

dotenv.config({ path: "./dist/.env.local" });

const users_url = process.env.USERS_URL;
const token_url = process.env.TOKEN_URL;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const mongo_connection = process.env.MONGO_CONNECTION_STRING;
const admin_account_id = process.env.ADMIN_ACCOUNT_ID;

const tokenRes = z.object({
  token_type: z.string(),
  expires_in: z.number().int(),
  access_token: z.string(),
});

const userRes = z.object({
  value: z.array(
    z.object({
      id: z.string().uuid(),
      creationType: z.enum(["LocalAccount"]).nullable(),
      displayName: z.string(),
      createdDateTime: z.string().datetime(),
      identities: z.array(
        z.object({
          signInType: z.string(),
          issuerAssignedId: z.string().nullable(),
        })
      ),
    })
  ),
});

if (typeof token_url === "undefined") {
  throw new Error("Missing required environment variable TOKEN_URL");
}

if (typeof client_id === "undefined") {
  throw new Error("Missing required environment variable CLIENT_ID");
}

if (typeof client_secret === "undefined") {
  throw new Error("Missing required environment variable CLIENT_SECRET");
}

if (typeof users_url === "undefined") {
  throw new Error("Missing required environment variable USERS_URL");
}

if (typeof mongo_connection === "undefined") {
  throw new Error(
    "Missing required environment variable MONGO_CONNECTION_STRING"
  );
}

const client = new MongoClient(mongo_connection);
client.connect();

getAccessToken(token_url, client_id, client_secret)
  .then((token) => getUserData(token, users_url, admin_account_id))
  .then((users) => updateUses(users))
  .then(() => client.close());

async function getAccessToken(
  token_url: string,
  client_id: string,
  client_secret: string
): Promise<string> {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("client_id", client_id);
  urlencoded.append("client_secret", client_secret);
  urlencoded.append("scope", "https://graph.microsoft.com/.default");

  const response = await fetch(token_url, {
    method: "POST",
    body: urlencoded,
    headers: myHeaders,
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((json) => tokenRes.parseAsync(json));

  return response.access_token;
}

async function getUserData(
  access_token: string,
  users_url: string,
  admin_account_id?: string
): Promise<DbAppUser[]> {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${access_token}`);

  const response = await fetch(users_url, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  })
    .then((res) => res.json())
    .then((json) => userRes.parseAsync(json));

  const now = new Date().toJSON();

  return response.value
    .filter((item) => item.creationType === "LocalAccount")
    .map((item) => {
      const email = item.identities.find(
        (identity) => identity.signInType === "emailAddress"
      )?.issuerAssignedId;
      return {
        externalId: item.id,
        name: item.displayName,
        email: email || null,
        createdOn: now,
        lastUpdatedOn: null,
        roles: [
          item.id === admin_account_id ? "SuperAdmin" : "PrivateContributer",
        ],
      };
    });
}

async function updateUses(users: DbAppUser[]): Promise<void> {
  const database = client.db("sangheili");
  const usersCollection = database.collection("users");
  for (const user of users) {
    const storedUser = await usersCollection.findOne({
      externalId: user.externalId,
    });
    if (storedUser === null) {
      await usersCollection.insertOne(user);
    }
  }
}

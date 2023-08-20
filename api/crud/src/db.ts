import { MongoClient } from "mongodb";
import {
  Dish,
  DbId,
  DbMeta,
  OwnedResource,
  AppUser,
} from "@msimmdev/project-sangheili-types";

type DbDish = Dish & DbMeta & OwnedResource & Partial<DbId>;
type DbUser = AppUser & DbMeta;

const connectionString = process.env.MONGO_CONNECTION_STRING || "";
const client = new MongoClient(connectionString);
client.connect();
const database = client.db("sangheili");
const dishes = database.collection<DbDish>("dishes");
const users = database.collection<DbUser>("users");

export { dishes, users, DbDish, DbUser };

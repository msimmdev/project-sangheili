import { MongoClient } from "mongodb";

function useDB() {
  const connectionString = process.env.MONGO_CONNECTION_STRING || "";
  const client = new MongoClient(connectionString);
  const database = client.db("sangheili");
  const dishes = database.collection("dishes");
  return { client: client, dishes: dishes };
}

export { useDB };

import express, { Request, Response } from "express";
import { useDB } from "../db";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const newItem = req.body;
  const { client, dishes } = useDB();
  const data = await dishes.find();
  await client.close();
  res.status(200).json(data.toArray());
});

router.post("/", async (req: Request, res: Response) => {
  const newItem = req.body;
  const { client, dishes } = useDB();
  await dishes.insertOne(newItem);
  await client.close();
  res.status(200).end();
});

export default router;

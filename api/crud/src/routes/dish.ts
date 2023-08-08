import express, { Request, Response } from "express";
import { dishes } from "../db";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const data = await dishes.find({});
  res.status(200).json(await data.toArray());
});

router.post("/", async (req: Request, res: Response) => {
  const newItem = req.body;
  await dishes.insertOne(newItem);
  res.status(200).end();
});

export default router;

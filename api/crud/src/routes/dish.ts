import express, { Request, Response } from "express";
import { dishes } from "../db";
import { ZodIssue } from "zod";
import { Dish, DishSchema } from "@msimmdev/project-sangheili-types";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const dishData = await dishes.find({});
  const dishResult: Dish[] = [];
  for await (const dishObj of dishData) {
    dishResult.push(DishSchema.parse(dishObj));
  }
  res.status(200).json(dishResult);
});

router.post("/", async (req: Request, res: Response) => {
  let status = 200;
  let message: ZodIssue[] | undefined;
  try {
    const newItem = await DishSchema.safeParseAsync(req.body);
    if (newItem.success) {
      await dishes.insertOne(newItem);
    } else {
      status = 400;
      message = newItem.error.issues;
    }
  } catch (e) {
    console.error(e);
    status = 500;
  }
  if (message === undefined) {
    res.status(status).end();
  } else {
    res.status(status).json(message);
  }
});

export default router;

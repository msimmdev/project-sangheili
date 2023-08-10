import express from "express";
import { dishes } from "../db";
import { ObjectId } from "mongodb";
import {
  Dish,
  DishSchema,
  DbMeta,
  DbMetaSchema,
  DbId,
  DbIdSchema,
} from "@msimmdev/project-sangheili-types";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const dishData = await dishes.find({});
    const dishResult: (Dish & DbId & DbMeta)[] = [];
    for await (const dishObj of dishData) {
      dishObj.id = dishObj._id.toJSON();
      const parseResult = await DishSchema.merge(DbIdSchema)
        .merge(DbMetaSchema)
        .safeParseAsync(dishObj);
      if (parseResult.success) {
        dishResult.push(parseResult.data);
      } else {
        console.error(parseResult.error);
      }
    }
    res.status(200).json(dishResult);
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parseResult = await DishSchema.strict().safeParseAsync(req.body);
    if (!parseResult.success) {
      res.status(400).json(parseResult.error.issues);
    } else {
      const now = new Date().toJSON();
      const newItem: Dish & DbMeta = {
        ...parseResult.data,
        createdOn: now,
        lastUpdatedOn: now,
      };
      const insertResult = await dishes.insertOne({ ...newItem });
      const returnItem: Dish & DbMeta & DbId = {
        ...newItem,
        id: insertResult.insertedId.toJSON(),
      };
      res.status(201).json(returnItem);
    }
  } catch (e) {
    next(e);
  }
});

router.put("/:objectId", async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.objectId);
    const parseResult = await DishSchema.strict().safeParseAsync(req.body);
    if (!parseResult.success) {
      res.status(400).json(parseResult.error.issues);
    } else {
      const now = new Date().toJSON();
      const findItem = await dishes.findOne({ _id: id });
      if (findItem == null) {
        const newItem: Dish & DbMeta = {
          ...parseResult.data,
          createdOn: now,
          lastUpdatedOn: now,
        };
        const insertResult = await dishes.insertOne({ ...newItem, _id: id });
        const returnItem: Dish & DbMeta & DbId = {
          ...newItem,
          id: insertResult.insertedId.toJSON(),
        };
        res.status(201).json(returnItem);
      } else {
        const updatedItem: Dish & DbMeta = {
          ...parseResult.data,
          createdOn: findItem.createdOn,
          lastUpdatedOn: now,
        };
        await dishes.updateOne({ _id: id }, { $set: updatedItem });
        const returnItem: Dish & DbMeta & DbId = {
          ...updatedItem,
          id: findItem._id.toJSON(),
        };
        res.status(200).json(returnItem);
      }
    }
  } catch (e) {
    next(e);
  }
});

router.delete("/:objectId", async (req, res, next) => {
  try {
    const id = new ObjectId(req.params.objectId);
    let deleteResult = await dishes.deleteOne({ _id: id }, {});
    if (deleteResult.deletedCount === 1) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (e) {
    next(e);
  }
});

export default router;

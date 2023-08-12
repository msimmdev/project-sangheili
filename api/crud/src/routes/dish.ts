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
    const dishResult: (Dish & DbId & DbMeta)[] = [];
    const dishData = await dishes.find({});

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

    return res.status(200).json(dishResult);
  } catch (e) {
    return next(e);
  }
});

router.get("/:objectId", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const id = new ObjectId(req.params.objectId);
    const findItem = await dishes.findOne({ _id: id });

    if (findItem === null) {
      return res.status(404).end();
    }

    findItem.id = findItem._id.toJSON();
    const parseResult = await DishSchema.merge(DbIdSchema)
      .merge(DbMetaSchema)
      .safeParseAsync(findItem);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return res.status(500).end();
    }

    return res.status(200).json(parseResult.data);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parseResult = await DishSchema.strict().safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

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

    return res.status(201).json(returnItem);
  } catch (e) {
    return next(e);
  }
});

router.put("/:objectId", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const id = new ObjectId(req.params.objectId);
    const parseResult = await DishSchema.strict().safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    const now = new Date().toJSON();
    const findItem = await dishes.findOne({ _id: id });

    if (findItem === null) {
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

      return res.status(201).json(returnItem);
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

      return res.status(200).json(returnItem);
    }
  } catch (e) {
    return next(e);
  }
});

router.patch("/:objectId", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const id = new ObjectId(req.params.objectId);
    const parseResult = await DishSchema.partial()
      .strict()
      .safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    const findItem = await dishes.findOne({ _id: id });

    if (findItem === null) {
      return res.status(404).end();
    }

    const now = new Date().toJSON();
    const updatedItem: Partial<Dish> & DbMeta = {
      ...parseResult.data,
      createdOn: findItem.createdOn,
      lastUpdatedOn: now,
    };

    await dishes.updateOne({ _id: id }, { $set: updatedItem });

    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

router.delete("/:objectId", async (req, res, next) => {
  try {
    if (!ObjectId.isValid(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const id = new ObjectId(req.params.objectId);
    let deleteResult = await dishes.deleteOne({ _id: id }, {});

    if (deleteResult.deletedCount === 1) {
      return res.status(204).end();
    } else {
      return res.status(404).end();
    }
  } catch (e) {
    return next(e);
  }
});

export default router;

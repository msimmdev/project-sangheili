import express from "express";
import { DishSchema } from "@msimmdev/project-sangheili-types";
import { validateId } from "../persistance";
import {
  getDish,
  getDishes,
  storeDish,
  addOrReplaceDish,
  updateDish,
  deleteDish,
} from "../persistance/dish";

const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log(req.user);
  try {
    if (!req.hasScope("Dishes.Read") && !req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    const dishResult = await getDishes();

    return res.status(200).json(dishResult);
  } catch (e) {
    return next(e);
  }
});

router.get("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Dishes.Read") && !req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (!validateId(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const dish = await getDish(req.params.objectId);
    if (dish === null) {
      return res.sendStatus(404);
    }

    return res.status(200).json(dish);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    const parseResult = await DishSchema.strict().safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    const dish = await storeDish(parseResult.data);

    return res.status(201).json(dish);
  } catch (e) {
    return next(e);
  }
});

router.put("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (!validateId(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const parseResult = await DishSchema.strict().safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    const [dish, addedItem] = await addOrReplaceDish(
      req.params.objectId,
      parseResult.data
    );

    if (addedItem) {
      res.status(201).json(dish);
    } else {
      res.status(200).json(dish);
    }
  } catch (e) {
    return next(e);
  }
});

router.patch("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (!validateId(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const parseResult = await DishSchema.partial()
      .strict()
      .safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    const updateresult = await updateDish(
      req.params.objectId,
      parseResult.data
    );
    if (!updateresult) {
      return res.sendStatus(404);
    }

    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

router.delete("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (!validateId(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const deleteResult = await deleteDish(req.params.objectId);
    if (!deleteResult) {
      return res.sendStatus(404);
    }

    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

export default router;

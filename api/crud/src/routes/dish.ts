import express from "express";
import { DishSchema } from "@msimmdev/project-sangheili-types";
import { validateId } from "../persistance";
import {
  GetDish,
  GetDishes,
  StoreDish,
  AddOrReplaceDish,
  UpdateDish,
  DeleteDish,
} from "../persistance/dish";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (!req.hasScope("Dishes.Read") && !req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    const dishResult = await GetDishes();

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

    const dish = await GetDish(req.params.objectId);

    return res.status(200).json(dish);
  } catch (e) {
    let message: string;
    if (typeof e === "string") {
      message = e;
    } else if (e instanceof Error) {
      message = e.message;
    } else {
      return next(e);
    }

    if (message === "404") {
      return res.sendStatus(404);
    }

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

    const dish = await StoreDish(parseResult.data);

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

    const [dish, addedItem] = await AddOrReplaceDish(
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

    await UpdateDish(req.params.objectId, parseResult.data);

    return res.status(204).end();
  } catch (e) {
    let message: string;
    if (typeof e === "string") {
      message = e;
    } else if (e instanceof Error) {
      message = e.message;
    } else {
      return next(e);
    }

    if (message === "404") {
      return res.sendStatus(404);
    }

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

    await DeleteDish(req.params.objectId);

    return res.status(204).end();
  } catch (e) {
    let message: string;
    if (typeof e === "string") {
      message = e;
    } else if (e instanceof Error) {
      message = e.message;
    } else {
      return next(e);
    }

    if (message === "404") {
      return res.sendStatus(404);
    }

    return next(e);
  }
});

export default router;

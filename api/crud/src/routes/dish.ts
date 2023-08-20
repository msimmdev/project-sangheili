import express from "express";
import {
  Dish,
  DishSchema,
  OwnedResource,
} from "@msimmdev/project-sangheili-types";
import { validateId } from "../persistance";
import {
  getDish,
  getDishes,
  storeDish,
  updateDish,
  deleteDish,
} from "../persistance/dish";
import verifyAccess from "../util/verify-access";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (!req.hasScope("Dishes.Read") && !req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    const dishResult = await getDishes(req.user?.userId);
    const authorizedDishes = dishResult.filter((dish) =>
      verifyAccess(dish, "Read", req.user)
    );

    return res.status(200).json(authorizedDishes);
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
        .json({ code: "invalid_id", path: "objectId", message: "Invalid ID." });
    }

    const dish = await getDish(req.params.objectId);
    if (dish === null) {
      return res.sendStatus(404);
    }

    if (!verifyAccess(dish, "Read", req.user)) {
      return res.sendStatus(403);
    }

    return res.status(200).json(dish);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  console.log(req.user);
  try {
    if (!req.hasScope("Dishes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (typeof req.user === "undefined") {
      return res.sendStatus(403);
    }

    const newResource: OwnedResource = {
      visibility: "Private",
      owner: {
        name: req.user.name,
        userId: req.user.userId,
      },
      share: [],
    };

    if (!verifyAccess(newResource, "Create", req.user)) {
      console.log(newResource);
      console.log("403");
      return res.sendStatus(403);
    }

    const parseResult = await DishSchema.strict().safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    const dish = await storeDish(parseResult.data, newResource);

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

    if (typeof req.user === "undefined") {
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

    const findDish = await getDish(req.params.objectId);
    if (findDish === null) {
      const newResource: OwnedResource = {
        visibility: "Private",
        owner: {
          name: req.user.name,
          userId: req.user.userId,
        },
        share: [],
      };

      if (!verifyAccess(newResource, "Create", req.user)) {
        return res.sendStatus(403);
      }

      const dish = await storeDish(parseResult.data, newResource);
      return res.status(201).json(dish);
    } else {
      if (!verifyAccess(findDish, "Write", req.user)) {
        return res.sendStatus(403);
      }

      await updateDish(req.params.objectId, parseResult.data, findDish);

      return res.status(200).json({ ...findDish, ...parseResult.data });
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

    const findDish = await getDish(req.params.objectId);
    if (findDish === null) {
      return res.sendStatus(404);
    }

    if (!verifyAccess(findDish, "Write", req.user)) {
      return res.sendStatus(403);
    }

    const parseResult = await DishSchema.partial()
      .strict()
      .safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    await updateDish(req.params.objectId, parseResult.data, findDish);

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

    const findDish = await getDish(req.params.objectId);
    if (findDish === null) {
      return res.sendStatus(404);
    }

    if (!verifyAccess(findDish, "Write", req.user)) {
      return res.sendStatus(403);
    }

    await deleteDish(req.params.objectId);

    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

export default router;

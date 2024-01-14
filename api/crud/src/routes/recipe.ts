import express from "express";
import { validateId } from "../persistance";
import {
  getRecipes,
  getRecipe,
  storeRecipe,
  deleteRecipe,
  updateRecipe,
} from "../persistance/recipe";
import verifyAccess from "../util/verify-access";
import { RecipeSchema, OwnedResource } from "@msimmdev/project-sangheili-types";
import processImage from "../util/process-image";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    if (!req.hasScope("Recipes.Read") && !req.hasScope("Recipes.ReadWrite")) {
      return res.sendStatus(403);
    }

    const recipeResult = await getRecipes(
      !req.user?.roles.includes("SuperAdmin") ?? true,
      {},
      req.user?.userId
    );

    const authorizedRecipes = recipeResult.filter((recipe) =>
      verifyAccess(recipe, "Read", req.user)
    );
    return res.status(200).json(authorizedRecipes);
  } catch (e) {
    return next(e);
  }
});

router.get("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Recipes.Read") && !req.hasScope("Recipes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (!validateId(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invalid ID." });
    }

    const recipe = await getRecipe(req.params.objectId);
    if (recipe === null) {
      return res.sendStatus(404);
    }

    if (!verifyAccess(recipe, "Read", req.user)) {
      return res.sendStatus(403);
    }

    return res.status(200).json(recipe);
  } catch (e) {
    return next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.hasScope("Recipes.ReadWrite")) {
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

    const parseResult = await RecipeSchema.strict().safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    if (
      typeof parseResult.data.mainImage !== "undefined" &&
      "fileId" in parseResult.data.mainImage
    ) {
      const imageData = await processImage(
        parseResult.data.mainImage,
        "recipeimage"
      );
      parseResult.data.mainImage = imageData;
    }

    const recipe = await storeRecipe(parseResult.data, newResource);

    return res.status(201).json(recipe);
  } catch (e) {
    return next(e);
  }
});

router.put("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Recipes.ReadWrite")) {
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

    const parseResult = await RecipeSchema.strict().safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    if (
      typeof parseResult.data.mainImage !== "undefined" &&
      "fileId" in parseResult.data.mainImage
    ) {
      const imageData = await processImage(
        parseResult.data.mainImage,
        "recipeimage"
      );
      parseResult.data.mainImage = imageData;
    }

    const findRecipe = await getRecipe(req.params.objectId);
    if (findRecipe === null) {
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

      const recipe = await storeRecipe(parseResult.data, newResource);
      return res.status(201).json(recipe);
    } else {
      if (!verifyAccess(findRecipe, "Write", req.user)) {
        return res.sendStatus(403);
      }

      await updateRecipe(req.params.objectId, parseResult.data, findRecipe);

      return res.status(200).json({ ...findRecipe, ...parseResult.data });
    }
  } catch (e) {
    return next(e);
  }
});

router.patch("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Recipes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (!validateId(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const findRecipe = await getRecipe(req.params.objectId);
    if (findRecipe === null) {
      return res.sendStatus(404);
    }

    if (!verifyAccess(findRecipe, "Write", req.user)) {
      return res.sendStatus(403);
    }

    const parseResult = await RecipeSchema.partial()
      .strict()
      .safeParseAsync(req.body);

    if (!parseResult.success) {
      return res.status(400).json(parseResult.error.issues);
    }

    if (typeof parseResult.data.mainImage !== "undefined") {
      if ("fileId" in parseResult.data.mainImage) {
        const imageData = await processImage(
          parseResult.data.mainImage,
          "recipeimage"
        );
        parseResult.data.mainImage = imageData;
      }
    }

    await updateRecipe(req.params.objectId, parseResult.data, findRecipe);

    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

router.delete("/:objectId", async (req, res, next) => {
  try {
    if (!req.hasScope("Recipes.ReadWrite")) {
      return res.sendStatus(403);
    }

    if (!validateId(req.params.objectId)) {
      return res
        .status(400)
        .json({ code: "invalid_id", path: "objectId", message: "Invlid ID." });
    }

    const findRecipe = await getRecipe(req.params.objectId);
    if (findRecipe === null) {
      return res.sendStatus(404);
    }

    if (!verifyAccess(findRecipe, "Write", req.user)) {
      return res.sendStatus(403);
    }

    await deleteRecipe(req.params.objectId);

    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

export default router;

import {
  Recipe,
  DbMeta,
  RecipeSchema,
  DbIdSchema,
  DbMetaSchema,
  OwnedResource,
  OwnedResourceSchema,
} from "@msimmdev/project-sangheili-types";
import { recipes, DbRecipe } from "../db";
import { ObjectId, Filter } from "mongodb";

async function getRecipes(
  accessRestrictions: boolean,
  queryFilter: any,
  userId?: string
): Promise<DbRecipe[]> {
  const recipeResult: DbRecipe[] = [];

  const filters: Filter<DbRecipe>[] = [];
  if (accessRestrictions) {
    const accessFilters: Filter<DbRecipe>[] = [{ visibility: "Public" }];
    if (typeof userId !== "undefined") {
      accessFilters.push({ "owner.userId": userId });
      accessFilters.push({
        share: {
          $elemMatch: {
            $and: [
              { "sharedWith.userId": userId },
              { permissionLevel: "Read" },
            ],
          },
        },
      });
    }
    filters.push({ $or: accessFilters });
  }

  const filterObj: Filter<DbRecipe> = {};
  if (filters.length > 0) {
    filterObj.$and = filters;
  }

  const dishData = await recipes.find(filterObj);

  for await (const dishObj of dishData) {
    dishObj.id = dishObj._id.toJSON();
    const parseResult = await RecipeSchema.merge(DbIdSchema)
      .merge(DbMetaSchema)
      .merge(OwnedResourceSchema)
      .safeParseAsync(dishObj);

    if (parseResult.success) {
      recipeResult.push(parseResult.data);
    } else {
      console.error(parseResult.error);
    }
  }

  return recipeResult;
}

async function getRecipe(objectId: string): Promise<DbRecipe | null> {
  const id = new ObjectId(objectId);
  const findItem = await recipes.findOne({ _id: id });

  if (findItem === null) {
    return null;
  }

  findItem.id = findItem._id.toJSON();
  const parseResult = await RecipeSchema.merge(DbIdSchema)
    .merge(DbMetaSchema)
    .merge(OwnedResourceSchema)
    .parseAsync(findItem);

  return parseResult;
}

async function storeRecipe(
  recipe: Recipe,
  newResource: OwnedResource
): Promise<DbRecipe> {
  const now = new Date().toJSON();
  const newItem: Recipe & OwnedResource & DbMeta = {
    ...recipe,
    ...newResource,
    createdOn: now,
    lastUpdatedOn: null,
  };

  const insertResult = await recipes.insertOne({ ...newItem });

  const returnItem: DbRecipe = {
    ...newItem,
    id: insertResult.insertedId.toJSON(),
  };

  return returnItem;
}

async function updateRecipe(
  objectId: string,
  dish: Partial<Recipe>,
  findItem: DbMeta
): Promise<void> {
  const id = new ObjectId(objectId);

  const now = new Date().toJSON();
  const updatedItem: Partial<Recipe> & DbMeta = {
    ...dish,
    createdOn: findItem.createdOn,
    lastUpdatedOn: now,
  };

  await recipes.updateOne({ _id: id }, { $set: updatedItem });
}

async function deleteRecipe(objectId: string): Promise<void> {
  const id = new ObjectId(objectId);

  await recipes.deleteOne({ _id: id }, {});
}

export { getRecipes, getRecipe, storeRecipe, updateRecipe, deleteRecipe };

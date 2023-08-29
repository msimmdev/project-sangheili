import {
  Dish,
  DbMeta,
  DishSchema,
  DbIdSchema,
  DbMetaSchema,
  OwnedResource,
  OwnedResourceSchema,
} from "@msimmdev/project-sangheili-types";
import { dishes, DbDish } from "../db";
import { ObjectId, Filter } from "mongodb";

async function getDishes(
  accessRestrictions: boolean,
  userId?: string
): Promise<DbDish[]> {
  const dishResult: DbDish[] = [];

  const accessFilters: Filter<DbDish>[] = [];
  if (accessRestrictions) {
    accessFilters.push({ visibility: "Public" });
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
  }

  const dishData = await dishes.find({ $and: [{ $or: accessFilters }] });

  for await (const dishObj of dishData) {
    dishObj.id = dishObj._id.toJSON();
    const parseResult = await DishSchema.merge(DbIdSchema)
      .merge(DbMetaSchema)
      .merge(OwnedResourceSchema)
      .safeParseAsync(dishObj);

    if (parseResult.success) {
      dishResult.push(parseResult.data);
    } else {
      console.error(parseResult.error);
    }
  }

  return dishResult;
}

async function getDish(objectId: string): Promise<DbDish | null> {
  const id = new ObjectId(objectId);
  const findItem = await dishes.findOne({ _id: id });

  if (findItem === null) {
    return null;
  }

  findItem.id = findItem._id.toJSON();
  const parseResult = await DishSchema.merge(DbIdSchema)
    .merge(DbMetaSchema)
    .merge(OwnedResourceSchema)
    .parseAsync(findItem);

  return parseResult;
}

async function storeDish(
  dish: Dish,
  newResource: OwnedResource
): Promise<DbDish> {
  const now = new Date().toJSON();
  const newItem: Dish & OwnedResource & DbMeta = {
    ...dish,
    ...newResource,
    createdOn: now,
    lastUpdatedOn: null,
  };

  const insertResult = await dishes.insertOne({ ...newItem });

  const returnItem: DbDish = {
    ...newItem,
    id: insertResult.insertedId.toJSON(),
  };

  return returnItem;
}

async function updateDish(
  objectId: string,
  dish: Partial<Dish>,
  findItem: DbMeta
): Promise<void> {
  const id = new ObjectId(objectId);

  const now = new Date().toJSON();
  const updatedItem: Partial<Dish> & DbMeta = {
    ...dish,
    createdOn: findItem.createdOn,
    lastUpdatedOn: now,
  };

  await dishes.updateOne({ _id: id }, { $set: updatedItem });
}

async function deleteDish(objectId: string): Promise<void> {
  const id = new ObjectId(objectId);

  await dishes.deleteOne({ _id: id }, {});
}

export { getDishes, getDish, storeDish, updateDish, deleteDish };

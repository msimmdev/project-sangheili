import {
  Dish,
  DbId,
  DbMeta,
  DishSchema,
  DbIdSchema,
  DbMetaSchema,
  OwnedResource,
  OwnedResourceSchema,
} from "@msimmdev/project-sangheili-types";
import { dishes } from "../db";
import { ObjectId } from "mongodb";

async function getDishes(): Promise<(Dish & DbId & DbMeta & OwnedResource)[]> {
  const dishResult: (Dish & DbId & DbMeta & OwnedResource)[] = [];
  const dishData = await dishes.find({});

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

async function getDish(
  objectId: string
): Promise<(Dish & DbId & DbMeta & OwnedResource) | null> {
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
): Promise<Dish & OwnedResource & DbMeta & DbId> {
  const now = new Date().toJSON();
  const newItem: Dish & OwnedResource & DbMeta = {
    ...dish,
    ...newResource,
    createdOn: now,
    lastUpdatedOn: null,
  };

  const insertResult = await dishes.insertOne({ ...newItem });

  const returnItem: Dish & OwnedResource & DbMeta & DbId = {
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

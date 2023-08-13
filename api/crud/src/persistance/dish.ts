import {
  Dish,
  DbId,
  DbMeta,
  DishSchema,
  DbIdSchema,
  DbMetaSchema,
} from "@msimmdev/project-sangheili-types";
import { dishes } from "../db";
import { ObjectId } from "mongodb";

async function GetDishes(): Promise<(Dish & DbId & DbMeta)[]> {
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

  return dishResult;
}

async function GetDish(objectId: string): Promise<Dish & DbId & DbMeta> {
  const id = new ObjectId(objectId);
  const findItem = await dishes.findOne({ _id: id });

  if (findItem === null) {
    throw new Error("404");
  }

  findItem.id = findItem._id.toJSON();
  const parseResult = await DishSchema.merge(DbIdSchema)
    .merge(DbMetaSchema)
    .safeParseAsync(findItem);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.message);
  }

  return parseResult.data;
}

async function StoreDish(dish: Dish): Promise<Dish & DbMeta & DbId> {
  const now = new Date().toJSON();
  const newItem: Dish & DbMeta = {
    ...dish,
    createdOn: now,
    lastUpdatedOn: now,
  };

  const insertResult = await dishes.insertOne({ ...newItem });

  const returnItem: Dish & DbMeta & DbId = {
    ...newItem,
    id: insertResult.insertedId.toJSON(),
  };

  return returnItem;
}

async function AddOrReplaceDish(
  objectId: string,
  dish: Dish
): Promise<[Dish & DbMeta & DbId, boolean]> {
  const id = new ObjectId(objectId);

  const now = new Date().toJSON();
  const findItem = await dishes.findOne({ _id: id });

  if (findItem === null) {
    const newItem: Dish & DbMeta = {
      ...dish,
      createdOn: now,
      lastUpdatedOn: now,
    };

    const insertResult = await dishes.insertOne({ ...newItem, _id: id });

    return [
      {
        ...newItem,
        id: insertResult.insertedId.toJSON(),
      },
      true,
    ];
  } else {
    const updatedItem: Dish & DbMeta = {
      ...dish,
      createdOn: findItem.createdOn,
      lastUpdatedOn: now,
    };

    await dishes.updateOne({ _id: id }, { $set: updatedItem });

    return [
      {
        ...updatedItem,
        id: findItem._id.toJSON(),
      },
      false,
    ];
  }
}

async function UpdateDish(
  objectId: string,
  dish: Partial<Dish>
): Promise<void> {
  const id = new ObjectId(objectId);

  const findItem = await dishes.findOne({ _id: id });

  if (findItem === null) {
    throw new Error("404");
  }

  const now = new Date().toJSON();
  const updatedItem: Partial<Dish> & DbMeta = {
    ...dish,
    createdOn: findItem.createdOn,
    lastUpdatedOn: now,
  };

  await dishes.updateOne({ _id: id }, { $set: updatedItem });
}

async function DeleteDish(objectId: string): Promise<void> {
  const id = new ObjectId(objectId);

  let deleteResult = await dishes.deleteOne({ _id: id }, {});

  if (deleteResult.deletedCount !== 1) {
    throw new Error("404");
  }
}

export {
  GetDishes,
  GetDish,
  StoreDish,
  AddOrReplaceDish,
  UpdateDish,
  DeleteDish,
};

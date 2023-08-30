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
import { DishFilter } from "../filters/get-dishes-filter";

async function getDishes(
  accessRestrictions: boolean,
  queryFilter: DishFilter,
  userId?: string
): Promise<DbDish[]> {
  const dishResult: DbDish[] = [];

  const filters: Filter<DbDish>[] = [];
  if (accessRestrictions) {
    const accessFilters: Filter<DbDish>[] = [{ visibility: "Public" }];
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

  if (typeof queryFilter !== "undefined") {
    if (typeof queryFilter.name?.$eq !== "undefined") {
      filters.push({ name: queryFilter.name.$eq });
    }

    if (typeof queryFilter.name?.$contains !== "undefined") {
      filters.push({
        name: { $regex: queryFilter.name?.$contains, $options: "i" },
      });
    }

    if (typeof queryFilter.visibility?.$eq !== "undefined") {
      filters.push({ visibility: queryFilter.visibility?.$eq });
    }

    if (typeof queryFilter.createdOn?.$gt !== "undefined") {
      filters.push({ createdOn: { $gt: queryFilter.createdOn?.$gt } });
    }

    if (typeof queryFilter.createdOn?.$lt !== "undefined") {
      filters.push({ createdOn: { $lt: queryFilter.createdOn?.$lt } });
    }

    if (typeof queryFilter.createdOn?.$gte !== "undefined") {
      filters.push({ createdOn: { $gte: queryFilter.createdOn?.$gte } });
    }

    if (typeof queryFilter.createdOn?.$lte !== "undefined") {
      filters.push({ createdOn: { $lte: queryFilter.createdOn?.$lte } });
    }

    if (typeof queryFilter.lastUpdatedOn?.$gt !== "undefined") {
      filters.push({ lastUpdatedOn: { $gt: queryFilter.lastUpdatedOn?.$gt } });
    }

    if (typeof queryFilter.lastUpdatedOn?.$lt !== "undefined") {
      filters.push({ lastUpdatedOn: { $lt: queryFilter.lastUpdatedOn?.$lt } });
    }

    if (typeof queryFilter.lastUpdatedOn?.$gte !== "undefined") {
      filters.push({
        lastUpdatedOn: { $gte: queryFilter.lastUpdatedOn?.$gte },
      });
    }

    if (typeof queryFilter.lastUpdatedOn?.$lte !== "undefined") {
      filters.push({
        lastUpdatedOn: { $lte: queryFilter.lastUpdatedOn?.$lte },
      });
    }

    if (typeof queryFilter.owner?.$eq !== "undefined") {
      filters.push({
        "owner.userId":
          queryFilter.owner?.$eq === "$me" ? userId : queryFilter.owner?.$eq,
      });
    }

    if (typeof queryFilter.shared?.$eq !== "undefined") {
      filters.push({
        share: {
          $elemMatch: {
            $and: [
              {
                "sharedWith.userId":
                  queryFilter.owner?.$eq === "$me"
                    ? userId
                    : queryFilter.owner?.$eq,
              },
              { permissionLevel: "Read" },
            ],
          },
        },
      });
    }
  }

  const filterObj: Filter<DbDish> = {};
  if (filters.length > 0) {
    filterObj.$and = filters;
  }

  const dishData = await dishes.find(filterObj);

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

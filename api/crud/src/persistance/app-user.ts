import { users } from "../db";
import {
  AppUser,
  AppUserSchema,
  DbMeta,
} from "@msimmdev/project-sangheili-types";

async function getAppUser(externalId: string): Promise<AppUser | null> {
  const findItem = await users.findOne({ externalId: externalId });

  if (findItem === null) {
    return null;
  }

  return await AppUserSchema.parseAsync(findItem);
}

async function storeAppUser(user: AppUser): Promise<boolean> {
  const findItem = await users.findOne({ externalId: user.externalId });

  if (findItem !== null) {
    return false;
  }

  const now = new Date().toJSON();
  const newUser: AppUser & DbMeta = {
    ...user,
    createdOn: now,
    lastUpdatedOn: null,
  };

  await users.insertOne(newUser);

  return true;
}

async function updateAppUser(
  externalId: string,
  user: Partial<AppUser>
): Promise<boolean> {
  const findItem = await users.findOne({ externalId: externalId });

  if (findItem === null) {
    return false;
  }

  const now = new Date().toJSON();
  const updateUser: Partial<AppUser> & DbMeta = {
    ...user,
    createdOn: findItem.createdOn,
    lastUpdatedOn: now,
  };

  await users.updateOne({ _id: findItem.id }, { $set: updateUser });

  return true;
}

export { getAppUser, storeAppUser, updateAppUser };
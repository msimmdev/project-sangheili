import { users } from "../db";
import { AppUser, AppUserSchema } from "@msimmdev/project-sangheili-types";

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

  await users.insertOne({ ...user });

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

  await users.updateOne({ _id: findItem.id }, { $set: user });

  return true;
}

export { getAppUser, storeAppUser, updateAppUser };

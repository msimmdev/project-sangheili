import { users } from "../db";
import { AppUser, AppUserSchema } from "@msimmdev/project-sangheili-types";

async function getAppUser(userId: string): Promise<AppUser | null> {
  const findItem = await users.findOne({ userId: userId });

  if (findItem === null) {
    return null;
  }

  return await AppUserSchema.parseAsync(findItem);
}

export { getAppUser };

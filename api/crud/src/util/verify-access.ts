import {
  AppUser,
  OwnedResource,
  ResourceAction,
} from "@msimmdev/project-sangheili-types";

function verifyAccess(
  resource: OwnedResource,
  action: ResourceAction,
  user?: AppUser
): boolean {
  if (resource.visibility === "Public" && action === "Read") {
    return true;
  }

  if (typeof user !== "undefined") {
    if (user.roles.includes("SuperAdmin")) {
      return true;
    }

    if (user.roles.includes("PrivateContributer")) {
      if (resource.owner.userId === user.userId) {
        return true;
      }

      if (
        resource.share.some(
          (share) =>
            share.sharedWith.userId === user.userId &&
            share.permissionLevel === action
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

export default verifyAccess;

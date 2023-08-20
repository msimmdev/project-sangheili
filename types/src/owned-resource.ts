import { z } from "zod";
import { AppUserSchema } from "./app-user";

const ResourceVisibilitySchema = z.enum(["Public", "Private"]);
const ResourceActionSchema = z.enum(["Read", "Create", "Write", "Delete"]);

type ResourceVisibility = z.infer<typeof ResourceVisibilitySchema>;
type ResourceAction = z.infer<typeof ResourceActionSchema>;

const AppUserRef = AppUserSchema.pick({ name: true, userId: true });

const OwnedResourceSchema = z.object({
  visibility: ResourceVisibilitySchema,
  owner: AppUserRef,
  share: z
    .array(
      z.object({
        permissionLevel: ResourceActionSchema,
        sharedWith: AppUserRef,
      })
    )
    .default([]),
});

type OwnedResource = z.infer<typeof OwnedResourceSchema>;

export {
  OwnedResourceSchema,
  OwnedResource,
  ResourceVisibilitySchema,
  ResourceVisibility,
  ResourceActionSchema,
  ResourceAction,
};

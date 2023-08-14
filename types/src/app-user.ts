import { z } from "zod";

const AppUserSchema = z.object({
  externalId: z.string().uuid(),
  name: z.string(),
  profileImage: z.string().url().optional(),
  roles: z.array(z.enum(["SuperAdmin", "PrivateContributer"])),
});

type AppUser = z.infer<typeof AppUserSchema>;

export { AppUserSchema, AppUser };

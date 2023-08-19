import { z } from "zod";

const AppUserSchema = z.object({
  externalId: z.string().uuid(),
  email: z.string().email().nullable(),
  name: z.string(),
  roles: z.array(z.enum(["SuperAdmin", "PrivateContributer"])),
});

type AppUser = z.infer<typeof AppUserSchema>;

export { AppUserSchema, AppUser };

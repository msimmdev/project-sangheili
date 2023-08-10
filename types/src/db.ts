import { z } from "zod";

const DbIdSchema = z.object({
  id: z.string(),
});

type DbId = z.infer<typeof DbIdSchema>;

const DbMetaSchema = z.object({
  createdOn: z.string().datetime(),
  lastUpdatedOn: z.string().datetime(),
});

type DbMeta = z.infer<typeof DbMetaSchema>;

export { DbId, DbIdSchema, DbMeta, DbMetaSchema };

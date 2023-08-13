import { ObjectId } from "mongodb";

function validateId(id: string): boolean {
  return ObjectId.isValid(id);
}

export { validateId };

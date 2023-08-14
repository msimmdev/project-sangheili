import { AppUser } from "@msimmdev/project-sangheili-types";
import { JwtPayload } from "jsonwebtoken";

export {};

declare global {
  namespace Express {
    export interface Request {
      userToken?: JwtPayload;
      user?: AppUser;
      scopes?: string[];
      hasScope: (scope: string) => boolean;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    scp?: string | undefined;
  }
}

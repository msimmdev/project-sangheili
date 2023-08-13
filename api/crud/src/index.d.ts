import { JwtPayload } from "jsonwebtoken";

export {};

declare global {
  namespace Express {
    export interface Request {
      userToken?: JwtPayload;
      scopes: string[] | undefined;
      hasScope: (scope: string) => boolean;
    }
  }
}

declare module "jsonwebtoken" {
  export interface JwtPayload {
    scp?: string | undefined;
  }
}

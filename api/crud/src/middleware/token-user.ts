import { Request, Response, NextFunction } from "express";
import { getAppUser } from "../persistance/app-user";
import { AppUserSchema } from "@msimmdev/project-sangheili-types";

function tokenUser(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return async (req, res, next) => {
    if (typeof req.userToken !== "undefined") {
      if (typeof req.userToken.sub !== "undefined") {
        let user = await getAppUser(req.userToken.sub || "");
        if (user !== null) {
          req.user = user;
        } else {
          const parseResult = await AppUserSchema.safeParseAsync({
            externalId: req.userToken.sub,
            name: req.userToken.name,
            roles: ["PrivateContributer"],
          });

          if (parseResult.success) {
            req.user = parseResult.data;
          }
        }
      }
    }
    next();
  };
}

export default tokenUser;

import { Request, Response, NextFunction } from "express";

function tokenScopes(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return (req, res, next) => {
    if (typeof req.userToken !== "undefined") {
      if (
        typeof req.userToken.scp !== "undefined" &&
        req.userToken.scp != null
      ) {
        req.scopes = req.userToken.scp.split(" ");
      }
    }
    req.hasScope = (scope) =>
      typeof req.scopes !== "undefined" && req.scopes.indexOf(scope) >= 0;
    next();
  };
}

export default tokenScopes;

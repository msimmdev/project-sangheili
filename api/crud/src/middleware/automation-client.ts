import { Request, Response, NextFunction } from "express";

function automationClient(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return async (req, res, next) => {
    if (typeof req.userToken !== "undefined") {
      if (typeof req.userToken.sub !== "undefined") {
        req.user = {
          userId: req.userToken.sub,
          email: "example@example.com",
          name: "Automation User",
          roles: ["SuperAdmin"],
        };
      }
    }
    req.hasScope = () => true;
    next();
  };
}

export default automationClient;

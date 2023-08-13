import express, { NextFunction, Request, Response } from "express";
import dishRouter from "./routes/dish";
import oidcVerifyToken from "./middleware/oidc-verify-token";
import tokenScopes from "./middleware/token-scopes";

const app = express();
const port = 3100;

app.use(oidcVerifyToken());
app.use(tokenScopes());

app.use(express.json());

app.use("/dish", dishRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).end();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

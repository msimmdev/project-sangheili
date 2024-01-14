import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dishRouter from "./routes/dish";
import recipeRouter from "./routes/recipe";
import uploadSessionRouter from "./routes/uploadSession";
import oidcVerifyToken from "./middleware/oidc-verify-token";
import tokenScopes from "./middleware/token-scopes";
import tokenUser from "./middleware/token-user";
import automationClient from "./middleware/automation-client";

const app = express();
const port = 3100;

app.use(cors());

app.use(oidcVerifyToken());
app.use(tokenScopes());
if (process.env.AUTH_AUTOMATION_MODE === "true") {
  app.use(automationClient());
} else {
  app.use(tokenUser());
}

app.use(express.json());

app.use("/dish", dishRouter);
app.use("/recipe", recipeRouter);
app.use("/upload-session", uploadSessionRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).end();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

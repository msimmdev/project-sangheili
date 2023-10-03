import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dishRouter from "./routes/dish";
import uploadSessionRouter from "./routes/uploadSession";
import oidcVerifyToken from "./middleware/oidc-verify-token";
import tokenScopes from "./middleware/token-scopes";
import tokenUser from "./middleware/token-user";

const app = express();
const port = 3100;

app.use(cors());

app.use(oidcVerifyToken());
app.use(tokenScopes());
app.use(tokenUser());

app.use(express.json());

app.use("/dish", dishRouter);
app.use("/upload-session", uploadSessionRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).end();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

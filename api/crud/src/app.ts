import express, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dishRouter from "./routes/dish";
import { OidcClient } from "oidc-client-ts";
import { subtle, KeyObject } from "crypto";

const app = express();
const port = 3100;
const metadataService = new OidcClient({
  authority:
    "https://sangheili.b2clogin.com/sangheili.onmicrosoft.com/B2C_1_account/v2.0/",
  client_id: "e290f4cc-3569-47a6-8682-986966185ea1",
  redirect_uri: "",
}).metadataService;

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "undefined") {
    return next();
    //return res.sendStatus(403);
  }

  const [tokenType, token] = authHeader.split(" ");

  if (tokenType !== "Bearer") {
    console.log(tokenType);
    return res.sendStatus(403);
  }

  const signingKeys = await metadataService.getSigningKeys();
  await jwt.verify(
    token,
    async (header, callback) => {
      if (signingKeys != null) {
        const useKey = signingKeys.find((key) => key["kid"] === header.kid);
        if (typeof useKey !== "undefined") {
          const jsonKey = JSON.stringify(useKey);
          const key = await subtle.importKey(
            "jwk",
            useKey,
            { hash: "SHA-256", name: "RSA-OAEP" },
            true,
            []
          );
          callback(null, KeyObject.from(key));
        }
      }
    },
    {
      issuer: process.env.AUTH_VALID_ISS,
      audience: process.env.AUTH_VALID_AUD,
    },
    (err, token) => {
      if (err !== null) {
        console.log(err);
        return res.sendStatus(403);
      }

      if (typeof token === "string" || typeof token === "undefined") {
        return res.sendStatus(403);
      }

      req.userToken = token;
    }
  );
  next();
});

app.use(express.json());

app.use("/dish", dishRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).end();
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

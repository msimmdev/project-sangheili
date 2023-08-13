import { NextFunction, Request, Response } from "express";
import { OidcClient } from "oidc-client-ts";
import jwt, { JwtPayload } from "jsonwebtoken";
import { subtle, KeyObject } from "crypto";

const metadataService = new OidcClient({
  authority:
    "https://sangheili.b2clogin.com/sangheili.onmicrosoft.com/B2C_1_account/v2.0/",
  client_id: "e290f4cc-3569-47a6-8682-986966185ea1",
  redirect_uri: "",
}).metadataService;

function oidcVerifyToken(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === "undefined") {
      return res.sendStatus(403);
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
            const key = await subtle.importKey(
              "jwk",
              useKey,
              { hash: "SHA-256", name: "RSASSA-PKCS1-v1_5" },
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
    return next();
  };
}

export default oidcVerifyToken;
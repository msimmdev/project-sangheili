import e, { NextFunction, Request, Response } from "express";
import { OidcClient } from "oidc-client-ts";
import jwt from "jsonwebtoken";
import { subtle, KeyObject } from "crypto";

const metadataService = new OidcClient({
  authority: process.env.AUTH_AUTHORITY || "",
  client_id: "",
  redirect_uri: "",
}).metadataService;

function oidcVerifyToken(): (
  req: Request,
  res: Response,
  next: NextFunction
) => void {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === "undefined" || authHeader === "") {
      return res.sendStatus(401);
    }

    const [tokenType, token] = authHeader.split(" ");

    if (tokenType !== "Bearer") {
      return res.status(400).json({
        code: "invalid_token_type",
        path: "[header]authorization",
        message: "Invalid Token Type.",
      });
    }

    const signingKeys = await metadataService.getSigningKeys();
    await jwt.verify(
      token,
      async (header, callback) => {
        if (header.alg === "RS256") {
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
            } else {
              return res.sendStatus(401);
            }
          } else {
            return res.sendStatus(401);
          }
        } else if (
          header.alg === "HS256" &&
          process.env.AUTH_ALLOW_LOCAL_TOKENS === "true"
        ) {
          callback(null, process.env.AUTH_LOCAL_SECRET);
        } else {
          return res.sendStatus(401);
        }
      },
      {
        issuer: process.env.AUTH_VALID_ISS,
        audience: process.env.AUTH_VALID_AUD,
      },
      (err, token) => {
        if (err !== null) {
          return res.status(400).json({
            code: "invalid_token",
            path: "[header]authorization",
            message: "Invalid Token.",
          });
        }

        if (typeof token === "string" || typeof token === "undefined") {
          return res.sendStatus(401);
        }

        req.userToken = token;
        return next();
      }
    );
  };
}

export default oidcVerifyToken;

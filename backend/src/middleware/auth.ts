import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

const checkPermissions = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.auth as { payload?: { permissions?: string[] } } | undefined;
    const permissions = auth?.payload?.permissions || [];

    if (!permissions.includes("manage:portfolio")) {
      res.status(403).json({ message: `Forbidden: You don't have access to manage the portfolio. Auth object: ${JSON.stringify(auth)}` });
      return;
    }

    next();
  };
};

export { checkJwt, checkPermissions };
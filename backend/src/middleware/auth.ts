import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import pino from 'pino';

dotenv.config();

const logger = pino({ level: 'info' });

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  tokenSigningAlg: "RS256",
});

const checkPermissions = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info('checkPermissions called');
    const auth = req.auth as { payload?: { permissions?: string[] } } | undefined;
    const permissions = auth?.payload?.permissions || [];

    if (!permissions.includes("manage:portfolio")) {
      logger.warn('Forbidden: User does not have the required permissions', { auth });
      res.status(403).json({ message: `Forbidden: You don't have access to manage the portfolio. Auth object: ${JSON.stringify(auth)}` });
      return;
    }

    logger.info('Permissions check passed');
    next();
  };
};

export { checkJwt, checkPermissions };
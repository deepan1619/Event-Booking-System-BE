import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONSTANTS } from '../Constants/constants';
import logger from '../Logger/logger';
import { nowISO } from '../Utils/time';

/**
 * Authenticates incoming requests by validating the JWT token,
 * attaching authenticated user details to the request context.
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const request_id = req.headers['x-request-id'] as string;
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      status: 'Failure',
      code: 401,
      message: 'Unauthorized',
      request_id,
      timestamp: nowISO(),
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      CONSTANTS.JWT.SECRET
    ) as {
      uuid: string;
      role?: string;
    };

    req.user = {
      uuid: decoded.uuid,
      role: decoded.role,
    };

    logger.info('authMiddleware:AUTHORIZED', {
      user_uuid: decoded.uuid,
      role: decoded.role,
    });

    next();
  } catch (error) {
    logger.warn('authMiddleware:INVALID_TOKEN', {
      error,
    });

    return res.status(401).json({
      status: 'Failure',
      code: 401,
      message: 'Invalid token',
      request_id,
      timestamp: nowISO(),
    });
  }
};

/**
 * Enforces role-based access control by allowing only users
 * with the specified role to access the protected route.
 */
export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const request_id = req.headers['x-request-id'] as string;

    if (!req.user) {
      return res.status(401).json({
        status: 'Failure',
        code: 401,
        message: 'Unauthorized',
        request_id,
        timestamp: nowISO()
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        status: 'Failure',
        code: 401,
        message: 'Forbidden: Insufficient permissions',
        request_id,
        timestamp: nowISO()
      });
    }

    next();
  };
};

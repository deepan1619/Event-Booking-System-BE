import { Request, Response, NextFunction } from 'express';
import logger from '../Logger/logger';
import { ApiResponse } from '../Interfaces/api_response.interface';
import { nowISO } from '../Utils/time';
import { isAppError } from '../Errors/app.error';

/**
 * Handles all uncaught errors in the application by distinguishing
 * between operational and unexpected errors and returning a
 * consistent API response format.
 */
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const request_id =
    (req.headers['x-request-id'] as string) || 'unknown';

  if (isAppError(err)) {
    logger.warn('Operational error', {
      request_id,
      message: err.message,
      statusCode: err.statusCode,
    });

    const apiResponse: ApiResponse = {
      status: 'Failure',
      code: err.statusCode,
      message: err.message,
      request_id,
      timestamp: nowISO(),
    };

    return res.status(err.statusCode).json(apiResponse);
  }

  if (err instanceof Error) {
    logger.error('Unhandled exception', {
      request_id,
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.error('Unhandled non-error thrown', {
      request_id,
      type: typeof err,
      value: err,
    });
  }

  const apiResponse: ApiResponse = {
    status: 'Failure',
    code: 500,
    message: 'Internal Server Error',
    request_id,
    timestamp: nowISO(),
  };

  res.status(500).json(apiResponse);
};

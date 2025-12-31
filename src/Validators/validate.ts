import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ApiResponse } from '../Interfaces/api_response.interface';
import logger from '../Logger/logger';
import { nowISO } from '../Utils/time';

/**
 * Validates incoming request bodies against a Joi schema,
 * sanitizes the payload, and returns a standardized error
 * response when validation fails.
 */
export const validate =
  (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const request_id =
      (req.headers['x-request-id'] as string) || 'unknown';

    logger.info('Validation middleware IN', { request_id });

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const validationErrors = error.details.map((d) => d.message);

      logger.warn('Validation failed', {
        request_id,
        errors: validationErrors,
      });

      const apiResponse: ApiResponse = {
        status: 'Failure',
        code: 400,
        message: 'Validation failed',
        data: {
          errors: validationErrors,
        },
        request_id,
        timestamp: nowISO(),
      };

      return res.status(400).json(apiResponse);
    }

    req.body = value;

    logger.info('Validation middleware OUT', { request_id });

    next();
  };

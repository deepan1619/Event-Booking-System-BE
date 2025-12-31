import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../Logger/logger';
import { requestContext } from '../Utils/request_context';

export const REQUEST_ID_HEADER = 'x-request-id';

/**
 * Assigns or propagates a request ID for each incoming request
 * and binds it to the async context for request-level tracing.
 */
export const requestIdMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const incomingRequestId =
        req.headers[REQUEST_ID_HEADER] as string | undefined;

    const request_id = incomingRequestId || uuidv4();

    req.headers[REQUEST_ID_HEADER] = request_id;
    res.setHeader(REQUEST_ID_HEADER, request_id);

    requestContext.run({ request_id }, () => {
        logger.debug('Request ID assigned');
        next();
    });
};

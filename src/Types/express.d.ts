import 'express-serve-static-core';

/**
 * Extends the Express Request object to include
 * authenticated user context populated by auth middleware.
 */
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            uuid: string;
            role?: string;
        };
    }
}

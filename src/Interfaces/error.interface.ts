/**
 * Extends the native Error object to include
 * application-specific metadata for centralized error handling.
 */
export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}

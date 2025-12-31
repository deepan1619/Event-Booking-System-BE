import { AppError } from '../Interfaces/error.interface';

/**
 * Internal unique symbol used to mark operational application errors
 * and reliably distinguish them from unknown runtime errors.
 */
const APP_ERROR_SYMBOL = Symbol('APP_ERROR');

/**
 * Creates a standardized application error with an HTTP status code
 * and operational error flag for centralized error handling.
 */
export const createAppError = (
    message: string,
    statusCode: number,
    isOperational = true
): AppError => {
    const error = new Error(message) as AppError;

    error.statusCode = statusCode;
    error.isOperational = isOperational;

    (error as any)[APP_ERROR_SYMBOL] = true;

    Error.captureStackTrace(error);

    return error;
};

/**
 * Type guard to safely determine whether an unknown error
 * is a recognized operational application error.
 */
export const isAppError = (error: unknown): error is AppError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        (error as any)[APP_ERROR_SYMBOL] === true &&
        typeof (error as any).statusCode === 'number'
    );
};

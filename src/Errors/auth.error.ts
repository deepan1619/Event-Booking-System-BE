import { createAppError } from './app.error';

/**
 * Creates an error indicating that a user with the given email
 * already exists in the system.
 */
export const userAlreadyExistsError = (email: string) =>
    createAppError(
        `User with email ${email} already exists`,
        409
    );

/**
 * Creates an error indicating invalid login credentials.
 */
export const invalidCredentialsError = () =>
    createAppError(
        'Invalid email or password',
        401
    );

/**
 * Creates an error indicating that the requested user
 * does not exist in the system.
 */
export const userNotFoundError = () =>
    createAppError(
        'User not found',
        404
    );

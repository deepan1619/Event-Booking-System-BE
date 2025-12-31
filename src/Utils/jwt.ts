import jwt from 'jsonwebtoken';
import { CONSTANTS } from '../Constants/constants';

/**
 * Generates a signed JWT using the configured secret
 * and expiration settings.
 */
export const signToken = (payload: any) =>
  jwt.sign(payload, CONSTANTS.JWT.SECRET, {
    expiresIn: CONSTANTS.JWT.EXPIRES_IN,
  });

/**
 * Extracts the user identifier from a verified JWT.
 */
export const getUserIdFromToken = (token: string) => {
  return jwt.verify(token, CONSTANTS.JWT.SECRET) as { uuid: string };
};

/**
 * Extracts the user role from a verified JWT.
 */
export const getUserRoleFromToken = (token: string) => {
  return jwt.verify(token, CONSTANTS.JWT.SECRET) as { role: string };
};

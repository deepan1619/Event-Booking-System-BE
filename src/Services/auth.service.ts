import bcrypt from 'bcrypt';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../Repositories/auth.repository';
import { signToken } from '../Utils/jwt';
import logger from '../Logger/logger';
import { userAlreadyExistsError } from '../Errors/auth.error';
import { createAppError } from '../Errors/app.error';

/**
 * Handles user registration by validating uniqueness,
 * hashing the password securely, and persisting the user.
 */
export const registerUserService = async (
  name: string,
  email: string,
  password: string,
  role?: string
): Promise<{ message: string }> => {
  logger.info('Service:registerUser:IN', { email });

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    logger.warn('Service:registerUser:USER_EXISTS', { email });
    throw userAlreadyExistsError(email);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role,
    created_by: name,
  });

  logger.info('Service:registerUser:OUT', {
    user_id: user.id,
    uuid: user.uuid,
  });

  return { message: 'User registered successfully' };
};

/**
 * Authenticates a user by verifying credentials
 * and issues a signed JWT on successful login.
 */
export const loginUserService = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  logger.info('Service:loginUser:IN', { email });

  const user = await findUserByEmail(email);
  if (!user) {
    logger.warn('Service:loginUser:INVALID_EMAIL', { email });
    throw createAppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn('Service:loginUser:INVALID_PASSWORD', {
      userId: user.id,
    });
    throw createAppError('Invalid credentials', 401);
  }

  const token = signToken({
    uuid: user.uuid,
    role: user.role,
  });

  logger.info('Service:loginUser:OUT', {
    userId: user.id,
  });

  return { token };
};

/**
 * Retrieves the authenticated user's profile
 * excluding sensitive fields.
 */
export const getProfileService = async (
  userId: string
): Promise<unknown> => {
  logger.info('Service:getProfile:IN', { userId });

  const user = await findUserById(userId);
  if (!user) {
    logger.warn('Service:getProfile:NOT_FOUND', { userId });
    throw createAppError('User not found', 404);
  }

  logger.info('Service:getProfile:OUT', { userId });

  return user;
};

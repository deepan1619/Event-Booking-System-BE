import {
  ActiveUserResult,
  UserAttributes,
  UserCreationAttributes,
} from '../Interfaces/user.interface';
import logger from '../Logger/logger';
import { UserModel, UserInstance } from '../Models/mysql/user.model';

/**
 * Creates a new user record in the database
 * using the provided user creation attributes.
 */
export const createUser = async (
  data: UserCreationAttributes
): Promise<UserInstance> => {
  logger.debug('Repo:createUser:IN', { email: data.email });

  const user = await UserModel.create(data);

  logger.debug('Repo:createUser:OUT', {
    user_id: user.id,
    email: user.email,
  });

  return user;
};

/**
 * Retrieves a user record by email address.
 */
export const findUserByEmail = async (
  email: string
): Promise<UserInstance | null> => {
  logger.debug('Repo:findUserByEmail:IN', { email });

  const user = await UserModel.findOne({
    where: { email },
  });

  logger.debug('Repo:findUserByEmail:OUT', {
    email,
    found: Boolean(user),
  });

  return user;
};

/**
 * Retrieves a user profile by UUID while excluding
 * sensitive fields such as password and internal identifiers.
 */
export const findUserById = async (
  uuid: string
): Promise<Omit<UserAttributes, 'password' | 'id'> | null> => {
  logger.debug('Repo:findUserById:IN', { user_id: uuid });

  const user = await UserModel.findOne({
    where: { uuid },
    attributes: { exclude: ['password', 'id'] },
    raw: true,
  });

  logger.debug('Repo:findUserById:OUT', {
    user_id: uuid,
    found: Boolean(user),
  });

  return user;
};

/**
 * Retrieves an active user record by UUID
 * for authorization and booking validation.
 */
export const findActiveUserByUuid = async (
  uuid: string
): Promise<ActiveUserResult | null> => {
  logger.debug('Repo:findActiveUserByUuid:IN', { user_uuid: uuid });

  const user = await UserModel.findOne({
    where: {
      uuid,
      is_active: true,
    },
    attributes: ['id', 'name', 'email'],
    raw: true,
  });

  logger.debug('Repo:findActiveUserByUuid:OUT', {
    user_uuid: uuid,
    found: Boolean(user),
  });

  return user;
};

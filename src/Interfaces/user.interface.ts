import { Request } from 'express';

/**
 * Extends the Express Request object to include
 * authenticated user context populated by auth middleware.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string;
    role?: string;
  };
}

/**
 * Represents the complete database shape of a user record
 * including authentication and audit-related fields.
 */
export interface UserAttributes {
  id: number;
  uuid: string;
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  created_by: string | null;
  created_on: Date;
  modified_by: string | null;
  modified_on: Date;
}

/**
 * Defines the attributes required to create a new user record
 * in the persistence layer.
 */
export interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role?: string;
  uuid?: string;
  is_active?: boolean;
  created_by?: string | null;
  created_on?: Date;
  modified_by?: string | null;
  modified_on?: Date;
}

/**
 * Represents the minimal user information returned
 * when validating an active user.
 */
export interface ActiveUserResult {
  id: number;
  name: string;
  email: string;
}

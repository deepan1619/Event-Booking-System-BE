import Joi from 'joi';

/**
 * Validates user registration input including name,
 * email, password strength, and optional role.
 */
export const registerUserValidator = Joi.object({
  name: Joi.string().min(2).max(100).required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|;:'",.<>/~`]).+$/
    )
    .required()
    .messages({
      'string.pattern.base':
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
      'string.min':
        'Password must be at least {#limit} characters long',
      'string.max':
        'Password must not exceed {#limit} characters',
      'string.empty': 'Password is required',
    }),

  role: Joi.string()
    .valid('Admin', 'User')
    .optional()
    .messages({
      'any.only': 'Role must be either "Admin" or "User"',
    }),
});

/**
 * Validates user login input containing email and password.
 */
export const loginUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string().required(),
});

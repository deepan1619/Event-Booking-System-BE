import Joi from 'joi';

/**
 * Validates event creation input including title, description,
 * date, location, ticket count, and optional metadata.
 */
export const createEventValidator = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least {#limit} characters long',
      'string.max': 'Title must not exceed {#limit} characters',
      'any.required': 'Title is required',
    }),

  description: Joi.string()
    .trim()
    .min(5)
    .max(2000)
    .required()
    .messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description is required',
      'string.min':
        'Description must be at least {#limit} characters long',
      'string.max':
        'Description must not exceed {#limit} characters',
      'any.required': 'Description is required',
    }),

  date: Joi.date()
    .iso()
    .greater('now')
    .required()
    .messages({
      'date.base': 'Date must be a valid date',
      'date.format': 'Date must be in ISO format',
      'date.greater': 'Event date must be in the future',
      'any.required': 'Event date is required',
    }),

  location: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.base': 'Location must be a string',
      'string.empty': 'Location is required',
      'string.min':
        'Location must be at least {#limit} characters long',
      'string.max':
        'Location must not exceed {#limit} characters',
      'any.required': 'Location is required',
    }),

  total_tickets: Joi.number()
    .integer()
    .min(1)
    .max(100000)
    .required()
    .messages({
      'number.base': 'Total tickets must be a number',
      'number.integer': 'Total tickets must be an integer',
      'number.min': 'Total tickets must be at least {#limit}',
      'number.max': 'Total tickets must not exceed {#limit}',
      'any.required': 'Total tickets is required',
    }),

  metadata: Joi.object()
    .optional()
    .messages({
      'object.base': 'Metadata must be a valid object',
    }),
}).unknown(false);

import Joi from 'joi';

/**
 * Validates ticket booking input containing the event UUID.
 */
export const bookTicketValidator = Joi.object({
  eventUuid: Joi.string()
    .uuid({ version: 'uuidv4' })
    .required()
    .messages({
      'string.base': 'Event UUID must be a string',
      'string.empty': 'Event UUID is required',
      'string.guid': 'Event UUID must be a valid UUID',
      'any.required': 'Event UUID is required',
    }),
}).unknown(false);

import logger from '../Logger/logger';
import {
  createEvent,
  findEventByUuid,
  listEvents,
} from '../Repositories/event.repository';
import {
  EventAttributes,
  EventCreationAttributes,
} from '../Interfaces/event.interface';
import { createAppError } from '../Errors/app.error';

/**
 * Creates a new event by delegating persistence
 * to the event repository layer.
 */
export const createEventService = async (
  data: EventCreationAttributes
): Promise<{ uuid: string }> => {
  logger.info('Service:createEvent:IN', {
    title: data.title,
    date: data.date,
  });

  const event = await createEvent(data);

  logger.info('Service:createEvent:OUT', {
    uuid: event.uuid,
  });

  return { uuid: event.uuid };
};

/**
 * Retrieves a paginated list of active events
 * with optional search filtering.
 */
export const listEventsService = async (
  page: number,
  limit: number,
  search?: string
): Promise<{ events: EventAttributes[]; total_count: number }> => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  logger.debug('Service:listEvents:IN', {
    page: safePage,
    limit: safeLimit,
    search,
  });

  return await listEvents(skip, safeLimit, search);
};

/**
 * Retrieves a single active event by its UUID
 * or throws an error if the event does not exist.
 */
export const getEventByUuidService = async (
  uuid: string
): Promise<EventAttributes> => {
  logger.debug('Service:getEventByUuid:IN', { uuid });

  const event = await findEventByUuid(uuid);

  if (!event) {
    logger.warn('Service:getEventByUuid:NOT_FOUND', { uuid });
    throw createAppError('Event not found', 404);
  }

  logger.debug('Service:getEventByUuid:OUT', { uuid });

  return event;
};

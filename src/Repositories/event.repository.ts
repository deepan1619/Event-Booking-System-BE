import logger from '../Logger/logger';
import {
  EventAttributes,
  EventCreationAttributes,
} from '../Interfaces/event.interface';
import { EventModel } from '../Models/mongo/event';
import { escapeRegex } from '../Utils/utils';

/**
 * Creates a new event record in MongoDB and initializes
 * available tickets based on the total ticket count.
 */
export const createEvent = async (
  data: EventCreationAttributes
): Promise<{ uuid: string }> => {
  logger.debug('Repo:createEvent:IN', {
    title: data.title,
    date: data.date,
  });

  const event = await EventModel.create({
    ...data,
    available_tickets: data.total_tickets,
  });

  logger.debug('Repo:createEvent:OUT', {
    uuid: event.uuid,
    title: event.title,
  });

  return { uuid: event.uuid };
};

/**
 * Retrieves a paginated list of active events with optional
 * search filtering across title, description, and location.
 */
export const listEvents = async (
  skip: number,
  limit: number,
  search?: string
): Promise<{ events: EventAttributes[]; total_count: number }> => {
  logger.debug('Repo:listEvents:IN', { skip, limit, search });

  const query: Record<string, any> = { is_active: true };

  if (search?.trim()) {
    const safeSearch = escapeRegex(search.trim());

    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } },
      { location: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const projection = {
    _id: 0,
    __v: 0,
    is_active: 0,
    created_by: 0,
    created_on: 0,
    modified_by: 0,
    modified_on: 0,
    totalTickets: 0,
  };

  const [events, total_count] = await Promise.all([
    EventModel.find(query, projection)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .lean<EventAttributes[]>(),
    EventModel.countDocuments(query),
  ]);

  logger.debug('Repo:listEvents:OUT', {
    returned: events.length,
    total_count,
  });

  return { events, total_count };
};

/**
 * Retrieves a single active event by its unique UUID.
 */
export const findEventByUuid = async (
  uuid: string
): Promise<EventAttributes | null> => {
  logger.debug('Repo:findEventByUuid:IN', { uuid });

  const event = await EventModel.findOne({
    uuid,
    is_active: true,
  }).lean<EventAttributes>();

  logger.debug('Repo:findEventByUuid:OUT', {
    uuid,
    found: Boolean(event),
  });

  return event;
};

/**
 * Atomically decrements the available ticket count for an event
 * if tickets are still available.
 */
export const decrementAvailableTickets = async (
  uuid: string
): Promise<EventAttributes | null> => {
  logger.debug('Repo:decrementAvailableTickets:IN', { event_uuid: uuid });

  const updatedEvent = await EventModel.findOneAndUpdate(
    {
      uuid,
      is_active: true,
      available_tickets: { $gt: 0 },
    },
    { $inc: { available_tickets: -1 } },
    {
      new: true,
      projection: {
        _id: 0,
        __v: 0,
        created_by: 0,
        created_on: 0,
        modified_by: 0,
        modified_on: 0,
        is_active: 0,
      },
    }
  ).lean<EventAttributes>();

  logger.debug('Repo:decrementAvailableTickets:OUT', {
    event_uuid: uuid,
    decremented: Boolean(updatedEvent),
  });

  return updatedEvent;
};

/**
 * Increments the available ticket count for an event
 * as part of a compensation or rollback operation.
 */
export const incrementAvailableTickets = async (
  eventUuid: string
): Promise<void> => {
  logger.warn('Repo:incrementAvailableTickets:IN', {
    event_uuid: eventUuid,
  });

  const result = await EventModel.updateOne(
    { uuid: eventUuid, is_active: true },
    { $inc: { available_tickets: 1 } }
  );

  if (result.matchedCount === 0) {
    logger.error('Repo:incrementAvailableTickets:EVENT_NOT_FOUND', {
      event_uuid: eventUuid,
    });

    throw new Error(
      `Compensation failed: event not found (${eventUuid})`
    );
  }

  logger.warn('Repo:incrementAvailableTickets:OUT', {
    event_uuid: eventUuid,
    compensated: true,
  });
};

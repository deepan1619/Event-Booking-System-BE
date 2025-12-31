import { RequestHandler } from 'express';
import logger from '../Logger/logger';
import {
  createEventService,
  listEventsService,
  getEventByUuidService,
} from '../Services/event.service';
import { ApiResponse } from '../Interfaces/api_response.interface';
import { nowISO } from '../Utils/time';
import { asyncHandler } from '../Utils/async_handler';
import { createAppError } from '../Errors/app.error';

/**
 * Handles event creation requests by authenticated admin users
 * and returns the created event details.
 */
export const createEventHandler: RequestHandler = asyncHandler(
  async (req, res) => {
    const request_id = req.headers['x-request-id'] as string;

    if (!req.user?.uuid) {
      throw createAppError('Unauthorized', 401);
    }

    logger.info('createEvent handler IN', {
      user_uuid: req.user.uuid,
    });

    const event = await createEventService({
      ...req.body,
      created_by: req.user.uuid,
    });

    logger.info('createEvent handler OUT', {
      event_uuid: event.uuid,
    });

    const response: ApiResponse = {
      status: 'Success',
      code: 201,
      message: 'Event created successfully',
      data: event,
      request_id,
      timestamp: nowISO(),
    };

    res.status(201).json(response);
  }
);

/**
 * Retrieves a paginated list of available events
 * with optional search filtering.
 */
export const listEventsHandler: RequestHandler = asyncHandler(
  async (req, res) => {
    const request_id = req.headers['x-request-id'] as string;

    logger.debug('listEvents handler IN');

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || '');

    const eventsList = await listEventsService(page, limit, search);

    logger.debug('listEvents handler OUT', {
      count: eventsList.events.length,
    });

    const response: ApiResponse = {
      status: 'Success',
      code: 200,
      message: eventsList.events.length
        ? 'Events fetched successfully'
        : 'No events available',
      data: eventsList.events,
      meta: {
        total_count: eventsList.total_count,
      },
      request_id,
      timestamp: nowISO(),
    };

    res.status(200).json(response);
  }
);

/**
 * Retrieves the details of a specific event
 * identified by its unique UUID.
 */
export const getEventByUuidHandler: RequestHandler = asyncHandler(
  async (req, res) => {
    const request_id = req.headers['x-request-id'] as string;
    const { uuid } = req.params;

    logger.debug('getEventByUuid handler IN', { uuid });

    const event = await getEventByUuidService(uuid);

    if (!event) {
      throw createAppError('Event not found', 404);
    }

    logger.debug('getEventByUuid handler OUT', { uuid });

    const response: ApiResponse = {
      status: 'Success',
      code: 200,
      message: 'Event fetched successfully',
      data: event,
      request_id,
      timestamp: nowISO(),
    };

    res.status(200).json(response);
  }
);

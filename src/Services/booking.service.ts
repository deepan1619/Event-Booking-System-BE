import logger from '../Logger/logger';
import { mysqlDB } from '../Databases/mysql';

import { findActiveUserByUuid } from '../Repositories/auth.repository';
import {
  decrementAvailableTickets,
  incrementAvailableTickets,
} from '../Repositories/event.repository';
import {
  createBooking,
  findBookingsByUserId,
} from '../Repositories/booking.repository';

import { userNotFoundError } from '../Errors/auth.error';
import {
  ticketsSoldOutError,
  bookingFailedError,
} from '../Errors/booking.error';

/**
 * Books a ticket for an event by validating the user,
 * atomically decrementing available tickets, creating
 * a booking record, and ensuring transactional consistency
 * across MongoDB and MySQL with compensation logic.
 */
export const bookTicketService = async (
  userUuid: string,
  eventUuid: string
): Promise<{ booking_uuid: string }> => {
  logger.info('Service:bookTicket:IN', {
    user_uuid: userUuid,
    event_uuid: eventUuid,
  });

  const transaction = await mysqlDB.transaction();
  let ticketDecremented = false;

  try {
    const user = await findActiveUserByUuid(userUuid);
    if (!user) {
      logger.warn('Service:bookTicket:USER_NOT_FOUND', { userUuid });
      throw userNotFoundError();
    }

    const event = await decrementAvailableTickets(eventUuid);
    if (!event) {
      logger.warn('Service:bookTicket:SOLD_OUT', { eventUuid });
      throw ticketsSoldOutError();
    }

    ticketDecremented = true;

    const booking = await createBooking(
      {
        user_id: user.id,
        event_uuid: eventUuid,
        event_title: event.title,
        created_by: userUuid,
      },
      transaction
    );

    await transaction.commit();

    logger.info('Service:bookTicket:OUT', {
      booking_uuid: booking.uuid,
      event_uuid: eventUuid,
      user_uuid: userUuid,
    });

    return { booking_uuid: booking.uuid };
  } catch (error) {
    await transaction.rollback();

    if (ticketDecremented) {
      try {
        await incrementAvailableTickets(eventUuid);
        logger.warn('Service:bookTicket:COMPENSATION_SUCCESS', {
          event_uuid: eventUuid,
        });
      } catch (compError) {
        logger.error('Service:bookTicket:COMPENSATION_FAILED', {
          event_uuid: eventUuid,
          compError,
        });
      }
    }

    logger.error('Service:bookTicket:ERROR', {
      user_uuid: userUuid,
      event_uuid: eventUuid,
      error,
    });

    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error;
    }

    throw bookingFailedError();
  }
};

/**
 * Retrieves all bookings associated with an authenticated
 * and active user.
 */
export const getMyBookingsService = async (
  userUuid: string
): Promise<{ bookings: any[] }> => {
  logger.info('Service:getMyBookings:IN', { user_uuid: userUuid });

  const user = await findActiveUserByUuid(userUuid);
  if (!user) {
    logger.warn('Service:getMyBookings:USER_NOT_FOUND', {
      user_uuid: userUuid,
    });
    throw userNotFoundError();
  }

  const bookings = await findBookingsByUserId(user.id);

  logger.info('Service:getMyBookings:OUT', {
    user_uuid: userUuid,
    count: bookings.length,
  });

  return { bookings };
};

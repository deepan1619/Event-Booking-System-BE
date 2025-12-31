import { createAppError } from './app.error';

/**
 * Creates an operational error indicating that tickets
 * for the given event are sold out.
 */
export const ticketsSoldOutError = () =>
  createAppError(
    'Tickets are sold out for this event',
    409
  );

/**
 * Creates an operational error indicating that the user
 * has already booked a ticket for the specified event.
 */
export const bookingAlreadyExistsError = () =>
  createAppError(
    'You have already booked a ticket for this event',
    409
  );

/**
 * Creates an operational error indicating that the event
 * does not exist or is not available for booking.
 */
export const eventNotAvailableError = () =>
  createAppError(
    'Event not found or not available for booking',
    404
  );

/**
 * Creates a generic operational error indicating that
 * the ticket booking process has failed.
 */
export const bookingFailedError = () =>
  createAppError(
    'Ticket booking failed',
    400
  );

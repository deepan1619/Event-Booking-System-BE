import {
  BookingAttributes,
  BookingCreationAttributes,
} from '../Interfaces/booking.interface';
import logger from '../Logger/logger';
import { BookingModel } from '../Models/mysql/booking.model';
import { Transaction } from 'sequelize';

/**
 * Creates a new booking record within a database transaction
 * and returns the generated booking identifier.
 */
export const createBooking = async (
  data: BookingCreationAttributes,
  transaction: Transaction
): Promise<{ uuid: string }> => {
  logger.debug('Repo:createBooking:IN', {
    user_id: data.user_id,
    event_uuid: data.event_uuid,
  });

  const booking = await BookingModel.create(data, { transaction });

  logger.debug('Repo:createBooking:OUT', {
    booking_uuid: booking.uuid,
  });

  return { uuid: booking.uuid };
};

/**
 * Retrieves all booking records associated with a specific user,
 * ordered by creation time in descending order.
 */
export const findBookingsByUserId = async (
  user_id: number
): Promise<BookingAttributes[]> => {
  logger.debug('Repo:findBookingsByUserId:IN', { user_id });

  const bookings = await BookingModel.findAll({
    where: { user_id },
    attributes: [
      'uuid',
      'event_uuid',
      'event_title',
      'created_on',
    ],
    order: [['created_on', 'DESC']],
    raw: true,
  });

  logger.debug('Repo:findBookingsByUserId:OUT', {
    count: bookings.length,
  });

  return bookings;
};

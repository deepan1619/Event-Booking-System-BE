import { Router } from 'express';
import {
  bookTicketHandler,
  getMyBookingsHandler,
} from '../Handlers/booking.handler';
import { authMiddleware } from '../Middlewares/auth.middleware';
import { validate } from '../Validators/validate';
import { bookTicketValidator } from '../Validators/booking.validator';

/**
 * Defines booking-related routes for ticket booking
 * and retrieving authenticated user bookings.
 */
const router = Router();

router.post('/book-event', authMiddleware, validate(bookTicketValidator), bookTicketHandler);

router.get('/my-bookings', authMiddleware, getMyBookingsHandler);

export default router
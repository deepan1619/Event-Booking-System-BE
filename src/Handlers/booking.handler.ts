import { RequestHandler } from 'express';
import logger from '../Logger/logger';
import {
    bookTicketService,
    getMyBookingsService,
} from '../Services/booking.service';
import { ApiResponse } from '../Interfaces/api_response.interface';
import { nowISO } from '../Utils/time';
import { asyncHandler } from '../Utils/async_handler';
import { createAppError } from '../Errors/app.error';

/**
 * Handles ticket booking requests for authenticated users
 * by invoking the booking service and returning the booking result.
 */
export const bookTicketHandler: RequestHandler = asyncHandler(
    async (req, res) => {
        const request_id = req.headers['x-request-id'] as string;

        if (!req.user?.uuid) {
            throw createAppError('Unauthorized', 401);
        }

        const { eventUuid } = req.body;
        const userUUID = req.user.uuid;

        logger.info('bookTicket handler IN', {
            user_uuid: userUUID,
            event_uuid: eventUuid,
        });

        const result = await bookTicketService(userUUID, eventUuid);

        logger.info('bookTicket handler OUT', {
            booking_uuid: result.booking_uuid,
        });

        const apiResponse: ApiResponse = {
            status: 'Success',
            code: 201,
            message: 'Ticket booked successfully',
            data: result,
            request_id,
            timestamp: nowISO(),
        };

        res.status(201).json(apiResponse);
    }
);

/**
 * Retrieves all bookings for the currently authenticated user.
 */
export const getMyBookingsHandler: RequestHandler = asyncHandler(
    async (req, res) => {
        const request_id = req.headers['x-request-id'] as string;

        if (!req.user?.uuid) {
            throw createAppError('Unauthorized', 401);
        }

        const userUUID = req.user.uuid;

        logger.info('getMyBookings handler IN', {
            user_uuid: userUUID,
        });

        const result = await getMyBookingsService(userUUID);

        const apiResponse: ApiResponse = {
            status: 'Success',
            code: 200,
            message: 'Bookings fetched successfully',
            data: result,
            request_id,
            timestamp: nowISO(),
        };

        res.status(200).json(apiResponse);
    }
);

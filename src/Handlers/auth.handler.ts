import { RequestHandler } from 'express';
import {
  getProfileService,
  loginUserService,
  registerUserService,
} from '../Services/auth.service';
import logger from '../Logger/logger';
import { ApiResponse } from '../Interfaces/api_response.interface';
import { nowISO } from '../Utils/time';
import { asyncHandler } from '../Utils/async_handler';
import { createAppError } from '../Errors/app.error';

/**
 * Handles user registration requests by validating input,
 * invoking the registration service, and returning a success response.
 */
export const registerUserHandler: RequestHandler = asyncHandler(
  async (req, res) => {
    const request_id = req.headers['x-request-id'] as string;

    logger.info('registerUser handler in');

    const { name, email, password, role } = req.body;
    const result = await registerUserService(name, email, password, role);

    const apiResponse: ApiResponse = {
      status: 'Success',
      code: 201,
      message: result.message,
      request_id,
      timestamp: nowISO(),
    };

    res.status(201).json(apiResponse);
  }
);

/**
 * Handles user login requests by authenticating credentials,
 * issuing a JWT, and returning a success response.
 */
export const loginUserHandler: RequestHandler = asyncHandler(
  async (req, res) => {
    const request_id = req.headers['x-request-id'] as string;

    logger.info('loginUser handler in');

    const { email, password } = req.body;
    const { token } = await loginUserService(email, password);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    logger.info('loginUser handler out');

    const apiResponse: ApiResponse = {
      status: 'Success',
      code: 200,
      message: 'Login successful',
      request_id,
      timestamp: nowISO(),
      data: { token }, // Return a token for the Swagger to use; the frontend will store it in HTTP cookies directly, so there is no need to return the token to the client.
    };

    res.status(200).json(apiResponse);
  }
);

/**
 * Retrieves the profile information of the currently
 * authenticated user.
 */
export const getProfileHandler: RequestHandler = asyncHandler(
  async (req, res) => {
    const request_id = req.headers['x-request-id'] as string;

    if (!req.user?.uuid) {
      throw createAppError('Unauthorized', 401);
    }

    const result = await getProfileService(req.user.uuid);

    const apiResponse: ApiResponse = {
      status: 'Success',
      code: 200,
      message: 'Profile fetched successfully',
      data: result,
      request_id,
      timestamp: nowISO(),
    };

    res.status(200).json(apiResponse);
  }
);

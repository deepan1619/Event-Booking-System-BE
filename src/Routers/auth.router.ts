import { Router } from 'express';
import {
    registerUserHandler,
    loginUserHandler,
    getProfileHandler,
} from '../Handlers/auth.handler';
import { validate } from '../Validators/validate';
import {
    registerUserValidator,
    loginUserValidator,
} from '../Validators/auth.validator';
import { authMiddleware } from '../Middlewares/auth.middleware';

/**
 * Defines authentication-related routes including user registration,
 * login, and profile retrieval with validation and authorization.
 */
const router = Router();

router.post('/register', validate(registerUserValidator), registerUserHandler);
router.post('/login', validate(loginUserValidator), loginUserHandler);
router.get('/profile', authMiddleware, getProfileHandler);

export default router;

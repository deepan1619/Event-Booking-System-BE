import { Router } from 'express';
import {
  createEventHandler,
  getEventByUuidHandler,
  listEventsHandler,
} from '../Handlers/event.handler';
import {
  authMiddleware,
  requireRole,
} from '../Middlewares/auth.middleware';
import { validate } from '../Validators/validate';
import { createEventValidator } from '../Validators/event.validator';
import { UserRole } from '../Constants/enum';

/**
 * Defines event-related routes including event listing
 * and admin-only event creation with authorization and validation.
 */
const router = Router();

router.get('/events', authMiddleware, listEventsHandler);

router.post( '/event', authMiddleware, requireRole(UserRole.ADMIN), validate(createEventValidator), createEventHandler);

export default router;

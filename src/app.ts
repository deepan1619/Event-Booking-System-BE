import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRouter from './Routers/auth.router';
import eventRouter from './Routers/event.router';
import bookingRouter from './Routers/booking.router';

import { errorMiddleware } from './Middlewares/error.middleware';
import { requestIdMiddleware } from './Middlewares/requestid.middleware';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './Swagger/swagger';
import { CONSTANTS } from './Constants/constants';

const app = express();

/**
 * Apply HTTP security headers to protect against
 * XSS, clickjacking, MIME sniffing, and other attacks.
 * CSP is disabled to allow Swagger UI to function correctly.
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

/**
 * Configure Cross-Origin Resource Sharing (CORS)
 * using an explicit allowlist loaded from environment variables.
 * Non-browser clients (Postman, curl) are allowed by default.
 */
const allowedOrigins = (CONSTANTS.CORS.ORIGINS)
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/**
 * Apply a global rate limiter to protect the API
 * from abuse and denial-of-service attacks.
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/**
 * Apply a stricter rate limiter for authentication routes
 * to prevent brute-force login and registration attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'Failure',
    code: 429,
    message: 'Too many requests. Please try again later.',
  },
});

/**
 * Parse incoming JSON payloads.
 */
app.use(express.json());

/**
 * Parse cookies from incoming HTTP requests.
 * Required for JWT-based authentication using HTTP-only cookies.
 */
app.use(cookieParser());

/**
 * Attach a unique request ID to every request and response
 * to enable request tracing and correlation in logs.
 */
app.use(requestIdMiddleware);

/**
 * Register authentication routes.
 * Auth-specific rate limiting is applied here.
 */
app.use('/auth/api/v1', authLimiter, authRouter);

/**
 * Register event-related routes.
 */
app.use('/events/api/v1', eventRouter);

/**
 * Register booking-related routes.
 */
app.use('/bookings/api/v1', bookingRouter);

/**
 * Health check endpoint used for monitoring
 * and load balancer readiness checks.
 */
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' });
});

/**
 * Serve Swagger API documentation.
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Global error-handling middleware.
 * Must be registered last to catch all unhandled errors.
 */
app.use(errorMiddleware);

export default app;

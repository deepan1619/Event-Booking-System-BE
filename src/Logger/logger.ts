import winston from 'winston';
import 'winston-mongodb';
import { safeStringify } from '../Utils/utils';
import { getRequestId } from '../Utils/request_context';
import { CONSTANTS } from '../Constants/constants';

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

/**
 * Inject request_id into EVERY log entry (all transports)
 */
const requestIdFormat = winston.format((info) => {
  const request_id = getRequestId();

  if (request_id) {
    info.request_id = request_id;
  }

  return info;
});

/**
 * Defines the custom console log format with request ID
 * correlation and safe metadata serialization.
 */
const logFormat = printf(({ timestamp, level, message, stack, ...meta }) => {
  const request_id = getRequestId();

  const enrichedMeta = {
    ...(request_id ? { request_id } : {}),
    ...meta,
  };

  return `${timestamp} [${level}]: ${stack || message} ${Object.keys(enrichedMeta).length
    ? safeStringify(enrichedMeta)
    : ''
    }`;
});

/**
 * Configures and exports the centralized Winston logger
 * with console and MongoDB transports for observability.
 */
const logger = winston.createLogger({
  level: CONSTANTS.LOGGER.LOG_LEVEL,
  format: combine(
    requestIdFormat(),
    timestamp(),
    errors({ stack: true }),
    json()
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize({ all: true }),
        logFormat
      ),
    }),

    new winston.transports.MongoDB({
      level: 'info',
      db: CONSTANTS.MONGO.LOG_URI,
      collection: 'system_logs',
      tryReconnect: true,
      metaKey: 'meta',
      storeHost: true,
    }),
  ],
  exitOnError: false,
});

export default logger;

import 'dotenv/config';
import type { SignOptions } from 'jsonwebtoken';

/**
 * Reads an environment variable safely.
 * Throws an error if the variable is required but not defined.
 */
const getEnv = (key: string, required = true): string => {
    const value = process.env[key];

    if (!value && required) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value as string;
};

/**
 * Centralized, immutable application configuration.
 * All environment-based constants should be accessed only from this object.
 */
export const CONSTANTS = Object.freeze({
    APP: {
        PORT: Number(getEnv('PORT', false) || 3000),
        NODE_ENV: getEnv('NODE_ENV', false) || 'development',
    },

    MYSQL: {
        HOST: getEnv('MYSQL_HOST'),
        PORT: Number(getEnv('MYSQL_PORT') || 3306),
        USER: getEnv('MYSQL_USER'),
        PASSWORD: getEnv('MYSQL_PASSWORD'),
        DATABASE: getEnv('MYSQL_DB'),
    },

    MONGO: {
        URI: getEnv('MONGO_URI'),
        LOG_URI: getEnv('MONGO_LOG_URI')
    },

    JWT: {
        SECRET: getEnv('JWT_SECRET'),
        EXPIRES_IN: (getEnv('JWT_EXPIRES_IN', false) ||
            '1d') as SignOptions['expiresIn'],
    },

    LOGGER: {
        LOG_LEVEL: getEnv('LOG_LEVEL', false) || 'info',
    },

    CORS: {
        ORIGINS: getEnv('CORS_ALLOWED_ORIGINS', false) || 'http://localhost:3000',
    }
});

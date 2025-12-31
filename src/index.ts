import app from './app';
import { mysqlDB } from './Databases/mysql';
import { connectMongo } from './Databases/mongo';
import { runMigrations } from './Migrations/migration';
import { CONSTANTS } from './Constants/constants';
import logger from './Logger/logger';

/**
 * Starts the application server.
 * 
 * Responsibilities:
 * - Establish MySQL connection
 * - Run database migrations
 * - Establish MongoDB connection
 * - Start the HTTP server
 * 
 * If any step fails, the process exits to prevent
 * running the application in a partially initialized state.
 */
const startServer = async (): Promise<void> => {
  try {
    logger.info('Starting server initialization');

    /**
     * Verify MySQL connectivity before proceeding.
     */
    await mysqlDB.authenticate();
    logger.info('MySQL connected');

    /**
     * Execute pending database migrations.
     * Ensures required tables exist before serving requests.
     */
    await runMigrations();
    logger.info('Database migrations completed');

    /**
     * Establish MongoDB connection.
     * Used for event data and persistent system logs.
     */
    await connectMongo();
    logger.info('MongoDB connected');

    /**
     * Start the Express HTTP server.
     */
    app.listen(CONSTANTS.APP.PORT, () => {
      logger.info(`Server started on port ${CONSTANTS.APP.PORT}`);
    });
  } catch (error) {
    /**
     * Fail-fast strategy:
     * - Log startup error
     * - Exit process to avoid undefined runtime behavior
     */
    logger.error('Server startup failed', {
      error,
    });

    process.exit(1);
  }
};

/**
 * Invoke server startup.
 */
startServer();

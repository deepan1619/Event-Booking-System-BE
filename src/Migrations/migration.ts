import { QueryInterface } from 'sequelize';
import { mysqlDB } from '../Databases/mysql';
import { createUsersTable } from './Scripts/001_create_users';
import { createBookingsTable } from './Scripts/002_create_bookings';
import logger from '../Logger/logger';

/**
 * Defines the contract for database migrations,
 * including identification and execution logic.
 */
export interface Migration {
    name: string;
    tableName: string;
    up: (queryInterface: QueryInterface) => Promise<void>;
}

/**
 * Registers all database migrations in execution order.
 */
const migrations: Migration[] = [
    createUsersTable,
    createBookingsTable,
];

/**
 * Executes pending migrations by verifying table existence
 * and applying schema changes in a transactional manner.
 */
export const runMigrations = async (): Promise<void> => {
    const queryInterface = mysqlDB.getQueryInterface();

    for (const migration of migrations) {
        const tableExists = await queryInterface
            .describeTable(migration.tableName)
            .then(() => true)
            .catch(() => false);

        if (tableExists) {
            logger.info(
                `Skipping migration ${migration.name} (table "${migration.tableName}" already exists)`
            );
            continue;
        }

        logger.info(
            `Running migration ${migration.name} (creating table "${migration.tableName}")`
        );

        const transaction = await mysqlDB.transaction();

        try {
            await migration.up(queryInterface);
            await transaction.commit();

            logger.info(`Migration completed: ${migration.name}`);
        } catch (error) {
            await transaction.rollback();

            logger.error(`Migration failed: ${migration.name}`, {
                error,
            });

            throw error;
        }
    }
};

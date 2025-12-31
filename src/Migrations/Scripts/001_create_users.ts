import { QueryInterface, DataTypes } from 'sequelize';
import { Migration } from '../migration';
import { baseColumns } from '../Helpers/base_columns';

/**
 * Defines the database migration for creating the users table
 * with authentication, role, and audit-related columns.
 */
export const createUsersTable: Migration = {
    name: '001_create_users',
    tableName: 'users',

    up: async (queryInterface: QueryInterface) => {
        await queryInterface.createTable('users', {
            ...baseColumns,

            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'user',
            },
        });
    },
};

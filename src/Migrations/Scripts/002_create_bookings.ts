import { QueryInterface, DataTypes } from 'sequelize';
import { Migration } from '../migration';
import { baseColumns } from '../Helpers/base_columns';

/**
 * Defines the database migration for creating the bookings table
 * with references to users and associated event information.
 */
export const createBookingsTable: Migration = {
  name: '002_create_bookings',
  tableName: 'bookings',

  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('bookings', {
      ...baseColumns,

      event_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      event_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });
  },
};

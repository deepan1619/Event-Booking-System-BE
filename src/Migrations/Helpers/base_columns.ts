import { DataTypes, Sequelize } from 'sequelize';

/**
 * Defines common base columns shared across MySQL models,
 * including identifiers, audit fields, and active status.
 */
export const baseColumns = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  uuid: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    defaultValue: DataTypes.UUIDV4,
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  created_by: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  created_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },

  modified_by: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },

  modified_on: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal(
      'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
    ),
  },
};

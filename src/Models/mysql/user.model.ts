import { DataTypes, Model, Sequelize } from 'sequelize';
import { mysqlDB } from '../../Databases/mysql';
import {
  UserAttributes,
  UserCreationAttributes,
} from '../../Interfaces/user.interface';

/**
 * Represents the Sequelize instance type for user records,
 * combining model behavior with user attributes.
 */
export type UserInstance = Model<UserAttributes, UserCreationAttributes> &
  UserAttributes;

/**
 * Defines the Sequelize model for the users table,
 * mapping user entities to MySQL persistence.
 */
export const UserModel = mysqlDB.define<UserInstance>(
  'users',
  {
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

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'users',
    timestamps: false,
    underscored: true,
  }
);

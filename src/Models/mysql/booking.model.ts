import { DataTypes, Model, Optional } from 'sequelize';
import { mysqlDB } from '../../Databases/mysql';
import { UserModel } from './user.model';

/**
 * Represents the database shape of a booking record
 * stored in the MySQL bookings table.
 */
export interface BookingAttributes {
  id: number;
  uuid: string;
  user_id: number;
  event_uuid: string;
  event_title: string;
  is_active: boolean;
  created_by?: string;
  created_on: Date;
  modified_by?: string;
  modified_on: Date;
}

/**
 * Defines the attributes required when creating
 * a new booking record.
 */
export interface BookingCreationAttributes
  extends Optional<
    BookingAttributes,
    | 'id'
    | 'uuid'
    | 'is_active'
    | 'created_by'
    | 'created_on'
    | 'modified_by'
    | 'modified_on'
  > {}

/**
 * Represents the Sequelize instance type
 * for booking records.
 */
export type BookingInstance =
  Model<BookingAttributes, BookingCreationAttributes> &
  BookingAttributes;

/**
 * Defines the Sequelize model for the bookings table,
 * mapping booking entities to MySQL persistence.
 */
export const BookingModel = mysqlDB.define<BookingInstance>(
  'bookings',
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

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },

    event_uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'event_id',
    },

    event_title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'event_title',
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    modified_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'bookings',
    timestamps: false,
    underscored: true,
  }
);

/**
 * Establishes relational associations between
 * bookings and users.
 */
BookingModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user',
});

UserModel.hasMany(BookingModel, {
  foreignKey: 'userId',
  as: 'bookings',
});

import { Sequelize } from 'sequelize';
import { CONSTANTS } from '../Constants/constants';

/**
 * Initializes and exports the MySQL database connection
 * using Sequelize with centralized configuration.
 */
export const mysqlDB = new Sequelize(
  CONSTANTS.MYSQL.DATABASE,
  CONSTANTS.MYSQL.USER,
  CONSTANTS.MYSQL.PASSWORD,
  {
    host: CONSTANTS.MYSQL.HOST,
    port: CONSTANTS.MYSQL.PORT,
    dialect: 'mysql',
    logging: false,
  }
);

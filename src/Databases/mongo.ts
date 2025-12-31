import mongoose from 'mongoose';
import { CONSTANTS } from '../Constants/constants';

/**
 * Establishes a connection to the MongoDB database
 * using the configured connection URI.
 */
export const connectMongo = async () => {
  await mongoose.connect(CONSTANTS.MONGO.URI as string);
};

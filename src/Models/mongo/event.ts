import mongoose, { Schema } from 'mongoose';
import { EventDocument } from '../../Interfaces/event.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Defines the MongoDB schema for event documents,
 * including ticket availability, metadata, and audit fields.
 */
const EventSchema = new Schema<EventDocument>(
  {
    uuid: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    total_tickets: {
      type: Number,
      required: true,
      min: 1,
    },

    available_tickets: {
      type: Number,
      required: true,
      min: 0,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },

    created_by: {
      type: String,
      trim: true,
    },

    modified_by: {
      type: String,
      trim: true,
    },
  },
  {
    collection: 'events',
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'modified_on',
    },
    versionKey: false,
  }
);

/**
 * Registers indexes to optimize event queries
 * based on date, location, and active status.
 */
EventSchema.index({ date: 1 });
EventSchema.index({ location: 1 });

/**
 * Exports the Mongoose model for performing
 * CRUD operations on event documents.
 */
export const EventModel = mongoose.model<EventDocument>(
  'Event',
  EventSchema
);

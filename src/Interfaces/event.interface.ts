import { Document } from 'mongoose';

/**
 * Represents the database shape of an event entity
 * stored in the MongoDB collection.
 */
export interface EventAttributes {
    uuid: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    total_tickets: number;
    available_tickets: number;
    metadata?: Record<string, unknown>;
    is_active: boolean;
    created_by?: string;
    created_on: Date;
    modified_by?: string;
    modified_on: Date;
}

/**
 * Defines the attributes required to create
 * a new event record in the repository layer.
 */
export interface EventCreationAttributes {
    title: string;
    description: string;
    date: Date;
    location: string;
    total_tickets: number;
    metadata?: Record<string, unknown>;
    created_by?: string;
}

/**
 * Extends the event attributes with Mongoose document
 * properties for database persistence.
 */
export interface EventDocument
    extends EventAttributes,
    Document {}

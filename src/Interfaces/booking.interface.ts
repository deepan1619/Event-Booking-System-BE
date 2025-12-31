/**
 * Represents the database shape of a booking record
 * as stored and retrieved from the persistence layer.
 */
export interface BookingAttributes {
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
 * Defines the attributes required to create
 * a new booking record in the repository layer.
 */
export interface BookingCreationAttributes {
    user_id: number;
    event_uuid: string;
    event_title: string;
    created_by?: string;
}

/**
 * Represents the booking data structure
 * returned to clients in API responses.
 */
export interface BookingResponse {
    booking_uuid: string;
    event_uuid: string;
    event_title: string;
}

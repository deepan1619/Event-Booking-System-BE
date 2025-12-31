/**
 * Defines the standard structure for all API responses
 * returned by the application to ensure consistency.
 */
export interface ApiResponse {
    status: string;
    code: number;
    data?: any;
    meta?: any;
    message: string;
    request_id: string;
    timestamp: string;
}
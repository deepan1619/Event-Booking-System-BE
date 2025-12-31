import { OpenAPIV3 } from 'openapi-types';

/**
 * OpenAPI specification defining the Event & Ticket System API,
 * including authentication, event management, and booking endpoints.
 */
export const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',

  info: {
    title: 'Event & Ticket System API',
    version: '1.0.0',
    description: 'Production-ready API documentation for Event & Ticket System',
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],

  components: {
    securitySchemes: {
      CookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
        description: 'JWT stored in HTTP-only cookie',
      },
    },

    schemas: {
      ApiResponse: {
        type: 'object',
        required: ['status', 'code', 'message', 'request_id', 'timestamp'],
        properties: {
          status: { type: 'string', example: 'Success' },
          code: { type: 'number', example: 200 },
          message: { type: 'string' },
          request_id: { type: 'string' },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-12-30T22:35:12.431Z',
          },
          data: {
            type: 'object',
            nullable: true,
          },
        },
      },

      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Deepan' },
          email: {
            type: 'string',
            format: 'email',
            example: 'deepan@example.com',
          },
          password: { type: 'string', example: 'Strong@123' },
          role: {
            type: 'string',
            example: 'user',
            nullable: true,
            description:
              'Optional field. Backend may ignore this value and assign role automatically.',
          },
        },
      },

      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'deepan@example.com',
          },
          password: { type: 'string', example: 'Strong@123' },
        },
      },

      UserProfile: {
        type: 'object',
        properties: {
          uuid: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', example: 'user' },
          is_active: { type: 'boolean' },
        },
      },

      EventRequest: {
        type: 'object',
        required: ['title', 'description', 'date', 'location', 'total_tickets'],
        properties: {
          title: { type: 'string', example: 'Tech Conference' },
          description: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          location: { type: 'string' },
          total_tickets: { type: 'number', example: 10 },
          metadata: { type: 'object', nullable: true },
        },
      },

      EventResponse: {
        type: 'object',
        properties: {
          uuid: { type: 'string' },
          title: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          location: { type: 'string' },
          available_tickets: { type: 'number' },
        },
      },

      BookingRequest: {
        type: 'object',
        required: ['eventUuid'],
        properties: {
          eventUuid: {
            type: 'string',
            description: 'Event UUID',
          },
        },
      },
    },
  },

  security: [{ CookieAuth: [] }],

  paths: {
    '/auth/api/v1/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
              },
            },
          },
          409: { description: 'User already exists' },
        },
      },
    },

    '/auth/api/v1/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and set authentication cookie',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            headers: {
              'Set-Cookie': {
                description: 'access_token HTTP-only cookie',
                schema: { type: 'string' },
              },
            },
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
              },
            },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },

    '/auth/api/v1/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get logged-in user profile',
        responses: {
          200: {
            description: 'User profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
              },
            },
          },
        },
      },
    },

    '/events/api/v1/events': {
      get: {
        tags: ['Events'],
        summary: 'List events',
        parameters: [
          { in: 'query', name: 'page', schema: { type: 'number' } },
          { in: 'query', name: 'limit', schema: { type: 'number' } },
          { in: 'query', name: 'search', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Events list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
              },
            },
          },
        },
      },
    },

    '/events/api/v1/event': {
      post: {
        tags: ['Events'],
        summary: 'Create event (Admin only)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EventRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Event created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
              },
            },
          },
          403: { description: 'Access denied' },
        },
      },
    },

    '/bookings/api/v1/book-event': {
      post: {
        tags: ['Bookings'],
        summary: 'Book a ticket',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BookingRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Ticket booked',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
              },
            },
          },
        },
      },
    },

    '/bookings/api/v1/my-bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'Get authenticated user bookings',
        responses: {
          200: {
            description: 'Bookings list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiResponse' },
              },
            },
          },
        },
      },
    },
  },
};

# Event Ticket Booking System

This project is a backend API for an Event Ticket Booking System built using **Node.js, Express, MySQL, and MongoDB**.  
It demonstrates secure authentication, role-based access control, concurrency-safe ticket booking, and a dual-database architecture.

---

## 1. Setup / Installation Instructions
### Prerequisites

- Node.js (v18 or later)
- npm
- MySQL
- MongoDB
---

### Installation Steps
#### 1. Clone the repository
```bash
git clone <repository-url>
cd event-ticket-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create environment configuration
Create a .env file in the project root and add the following:

```bash
PORT=3000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=admin
MYSQL_DB= event_ticket_system

MONGO_URI=mongodb://localhost:27017/events

JWT_SECRET=IpKJ170Kc5dUORDeV73C04o5u9YQsWjKG2k7nR1YRWs= # Kept for reference
JWT_EXPIRES_IN=1d

MONGO_LOG_URI=mongodb://localhost:27017/event_ticket_logs
LOG_LEVEL=info

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Start the application
```bash
npm run dev
```
Once the server starts, the migration script will run and creates the table automatically.

### 5. Run the Swagger 
```bash 
http://localhost:3000/api-docs/
```

### 6. API Testing Instructions – Event Booking System

Follow the steps below in order to verify the complete API flow using Swagger UI, Postman, or any REST client.

1. Register a new user

Create a new user account using the Register API.
Ensure the user is created successfully.
If the user already exists, the API should return a conflict error.

2. Login with the registered user

Login using the Login API with valid credentials.
Verify that authentication is successful and an HTTP-only access token cookie is set in the response.

Note: Add the returned token in the header to Authorize (Cookie Path).

3. Fetch logged-in user profile

Call the Get Profile API to retrieve the authenticated user’s details.
Confirm that the response returns the correct user information and role.

If the user is not logged in, the API should deny access.

4. List available events

Call the List Events API to retrieve all available events.
Optionally test pagination and search parameters.

Verify that the API returns a list of events or an empty list if none exist.

5. Create an event (Admin only)

Login as an admin user and call the Create Event API.
Ensure the event is created successfully and an event identifier is returned.

Verify that non-admin users are denied access to this API.

6. Book an event ticket

Using an authenticated user, call the Book Event API and provide the event identifier.
Verify that the booking is successful and ticket availability is reduced.

Ensure booking fails when tickets are sold out or the user is not authenticated.

7. View user bookings

Call the My Bookings API to fetch all bookings for the logged-in user.
Confirm that the previously booked event appears in the response.

## Architecture Design & Folder Structure

This project follows a **layered architecture** to ensure **separation of concerns**, **scalability**, **maintainability**, and **security**.  
Each layer has a single responsibility and communicates only with adjacent layers.

---

### High-Level Request Flow

Client Request
↓
app.ts (Security & Global Middleware)
↓
Router (Routing, Validation, Auth)
↓
Handler (Request/Response Handling)
↓
Service (Business Logic)
↓
Repository (Database Access)
↓
Database (MySQL / MongoDB)

---

## Folder & File Responsibilities

### `app.ts`
- Entry point for Express application configuration
- Registers **global middlewares**:
  - Security middleware (Helmet)
  - CORS configuration
  - Rate limiting
  - JSON body parser
  - Cookie parser
  - Request ID middleware
- Mounts **main route modules**
- Registers **global error middleware**
- Does **not** start the server

**Purpose:**  
Central application configuration and middleware orchestration.

---

### `index.ts`
- Responsible for **starting the HTTP server**
- Loads environment variables
- Connects to databases
- Listens on configured port

**Purpose:**  
Bootstraps and runs the application.

---

### `routers/`
- Contains route definitions for each domain (auth, events, bookings)
- Applies:
  - Authentication middleware
  - Role-based authorization
  - Validation middleware
- Delegates valid requests to handler layer

**Purpose:**  
Routing and request pre-processing.

---

### `handlers/`
- Acts as the **controller layer**
- Responsible for:
  - Request destructuring
  - Calling appropriate service functions
  - Structuring API responses
- No business logic or database access

**Purpose:**  
Handle HTTP request/response lifecycle.

---

### `services/`
- Contains **business logic**
- Coordinates multiple repositories if needed
- Handles:
  - Transactions
  - Cross-database operations
  - Domain rules and validations
- Throws domain-specific errors

**Purpose:**  
Encapsulate core application logic.

---

### `repositories/`
- Handles **direct database interactions**
- Executes queries for:
  - MySQL (users, bookings)
  - MongoDB (events, logs)
- No business logic
- Returns raw or mapped data to services

**Purpose:**  
Abstract database access.

---

### `databases/`
- Manages database connections:
  - MySQL connection (Sequelize / TypeORM)
  - MongoDB connection (Mongoose)
- Ensures connections are established before server start

**Purpose:**  
Centralize database connectivity.

---

### `models/`
- Defines database models/entities
- Maps tables (MySQL) and collections (MongoDB)
- Used by repositories for data operations

**Purpose:**  
Schema and entity definition.

---

### `migrations/`
- Contains database migration scripts
- Executed on server startup
- Ensures required tables and schemas exist
- Applies changes incrementally if database is missing or outdated

**Purpose:**  
Database schema management.

---

### `validators/`
- Joi schemas for request validation
- Central validation middleware
- Ensures incoming data integrity before processing

**Purpose:**  
Protect against invalid and malicious input.

---

### `middlewares/`
- Contains reusable middleware:
  - Authentication
  - Authorization
  - Rate limiting
  - Request ID generation
  - Error handling

**Purpose:**  
Cross-cutting request processing logic.

---

### `logger/`
- Winston-based logging configuration
- MongoDB transport for persistent logs
- Logs request lifecycle (IN / OUT)
- Includes request ID correlation

**Purpose:**  
Observability and debugging.

---

### `errors/`
- Centralized error definitions
- Custom application errors
- Global error handler
- Consistent error response formatting

**Purpose:**  
Robust and predictable error handling.

---

### `constants/`
- Application-wide constants
- Environment-based configuration
- Enums and fixed values

**Purpose:**  
Avoid magic values and centralize configuration.

---

### `interfaces/`
- TypeScript interfaces for:
  - Request/response objects
  - Database entities
  - Service return types

**Purpose:**  
Type safety and consistency across layers.

---

### `types/`
- Global type declarations
- Express request augmentation (e.g., `req.user`)
- Shared type definitions

**Purpose:**  
Enable strongly typed request context across the app.

---

### `utils/`
- Reusable helper functions
- Common utilities (date, JWT helpers, safe stringify, regex escape)

**Purpose:**  
Avoid duplication and keep logic DRY.

---

### `swagger/`
- Swagger/OpenAPI documentation
- API contract definitions
- Exposes interactive API docs

**Purpose:**  
API documentation and testing support.

---

## Architectural Benefits

- Clear separation of concerns
- Easy to maintain and extend
- Secure by design
- Scalable and testable
- Reviewer-friendly and production-ready

This architecture ensures that **each layer has a single responsibility**, making the system easier to debug, enhance, and scale.

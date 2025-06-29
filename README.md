# Restaurant Reservation Backend API

## Overview
A complete restaurant reservation management system built with Node.js, Express, and MongoDB. This API provides full CRUD operations for managing restaurant reservations with comprehensive input validation, conflict checking, and status management. **Maximum 6 reservations allowed per date and time slot.**

## Features
- ✅ Complete CRUD operations for reservations
- ✅ **Joi input validation** with detailed error messages
- ✅ **Availability checking** (max 6 reservations per date/time)
- ✅ Conflict detection for overlapping reservations
- ✅ Status management (pending, confirmed, cancelled)
- ✅ Date and time validation
- ✅ Layered architecture (Controller-Service-Repository)
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API design
- ✅ CORS enabled
- ✅ Environment configuration
- ✅ **Comprehensive validation middleware**

## Project Structure
```
Backend/
├── src/
│   ├── config/
│   │   ├── config.js              # Environment configuration
│   │   └── database.js            # MongoDB connection
│   ├── controllers/
│   │   └── reservationController.js # HTTP request handlers
│   ├── middleware/
│   │   └── validation.js          # Joi validation schemas
│   ├── model/
│   │   └── reservation.js         # Mongoose schema
│   ├── repositories/
│   │   └── reservationRepository.js # Data access layer
│   ├── routes/
│   │   └── reservationRoutes.js   # API routes with validation
│   ├── services/
│   │   └── reservationService.js  # Business logic
│   ├── app.js                     # Express app configuration
│   └── server.js                  # Server startup
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/restaurant
   MONGODB_URI_PROD=your_production_mongodb_uri
   NODE_ENV=development
   PORT=4000
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Base URL: `http://localhost:4000/api`

### Health Check
- `GET /health` - Check server status

### Reservations

#### Check Availability
- `POST /reservations/check-availability`
- **Body:**
  ```json
  {
    "date": "2024-01-15",
    "time": "7:30 PM"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "available": true,
      "currentCount": 3,
      "maxReservations": 6,
      "remainingSlots": 3
    },
    "message": "Time slot is available. 3 slots remaining."
  }
  ```

#### Create Reservation
- `POST /reservations`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "date": "2024-01-15",
    "time": "7:30 PM",
    "guests": 4
  }
  ```

#### Get All Reservations
- `GET /reservations`
- Returns all reservations sorted by creation date

#### Get Reservation by ID
- `GET /reservations/:id`
- Returns a specific reservation

#### Update Reservation
- `PUT /reservations/:id`
- **Body:** Any fields to update
  ```json
  {
    "guests": 6,
    "time": "8:00 PM"
  }
  ```

#### Delete Reservation
- `DELETE /reservations/:id`
- Deletes a reservation

#### Get Reservations by Date
- `GET /reservations/date/:date`
- Example: `GET /reservations/date/2024-01-15`

#### Get Reservations by Status
- `GET /reservations/status/:status`
- Valid statuses: `pending`, `confirmed`, `cancelled`
- Example: `GET /reservations/status/pending`

#### Update Reservation Status
- `PATCH /reservations/:id/status`
- **Body:**
  ```json
  {
    "status": "confirmed"
  }
  ```

## Data Models

### Reservation Schema
```javascript
{
  name: String (required, 2-50 characters),
  email: String (required, valid email format),
  phoneNumber: String (required, exactly 10 digits),
  date: Date (required, future date only),
  time: String (required, HH:MM AM/PM format),
  guests: Number (required, 1-20 guests),
  status: String (enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Business Rules

### Capacity Management
- **Maximum 6 reservations** allowed per date and time slot
- System automatically checks availability before creating/updating reservations
- Cancelled reservations don't count towards the limit
- Real-time availability checking via dedicated endpoint

### Conflict Detection
- Reservations within 2 hours of each other are considered conflicting
- System prevents double-booking
- Validates both new reservations and updates

## Validation Rules

### Input Validation (Joi)
All inputs are validated using Joi schemas with detailed error messages:

#### Name
- Required
- 2-50 characters long
- Cannot be empty

#### Email
- Required
- Must be valid email format
- Automatically converted to lowercase

#### Phone Number
- Required
- Exactly 10 digits
- No special characters allowed

#### Date
- Required
- Must be today or a future date
- Past dates are not allowed
- Format: YYYY-MM-DD

#### Time
- Required
- Must be in `HH:MM AM/PM` format
- Examples: `7:30 PM`, `12:00 AM`, `11:45 PM`

#### Guests
- Required
- Must be a whole number
- 1-20 guests allowed

#### Status
- Must be one of: `pending`, `confirmed`, `cancelled`

#### Reservation ID
- Must be valid MongoDB ObjectId format (24 hex characters)

## Error Handling

### Validation Errors
The API returns detailed validation error responses:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name must be at least 2 characters long",
    "Phone number must be exactly 10 digits",
    "Time must be in HH:MM AM/PM format (e.g., 7:30 PM)"
  ]
}
```

### Business Logic Errors
```json
{
  "success": false,
  "error": "Time slot is full. Maximum 6 reservations allowed for this date and time."
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Business Logic

### Reservation Flow
1. **Validation**: All input fields are validated using Joi
2. **Availability Check**: System checks if slot has capacity (max 6 reservations)
3. **Conflict Check**: System checks for time conflicts
4. **Creation**: Reservation is saved to database
5. **Status Management**: Default status is 'pending'

### Status Management
- `pending`: New reservations
- `confirmed`: Approved by restaurant
- `cancelled`: Cancelled reservations (don't count towards capacity)

### Availability Checking
- Check availability before creating reservations
- Real-time slot capacity information
- Excludes cancelled reservations from count
- Provides remaining slots information

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `MONGODB_URI_PROD` | Production MongoDB URI | Required |
| `NODE_ENV` | Environment (development/production) | `development` |
| `PORT` | Server port | `4000` |

## Dependencies

### Production
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `joi`: Input validation library
- `cors`: Cross-origin resource sharing
- `cookie-parser`: Cookie parsing middleware
- `body-parser`: Request body parsing
- `dotenv`: Environment variable management

### Development
- `nodemon`: Auto-restart server on file changes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
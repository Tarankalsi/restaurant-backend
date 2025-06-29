const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const {
  validateReservation,
  validateCheckAvailability,
  validateUpdateReservation,
  validateStatusUpdate,
  validateDateParam,
  validateStatusParam,
  validateIdParam
} = require('../middleware/validation');

// Check availability for a date and time
router.post('/reservations/check-availability', validateCheckAvailability, reservationController.checkAvailability);

// Create a new reservation
router.post('/reservations', validateReservation, reservationController.createReservation);

// Get all reservations
router.get('/reservations', reservationController.getAllReservations);

// Get reservation by ID
router.get('/reservations/:id', validateIdParam, reservationController.getReservationById);

// Update reservation
router.put('/reservations/:id', validateIdParam, validateUpdateReservation, reservationController.updateReservation);

// Delete reservation
router.delete('/reservations/:id', validateIdParam, reservationController.deleteReservation);

// Get reservations by date
router.get('/reservations/date/:date', validateDateParam, reservationController.getReservationsByDate);

// Get reservations by status
router.get('/reservations/status/:status', validateStatusParam, reservationController.getReservationsByStatus);

// Update reservation status
router.patch('/reservations/:id/status', validateIdParam, validateStatusUpdate, reservationController.updateReservationStatus);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
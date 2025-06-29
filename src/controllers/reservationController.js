const reservationService = require('../services/reservationService');

class ReservationController {
  // Create a new reservation
  async createReservation(req, res) {
    try {
      const result = await reservationService.createReservation(req.body);

      if (result.success) {
        return res.status(201).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Check availability for a date and time
  async checkAvailability(req, res) {
    try {
      const { date, time } = req.body;
      const result = await reservationService.checkAvailability(date, time);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get all reservations
  async getAllReservations(req, res) {
    try {
      const result = await reservationService.getAllReservations();
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get reservation by ID
  async getReservationById(req, res) {
    try {
      const { id } = req.params;
      const result = await reservationService.getReservationById(id);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update reservation
  async updateReservation(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No update data provided'
        });
      }

      const result = await reservationService.updateReservation(id, updateData);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Delete reservation
  async deleteReservation(req, res) {
    try {
      const { id } = req.params;
      const result = await reservationService.deleteReservation(id);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(404).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get reservations by date
  async getReservationsByDate(req, res) {
    try {
      const { date } = req.params;
      const result = await reservationService.getReservationsByDate(date);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get reservations by status
  async getReservationsByStatus(req, res) {
    try {
      const { status } = req.params;
      const result = await reservationService.getReservationsByStatus(status);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update reservation status
  async updateReservationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await reservationService.updateReservationStatus(id, status);
      
      if (result.success) {
        return res.status(200).json(result);
      } else {
        return res.status(400).json(result);
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}

module.exports = new ReservationController();

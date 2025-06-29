const reservationRepository = require('../repositories/reservationRepository');

class ReservationService {
  // Create a new reservation
  async createReservation(reservationData) {
    try {
      // Check for conflicting reservations
      await this.checkForConflicts(reservationData);
      
      // Check availability (max 6 reservations per date/time)
      await this.checkAvailability(reservationData.date, reservationData.time);
      
      // Create the reservation
      const reservation = await reservationRepository.create(reservationData);
      
      return {
        success: true,
        data: reservation,
        message: 'Reservation created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all reservations
  async getAllReservations() {
    try {
      const reservations = await reservationRepository.findAll();
      return {
        success: true,
        data: reservations,
        message: 'Reservations retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get reservation by ID
  async getReservationById(id) {
    try {
      const reservation = await reservationRepository.findById(id);
      return {
        success: true,
        data: reservation,
        message: 'Reservation retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update reservation
  async updateReservation(id, updateData) {
    try {
      // Check for conflicts if date or time is being updated
      if (updateData.date || updateData.time) {
        const existingReservation = await reservationRepository.findById(id);
        const checkData = {
          ...existingReservation.toObject(),
          ...updateData
        };
        await this.checkForConflicts(checkData, id);
        
        // Check availability for new date/time
        await this.checkAvailability(updateData.date || existingReservation.date, 
                                   updateData.time || existingReservation.time, id);
      }
      
      const reservation = await reservationRepository.update(id, updateData);
      return {
        success: true,
        data: reservation,
        message: 'Reservation updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete reservation
  async deleteReservation(id) {
    try {
      const reservation = await reservationRepository.delete(id);
      return {
        success: true,
        data: reservation,
        message: 'Reservation deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get reservations by date
  async getReservationsByDate(date) {
    try {
      const reservations = await reservationRepository.findByDate(date);
      return {
        success: true,
        data: reservations,
        message: 'Reservations retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get reservations by status
  async getReservationsByStatus(status) {
    try {
      const reservations = await reservationRepository.findByStatus(status);
      return {
        success: true,
        data: reservations,
        message: 'Reservations retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update reservation status
  async updateReservationStatus(id, status) {
    try {
      const reservation = await reservationRepository.update(id, { status });
      return {
        success: true,
        data: reservation,
        message: 'Reservation status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check availability for a specific date and time
  async checkAvailability(date, time, excludeId = null) {
    try {
      const reservations = await reservationRepository.findByDateAndTime(date, time);
      
      // Filter out the current reservation if updating
      const relevantReservations = excludeId 
        ? reservations.filter(r => r._id.toString() !== excludeId && r.status !== 'cancelled')
        : reservations.filter(r => r.status !== 'cancelled');
      
      const currentCount = relevantReservations.length;
      const maxReservations = 6;
      
      if (currentCount >= maxReservations) {
        throw new Error(`Time slot is full. Maximum ${maxReservations} reservations allowed for this date and time.`);
      }
      
      return {
        success: true,
        data: {
          available: true,
          currentCount,
          maxReservations,
          remainingSlots: maxReservations - currentCount
        },
        message: `Time slot is available. ${maxReservations - currentCount} slots remaining.`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Private helper methods
  async checkForConflicts(reservationData, excludeId = null) {
    const { date, time } = reservationData;
    
    // Get all reservations for the same date
    const sameDateReservations = await reservationRepository.findByDate(date);
    
    // Filter out the current reservation if updating
    const otherReservations = excludeId 
      ? sameDateReservations.filter(r => r._id.toString() !== excludeId)
      : sameDateReservations;
    
    // Check for time conflicts (assuming 2-hour slots)
    const requestedTime = new Date(`2000-01-01 ${time}`);
    const requestedHour = requestedTime.getHours();
    
    for (const reservation of otherReservations) {
      const existingTime = new Date(`2000-01-01 ${reservation.time}`);
      const existingHour = existingTime.getHours();
      
      // Check if times overlap (within 2 hours of each other)
      if (Math.abs(requestedHour - existingHour) < 2) {
        throw new Error(`Time slot conflicts with existing reservation at ${reservation.time}`);
      }
    }
  }
}

module.exports = new ReservationService();

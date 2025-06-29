const Reservation = require('../model/reservation');

class ReservationRepository {
  // Create a new reservation
  async create(reservationData) {
    try {
      const reservation = new Reservation(reservationData);
      return await reservation.save();
    } catch (error) {
      throw new Error(`Failed to create reservation: ${error.message}`);
    }
  }

  // Get all reservations
  async findAll() {
    try {
      return await Reservation.find().sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to fetch reservations: ${error.message}`);
    }
  }

  // Get reservation by ID
  async findById(id) {
    try {
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      return reservation;
    } catch (error) {
      throw new Error(`Failed to fetch reservation: ${error.message}`);
    }
  }

  // Update reservation
  async update(id, updateData) {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      return reservation;
    } catch (error) {
      throw new Error(`Failed to update reservation: ${error.message}`);
    }
  }

  // Delete reservation
  async delete(id) {
    try {
      const reservation = await Reservation.findByIdAndDelete(id);
      if (!reservation) {
        throw new Error('Reservation not found');
      }
      return reservation;
    } catch (error) {
      throw new Error(`Failed to delete reservation: ${error.message}`);
    }
  }

  // Get reservations by date
  async findByDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await Reservation.find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }).sort({ time: 1 });
    } catch (error) {
      throw new Error(`Failed to fetch reservations by date: ${error.message}`);
    }
  }

  // Get reservations by date and time
  async findByDateAndTime(date, time) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await Reservation.find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        time: time
      }).sort({ createdAt: 1 });
    } catch (error) {
      throw new Error(`Failed to fetch reservations by date and time: ${error.message}`);
    }
  }

  // Get reservations by status
  async findByStatus(status) {
    try {
      return await Reservation.find({ status }).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Failed to fetch reservations by status: ${error.message}`);
    }
  }
}

module.exports = new ReservationRepository();

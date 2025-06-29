const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
      'Please enter a valid email address'
    ]
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'] // adjust for your locale
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function (value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: 'Reservation date must be today or a future date'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    match: [/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, 'Time must be in HH:MM AM/PM format']
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'There must be at least 1 guest']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;

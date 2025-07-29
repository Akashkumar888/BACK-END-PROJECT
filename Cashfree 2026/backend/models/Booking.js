const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true
  },
  bookingDateTime: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    default: null
  },
  paymentTime: {
    type: Date,
    default: null
  },
  bankReference: {
    type: String,
    default: null
  },
  paymentMessage: {
    type: String,
    default: null
  },
  orderId: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    default: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema); 
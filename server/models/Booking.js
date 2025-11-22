const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station',
    required: true
  },
  chargerId: {
    type: String,
    required: true
  },
  bookingType: {
    type: String,
    enum: ['immediate', 'scheduled'],
    default: 'immediate'
  },
  scheduledTime: {
    startTime: Date,
    endTime: Date
  },
  actualSession: {
    startTime: Date,
    endTime: Date,
    energyDelivered: Number, // in kWh
    peakPower: Number, // in kW
    averagePower: Number // in kW
  },
  vehicle: {
    make: String,
    model: String,
    batteryCapacity: Number,
    initialBatteryLevel: Number, // percentage
    targetBatteryLevel: Number, // percentage
    finalBatteryLevel: Number // percentage
  },
  pricing: {
    energyPrice: Number, // per kWh
    timePrice: Number, // per minute
    sessionFee: Number,
    totalCost: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    discountApplied: Number,
    finalAmount: Number
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'upi', 'wallet', 'cash'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    gateway: String
  },
  status: {
    type: String,
    enum: ['booked', 'active', 'completed', 'cancelled', 'no-show'],
    default: 'booked'
  },
  cancellation: {
    cancelledAt: Date,
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['user', 'system', 'operator']
    },
    refundAmount: Number
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date,
    categories: {
      chargingSpeed: Number,
      stationCleanliness: Number,
      accessibility: Number,
      customerService: Number
    }
  },
  notifications: [{
    type: String,
    message: String,
    sentAt: Date,
    channel: {
      type: String,
      enum: ['email', 'sms', 'push', 'in-app']
    }
  }],
  metadata: {
    appVersion: String,
    platform: String,
    userAgent: String,
    referralSource: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ userId: 1 });
bookingSchema.index({ stationId: 1 });
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'scheduledTime.startTime': 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  if (this.actualSession.startTime && this.actualSession.endTime) {
    return (this.actualSession.endTime - this.actualSession.startTime) / (1000 * 60); // in minutes
  }
  return 0;
});

// Virtual for energy efficiency
bookingSchema.virtual('efficiency').get(function() {
  if (this.actualSession.energyDelivered && this.duration > 0) {
    return this.actualSession.energyDelivered / (this.duration / 60); // kWh per hour
  }
  return 0;
});

module.exports = mongoose.model('Booking', bookingSchema);
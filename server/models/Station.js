const mongoose = require('mongoose');

const chargerSchema = new mongoose.Schema({
  chargerId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla Supercharger']
  },
  powerOutput: {
    type: Number,
    required: true // in kW
  },
  connector: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'out-of-order', 'maintenance'],
    default: 'available'
  },
  pricing: {
    perKwh: Number, // Price per kWh
    perMinute: Number, // Price per minute
    sessionFee: Number, // Fixed session fee
    currency: {
      type: String,
      default: 'INR'
    }
  },
  currentSession: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startTime: Date,
    energyDelivered: Number,
    estimatedEndTime: Date
  },
  lastMaintenance: Date,
  totalSessions: {
    type: Number,
    default: 0
  },
  totalEnergyDelivered: {
    type: Number,
    default: 0
  }
});

const stationSchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  operator: {
    name: String,
    contact: {
      phone: String,
      email: String
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Invalid pincode format']
    },
    country: {
      type: String,
      default: 'India'
    },
    landmark: String
  },
  chargers: [chargerSchema],
  amenities: [{
    type: String,
    enum: [
      'WiFi', 'Restroom', 'Food Court', 'Shopping', 'ATM', 
      'Parking', 'Security', '24/7 Access', 'Wheelchair Accessible',
      'Car Wash', 'Tire Service', 'Lounge', 'EV Service Center'
    ]
  }],
  operatingHours: {
    monday: { open: String, close: String, is24Hours: Boolean },
    tuesday: { open: String, close: String, is24Hours: Boolean },
    wednesday: { open: String, close: String, is24Hours: Boolean },
    thursday: { open: String, close: String, is24Hours: Boolean },
    friday: { open: String, close: String, is24Hours: Boolean },
    saturday: { open: String, close: String, is24Hours: Boolean },
    sunday: { open: String, close: String, is24Hours: Boolean }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    breakdown: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  accessibility: {
    wheelchairAccessible: Boolean,
    disabledParking: Boolean,
    audioAssistance: Boolean
  },
  security: {
    cctv: Boolean,
    security24x7: Boolean,
    wellLit: Boolean,
    fenced: Boolean
  },
  network: {
    provider: String,
    networkId: String,
    roamingAllowed: Boolean
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'construction'],
    default: 'active'
  },
  verified: {
    type: Boolean,
    default: false
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  stats: {
    totalSessions: {
      type: Number,
      default: 0
    },
    totalEnergyDelivered: {
      type: Number,
      default: 0
    }, // in kWh
    averageSessionDuration: {
      type: Number,
      default: 0
    }, // in minutes
    peakHours: [{
      day: String,
      hour: Number,
      utilization: Number // percentage
    }]
  }
}, {
  timestamps: true
});

// Indexes for better query performance
stationSchema.index({ location: '2dsphere' });
stationSchema.index({ 'address.city': 1 });
stationSchema.index({ 'address.state': 1 });
stationSchema.index({ 'address.pincode': 1 });
stationSchema.index({ status: 1 });
stationSchema.index({ 'rating.average': -1 });
stationSchema.index({ stationId: 1 }, { unique: true });

// Virtual for available chargers count
stationSchema.virtual('availableChargers').get(function() {
  return this.chargers.filter(charger => charger.status === 'available').length;
});

// Virtual for total chargers count
stationSchema.virtual('totalChargers').get(function() {
  return this.chargers.length;
});

module.exports = mongoose.model('Station', stationSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]{10,}$/, 'Invalid phone number format']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  avatar: {
    type: String,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    validUntil: Date,
    features: [{
      type: String
    }]
  },
  vehicleInfo: {
    make: String,
    model: String,
    year: Number,
    batteryCapacity: Number, // in kWh
    chargingType: [{
      type: String,
      enum: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla']
    }],
    efficiency: Number // km per kWh
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  stats: {
    totalChargingSessions: {
      type: Number,
      default: 0
    },
    totalEnergyCharged: {
      type: Number,
      default: 0
    }, // in kWh
    carbonSaved: {
      type: Number,
      default: 0
    }, // in kg CO2
    totalSpent: {
      type: Number,
      default: 0
    } // in INR
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);
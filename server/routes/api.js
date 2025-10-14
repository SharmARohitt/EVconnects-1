const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const config = require('../config');

// Initialize Stripe only if we have a key
let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } else {
    console.warn('No Stripe API key provided. Stripe functionality will be mocked.');
  }
} catch (error) {
  console.error('Error initializing Stripe:', error);
}

// Get all stations
router.get('/stations', async (req, res) => {
  try {
    // Try to get stations from MongoDB
    let stations;
    try {
      stations = await Station.find();
    } catch (dbErr) {
      // If MongoDB is not connected, use mock data
      console.log('Using mock data for stations');
      stations = require('../../src/mockData').stations;
    }
    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nearby stations - this route must be defined BEFORE the :id route
router.get('/stations/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    
    let stations;
    try {
      // Convert radius from km to meters
      const radiusInMeters = parseInt(radius) * 1000;
      
      stations = await Station.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radiusInMeters
          }
        }
      });
    } catch (dbErr) {
      // If MongoDB is not connected, use mock data
      console.log('Using mock data for nearby stations');
      stations = require('../../src/mockData').stations;
      // Sort by distance for the mock data (which already has distance property)
      stations = stations.sort((a, b) => a.distance - b.distance);
    }
    
    res.json(stations);
  } catch (err) {
    console.error('Error fetching nearby stations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }
    
    // Check if Stripe is available
    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to cents
        currency: 'usd',
        payment_method_types: ['card'],
      });
      
      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      // Mock response for development
      console.log('Using mock payment intent response');
      res.json({
        clientSecret: 'pi_mock_secret_' + Math.random().toString(36).substring(2, 15),
      });
    }
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message });
  }
});

// Payment history (protected route example)
router.get('/payments/history', (req, res) => {
  // This would typically check user authentication
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Mock payment history
  res.json([
    {
      id: 'payment_1',
      amount: 15.75,
      date: new Date(),
      status: 'completed',
      station: 'Station Name'
    }
  ]);
});

module.exports = router;
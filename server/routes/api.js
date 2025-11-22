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

// Get all stations with filtering and search
router.get('/stations', async (req, res) => {
  try {
    const { 
      search, 
      city, 
      state, 
      amenities, 
      chargerType, 
      availability,
      minRating,
      sortBy = 'name',
      order = 'asc',
      page = 1,
      limit = 50
    } = req.query;

    let stations;
    try {
      // Build MongoDB query
      let query = { status: 'active' };
      
      // Search by name or address
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { 'address.street': { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } }
        ];
      }
      
      // Filter by city
      if (city) {
        query['address.city'] = { $regex: city, $options: 'i' };
      }
      
      // Filter by state
      if (state) {
        query['address.state'] = { $regex: state, $options: 'i' };
      }
      
      // Filter by amenities
      if (amenities) {
        const amenityList = amenities.split(',');
        query.amenities = { $in: amenityList };
      }
      
      // Filter by charger type
      if (chargerType) {
        query['chargers.type'] = chargerType;
      }
      
      // Filter by availability
      if (availability === 'true') {
        query['chargers.status'] = 'available';
      }
      
      // Filter by minimum rating
      if (minRating) {
        query['rating.average'] = { $gte: parseFloat(minRating) };
      }
      
      // Build sort object
      let sort = {};
      if (sortBy === 'rating') {
        sort['rating.average'] = order === 'desc' ? -1 : 1;
      } else if (sortBy === 'name') {
        sort.name = order === 'desc' ? -1 : 1;
      } else if (sortBy === 'created') {
        sort.createdAt = order === 'desc' ? -1 : 1;
      }
      
      // Execute query with pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      stations = await Station.find(query)
        .populate('chargers')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));
        
      const total = await Station.countDocuments(query);
      
      res.json({
        stations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
      
    } catch (dbErr) {
      // If MongoDB is not connected, use mock data
      console.log('Using mock data for stations');
      const mockStations = require('../../src/data/mockStations.json') || [];
      
      // Apply basic filtering to mock data
      let filteredStations = mockStations;
      
      if (search) {
        filteredStations = filteredStations.filter(station =>
          station.name.toLowerCase().includes(search.toLowerCase()) ||
          station.address.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (city) {
        filteredStations = filteredStations.filter(station =>
          station.address.toLowerCase().includes(city.toLowerCase())
        );
      }
      
      res.json({
        stations: filteredStations,
        pagination: {
          page: 1,
          limit: filteredStations.length,
          total: filteredStations.length,
          pages: 1
        }
      });
    }
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nearby stations with enhanced filtering
router.get('/stations/nearby', async (req, res) => {
  try {
    const { 
      lat, 
      lng, 
      radius = 10,
      chargerType,
      amenities,
      availability,
      minRating
    } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    let stations;
    try {
      // Convert radius from km to meters
      const radiusInMeters = parseInt(radius) * 1000;
      
      // Build query with location and filters
      let query = {
        status: 'active',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: radiusInMeters
          }
        }
      };
      
      // Add additional filters
      if (chargerType) {
        query['chargers.type'] = chargerType;
      }
      
      if (amenities) {
        const amenityList = amenities.split(',');
        query.amenities = { $in: amenityList };
      }
      
      if (availability === 'true') {
        query['chargers.status'] = 'available';
      }
      
      if (minRating) {
        query['rating.average'] = { $gte: parseFloat(minRating) };
      }
      
      stations = await Station.find(query)
        .populate('chargers')
        .limit(50);
        
    } catch (dbErr) {
      // If MongoDB is not connected, use mock data
      console.log('Using mock data for nearby stations');
      const mockStations = require('../../src/data/mockStations.json') || [];
      
      // Sort by distance for the mock data (if it has distance property)
      stations = mockStations
        .filter(station => station.distance <= parseInt(radius))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    res.json(stations);
  } catch (err) {
    console.error('Error fetching nearby stations:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get station by ID
router.get('/stations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    let station;
    try {
      station = await Station.findById(id)
        .populate('chargers')
        .populate({
          path: 'reviews.userId',
          select: 'firstName lastName avatar'
        });
        
      if (!station) {
        return res.status(404).json({ error: 'Station not found' });
      }
      
    } catch (dbErr) {
      // If MongoDB is not connected, use mock data
      console.log('Using mock data for station details');
      const mockStations = require('../../src/data/mockStations.json') || [];
      station = mockStations.find(s => s.id === id || s._id === id);
      
      if (!station) {
        return res.status(404).json({ error: 'Station not found' });
      }
    }
    
    res.json(station);
  } catch (err) {
    console.error('Error fetching station:', err);
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
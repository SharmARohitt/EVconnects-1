import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiSearch, 
  HiLocationMarker, 
  HiFilter, 
  HiStar, 
  HiLightningBolt,
  HiClock,
  HiWifi,
  HiShieldCheck,
  HiRefresh,
  HiMap,
  HiViewList,
  HiAdjustments,
  HiCheck
} from 'react-icons/hi';
import StationCard from '../components/StationCard';

const StationSearch = () => {
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    chargerType: '',
    amenities: [],
    availability: false,
    minRating: 0,
    maxDistance: 50,
    priceRange: [0, 100]
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Sort options
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const chargerTypes = [
    { value: 'Type 2', label: 'Type 2 (AC)' },
    { value: 'CCS', label: 'CCS (DC Fast)' },
    { value: 'CHAdeMO', label: 'CHAdeMO (DC)' },
    { value: 'Tesla Supercharger', label: 'Tesla Supercharger' }
  ];

  const amenityOptions = [
    { value: 'WiFi', label: 'WiFi', icon: HiWifi },
    { value: 'Restroom', label: 'Restroom', icon: HiShieldCheck },
    { value: 'Food Court', label: 'Food Court', icon: HiClock },
    { value: 'Shopping', label: 'Shopping', icon: HiLocationMarker },
    { value: 'ATM', label: 'ATM', icon: HiLightningBolt },
    { value: 'Parking', label: 'Parking', icon: HiMap },
    { value: 'Security', label: 'Security', icon: HiShieldCheck },
    { value: '24/7 Access', label: '24/7 Access', icon: HiClock }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'distance', label: 'Distance' },
    { value: 'price', label: 'Price' },
    { value: 'availability', label: 'Availability' }
  ];

  // Load stations from API or mock data
  const loadStations = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search: searchQuery,
        city: filters.city,
        state: filters.state,
        chargerType: filters.chargerType,
        amenities: filters.amenities.join(','),
        availability: filters.availability.toString(),
        minRating: filters.minRating.toString(),
        sortBy,
        order: sortOrder,
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });

      // Remove empty parameters
      for (let [key, value] of queryParams.entries()) {
        if (!value || value === 'false' || value === '0' || value === '') {
          queryParams.delete(key);
        }
      }

      const response = await fetch(`/api/stations?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.stations) {
        setStations(data.stations);
        setFilteredStations(data.stations);
        setPagination(data.pagination || pagination);
      } else {
        // Fallback to mock data
        const mockData = await import('../data/mockStations.json');
        setStations(mockData.default || []);
        setFilteredStations(mockData.default || []);
      }
    } catch (error) {
      console.error('Error loading stations:', error);
      // Fallback to mock data
      try {
        const mockData = await import('../data/mockStations.json');
        setStations(mockData.default || []);
        setFilteredStations(mockData.default || []);
      } catch (mockError) {
        console.error('Error loading mock data:', mockError);
        setStations([]);
        setFilteredStations([]);
      }
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortBy, sortOrder, pagination.page, pagination.limit]);

  // Generate realistic nearby stations based on user location
  const generateNearbyStations = (userLat, userLng, count = 8) => {
    const stationTemplates = [
      {
        name: 'TATA Power EV Station',
        brand: 'TATA Power',
        chargerTypes: ['CCS', 'CHAdeMO', 'Type 2 AC'],
        pricing: { 'CCS': 120, 'CHAdeMO': 150, 'Type 2 AC': 80 },
        totalChargers: 6,
        powerOutput: '150kW'
      },
      {
        name: 'Ather Grid Charging Hub',
        brand: 'Ather Grid',
        chargerTypes: ['Type 2 AC', 'CCS'],
        pricing: { 'Type 2 AC': 80, 'CCS': 115 },
        totalChargers: 4,
        powerOutput: '22kW'
      },
      {
        name: 'EESL Fast Charging Station',
        brand: 'EESL',
        chargerTypes: ['CCS', 'CHAdeMO'],
        pricing: { 'CCS': 130, 'CHAdeMO': 160 },
        totalChargers: 8,
        powerOutput: '200kW'
      },
      {
        name: 'Fortum Charge & Drive',
        brand: 'Fortum',
        chargerTypes: ['CCS', 'CHAdeMO', 'Type 2 AC'],
        pricing: { 'CCS': 110, 'CHAdeMO': 140, 'Type 2 AC': 75 },
        totalChargers: 10,
        powerOutput: '180kW'
      },
      {
        name: 'Indian Oil EV Charging',
        brand: 'Indian Oil',
        chargerTypes: ['Type 2 AC', 'CCS'],
        pricing: { 'Type 2 AC': 85, 'CCS': 125 },
        totalChargers: 5,
        powerOutput: '50kW'
      },
      {
        name: 'ChargePoint Express',
        brand: 'ChargePoint',
        chargerTypes: ['CCS', 'Type 2 AC'],
        pricing: { 'CCS': 135, 'Type 2 AC': 90 },
        totalChargers: 6,
        powerOutput: '175kW'
      },
      {
        name: 'Bharat Petroleum EV Hub',
        brand: 'Bharat Petroleum',
        chargerTypes: ['CHAdeMO', 'Type 2 AC'],
        pricing: { 'CHAdeMO': 155, 'Type 2 AC': 82 },
        totalChargers: 4,
        powerOutput: '100kW'
      },
      {
        name: 'Reliance Jio-bp Pulse',
        brand: 'Jio-bp',
        chargerTypes: ['CCS', 'CHAdeMO', 'Type 2 AC'],
        pricing: { 'CCS': 128, 'CHAdeMO': 158, 'Type 2 AC': 88 },
        totalChargers: 12,
        powerOutput: '250kW'
      }
    ];

    const locationTypes = [
      'Mall', 'Shopping Complex', 'Business Park', 'Metro Station',
      'Hospital', 'Airport', 'Railway Station', 'Highway Plaza',
      'Tech Park', 'Commercial Center', 'Residential Complex'
    ];

    const areaNames = [
      'Central Plaza', 'City Center', 'Tech Valley', 'Green Park',
      'Marina Bay', 'Golden Square', 'Sapphire Mall', 'Crystal Tower',
      'Diamond District', 'Platinum Heights', 'Silver Springs', 'Ruby Plaza'
    ];

    return Array.from({ length: count }, (_, index) => {
      // Generate random coordinates within 5km radius
      const radiusInDegrees = 0.045; // ~5km
      const randomLat = userLat + (Math.random() - 0.5) * 2 * radiusInDegrees;
      const randomLng = userLng + (Math.random() - 0.5) * 2 * radiusInDegrees;
      
      // Calculate distance
      const distance = Math.sqrt(
        Math.pow((randomLat - userLat) * 111, 2) + 
        Math.pow((randomLng - userLng) * 111 * Math.cos(userLat * Math.PI / 180), 2)
      );

      const template = stationTemplates[index % stationTemplates.length];
      const locationType = locationTypes[Math.floor(Math.random() * locationTypes.length)];
      const areaName = areaNames[Math.floor(Math.random() * areaNames.length)];
      
      const availableChargers = Math.floor(Math.random() * template.totalChargers) + 1;
      const isAvailable = availableChargers > 0;
      
      return {
        id: `nearby_${index + 1}`,
        name: `${template.name} - ${areaName}`,
        address: `${areaName} ${locationType}, Near Your Location`,
        location: {
          lat: randomLat,
          lng: randomLng
        },
        distance: parseFloat(distance.toFixed(1)),
        isAvailable,
        chargerTypes: template.chargerTypes,
        totalChargers: template.totalChargers,
        availableChargers,
        pricing: template.pricing,
        averageWaitTime: Math.floor(Math.random() * 20) + 5,
        demandLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        rating: parseFloat((4.0 + Math.random() * 1.0).toFixed(1)),
        totalBookings: Math.floor(Math.random() * 2000) + 500,
        powerOutput: template.powerOutput,
        amenities: [
          'WiFi', 'Restroom', 'Parking', 'Security',
          'Food Court', 'Shopping', 'ATM', '24/7 Access'
        ].slice(0, Math.floor(Math.random() * 4) + 3)
      };
    }).sort((a, b) => a.distance - b.distance);
  };

  // Load user's current location and nearby stations
  const loadNearbyStations = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Generate realistic nearby stations
            const nearbyStations = generateNearbyStations(latitude, longitude, 8);
            
            // Apply filters if any
            let filteredNearby = nearbyStations;
            
            if (filters.chargerType) {
              filteredNearby = filteredNearby.filter(station => 
                station.chargerTypes.includes(filters.chargerType)
              );
            }
            
            if (filters.availability) {
              filteredNearby = filteredNearby.filter(station => station.isAvailable);
            }
            
            if (filters.minRating > 0) {
              filteredNearby = filteredNearby.filter(station => station.rating >= filters.minRating);
            }
            
            setStations(filteredNearby);
            setFilteredStations(filteredNearby);
            
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.innerHTML = `
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                Found ${filteredNearby.length} stations near your location!
              </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 3000);
            
          } catch (error) {
            console.error('Error generating nearby stations:', error);
            // Fallback to mock data
            try {
              const mockData = await import('../data/mockStations.json');
              setStations(mockData.stations || []);
              setFilteredStations(mockData.stations || []);
            } catch (mockError) {
              console.error('Error loading fallback data:', mockError);
            }
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
          
          const errorMessages = {
            1: 'Location access denied. Please enable location services and try again.',
            2: 'Location unavailable. Please check your GPS connection.',
            3: 'Location request timed out. Please try again.'
          };
          
          const message = errorMessages[error.code] || 'Unable to access your location. Please enable location services.';
          
          const notification = document.createElement('div');
          notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
          notification.innerHTML = `
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              ${message}
            </div>
          `;
          document.body.appendChild(notification);
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 5000);
        }
      );
    } else {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      notification.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          Geolocation is not supported by this browser.
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 5000);
    }
  }, [filters]);

  // Effect to load stations when component mounts
  useEffect(() => {
    loadStations();
  }, [loadStations]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle amenity toggle
  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      chargerType: '',
      amenities: [],
      availability: false,
      minRating: 0,
      maxDistance: 50,
      priceRange: [0, 100]
    });
    setSearchQuery('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Find Charging Stations
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover EV charging stations near you with real-time availability
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search by name, city, or address..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadNearbyStations}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
              >
                <HiLocationMarker className={`mr-2 h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
                {loading ? 'Locating...' : 'Near Me'}
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <HiFilter className="mr-2 h-4 w-4" />
                Filters
              </button>

              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  <HiViewList className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 ${viewMode === 'map' 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                  } transition-colors`}
                >
                  <HiMap className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Enter city name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Charger Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Charger Type
                  </label>
                  <select
                    value={filters.chargerType}
                    onChange={(e) => handleFilterChange('chargerType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">All Types</option>
                    {chargerTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Rating
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="0">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={loadStations}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map(amenity => (
                    <button
                      key={amenity.value}
                      onClick={() => toggleAmenity(amenity.value)}
                      className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        filters.amenities.includes(amenity.value)
                          ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <amenity.icon className="mr-1 h-4 w-4" />
                      {amenity.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show only available stations
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500 mr-2"></div>
                  Searching for stations...
                </div>
              ) : (
                <div className="flex items-center">
                  <HiLightningBolt className="mr-2 h-5 w-5 text-emerald-500" />
                  {filteredStations.length} charging stations found
                </div>
              )}
            </h2>
            {!loading && filteredStations.length > 0 && (
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                  <HiCheck className="mr-1 h-4 w-4" />
                  {filteredStations.filter(s => s.isAvailable).length} available now
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <HiLocationMarker className="mr-1 h-4 w-4" />
                  Within {Math.max(...filteredStations.map(s => s.distance || 0)).toFixed(1)} km
                </div>
              </div>
            )}
            {pagination.total > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
              </p>
            )}
          </div>
          
          <button
            onClick={loadStations}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiRefresh className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Station Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredStations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStations.map((station, index) => (
              <motion.div
                key={station.id || station._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <StationCard station={station} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HiLocationMarker className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No stations found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or clearing filters
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pagination.page === i + 1
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationSearch;
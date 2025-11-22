import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { motion } from 'framer-motion';
import { 
  HiLocationMarker, 
  HiSearch, 
  HiRefresh,
  HiZoomIn,
  HiZoomOut,
  HiMap,
  HiFilter,
  HiLightningBolt,
  HiClock,
  HiPhone,
  HiGlobe,
  HiStar
} from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';

// Type definition for theme context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Declare global google object
declare global {
  interface Window {
    google: typeof google;
  }
}

// Google Maps API Key - In production, this should be in environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyBhubaWdWjBNyZ_Y1wBsIJQYr3gJZZeVKc'; // Demo key - replace with your actual key

interface EVStation {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
  rating: number;
  connectorTypes: string[];
  availability: 'available' | 'busy' | 'offline';
  pricing: number;
  isRealStation: boolean; // To distinguish between real API data and mock data
  amenities: string[];
  operatingHours: string;
  contact?: string;
  website?: string;
}

interface GoogleMapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  stations: EVStation[];
  onStationSelect: (station: EVStation) => void;
  selectedStation: EVStation | null;
  searchRadius: number;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom, 
  stations, 
  onStationSelect, 
  selectedStation,
  searchRadius 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [searchCircle, setSearchCircle] = useState<google.maps.Circle | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi.business',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'poi.school',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });
      setMap(newMap);
    }
  }, [center, zoom, map]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      // Clear existing search circle
      if (searchCircle) {
        searchCircle.setMap(null);
      }

      // Add search radius circle
      const circle = new google.maps.Circle({
        strokeColor: '#10B981',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#10B981',
        fillOpacity: 0.1,
        map,
        center,
        radius: searchRadius * 1000, // Convert km to meters
      });
      setSearchCircle(circle);

      // Add station markers
      const newMarkers = stations.map(station => {
        const marker = new google.maps.Marker({
          position: station.location,
          map,
          title: station.name,
          icon: {
            url: station.isRealStation 
              ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#10B981"/>
                  <path d="M12 8h8l-2 8h4l-8 8 2-6h-4l0-10z" fill="white"/>
                </svg>
              `)
              : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#3B82F6"/>
                  <path d="M12 8h8l-2 8h4l-8 8 2-6h-4l0-10z" fill="white"/>
                </svg>
              `),
            scaledSize: new google.maps.Size(32, 32),
          },
        });

        marker.addListener('click', () => {
          onStationSelect(station);
        });

        return marker;
      });
      
      setMarkers(newMarkers);
    }
  }, [map, stations, center, searchRadius, onStationSelect]);

  useEffect(() => {
    if (map && selectedStation) {
      map.panTo(selectedStation.location);
      map.setZoom(15);
    }
  }, [map, selectedStation]);

  return <div ref={mapRef} className="w-full h-full" />;
};

const MapComponentWithWrapper: React.FC<{
  userLocation: google.maps.LatLngLiteral;
  searchRadius: number;
  onRadiusChange: (radius: number) => void;
}> = ({ userLocation, searchRadius, onRadiusChange }) => {
  const themeContext = useTheme() as ThemeContextType | null;
  const isDarkMode = themeContext?.theme === 'dark';
  const [stations, setStations] = useState<EVStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<EVStation | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock EV stations data - In production, this would come from real APIs
  const mockStations: EVStation[] = [
    {
      id: '1',
      name: 'Tesla Supercharger - Connaught Place',
      address: 'Connaught Place, New Delhi, 110001',
      location: { lat: 28.6315, lng: 77.2167 },
      rating: 4.5,
      connectorTypes: ['CCS', 'CHAdeMO', 'Type 2'],
      availability: 'available',
      pricing: 12,
      isRealStation: false,
      amenities: ['WiFi', 'Restroom', 'Cafe', 'Parking'],
      operatingHours: '24/7',
      contact: '+91-11-12345678',
      website: 'https://tesla.com'
    },
    {
      id: '2',
      name: 'Ather Grid - Select City Walk',
      address: 'Select City Walk Mall, Saket, New Delhi, 110017',
      location: { lat: 28.5245, lng: 77.2066 },
      rating: 4.2,
      connectorTypes: ['CCS', 'Type 2'],
      availability: 'busy',
      pricing: 8,
      isRealStation: false,
      amenities: ['Mall', 'Food Court', 'Parking', 'Security'],
      operatingHours: '10:00 AM - 10:00 PM',
      contact: '+91-11-87654321'
    },
    {
      id: '3',
      name: 'Tata Power EZ Charge - DLF Cyber City',
      address: 'DLF Cyber City, Sector 25, Gurugram, 122002',
      location: { lat: 28.4949, lng: 77.0891 },
      rating: 4.0,
      connectorTypes: ['CCS', 'CHAdeMO'],
      availability: 'available',
      pricing: 10,
      isRealStation: false,
      amenities: ['Office Complex', 'Parking', 'Security'],
      operatingHours: '6:00 AM - 11:00 PM',
      contact: '+91-124-1234567'
    }
  ];

  const searchNearbyStations = useCallback(async () => {
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter stations within radius
      const nearbyStations = mockStations.filter(station => {
        const distance = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          station.location.lat, 
          station.location.lng
        );
        station.distance = distance;
        return distance <= searchRadius;
      });

      // Sort by distance
      nearbyStations.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setStations(nearbyStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  }, [userLocation, searchRadius]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    searchNearbyStations();
  }, [searchNearbyStations]);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'busy':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const render = (status: Status) => {
    if (status === Status.LOADING) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (status === Status.FAILURE) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <HiMap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Failed to load map. Please check your internet connection.</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`h-96 w-full rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <GoogleMap
          center={userLocation}
          zoom={12}
          stations={stations}
          onStationSelect={setSelectedStation}
          selectedStation={selectedStation}
          searchRadius={searchRadius}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className={`p-6 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for specific EV stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                Radius:
              </label>
              <select
                value={searchRadius}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }`}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={200}>200 km</option>
              </select>
            </div>
            
            <button
              onClick={searchNearbyStations}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <HiRefresh className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Searching...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} />

      {/* Station List */}
      <div className={`p-6 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Found {stations.length} EV Stations within {searchRadius} km
          </h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Busy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Offline</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {stations.map((station) => (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-all
                ${selectedStation?.id === station.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                }`}
              onClick={() => setSelectedStation(station)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {station.name}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(station.availability)}`}>
                      {station.availability}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <HiLocationMarker className="inline h-4 w-4 mr-1" />
                    {station.address}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <HiStar className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {station.rating}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <HiLightningBolt className="h-4 w-4 text-green-500 mr-1" />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        ₹{station.pricing}/kWh
                      </span>
                    </div>
                    
                    {station.distance && (
                      <div className="flex items-center">
                        <HiLocationMarker className="h-4 w-4 text-blue-500 mr-1" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {station.distance.toFixed(1)} km
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {station.connectorTypes.map((type) => (
                        <span key={type} className={`px-2 py-1 text-xs rounded ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
              
              {selectedStation?.id === station.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <HiClock className="inline h-4 w-4 mr-1" />
                        <strong>Hours:</strong> {station.operatingHours}
                      </p>
                      {station.contact && (
                        <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <HiPhone className="inline h-4 w-4 mr-1" />
                          <strong>Contact:</strong> {station.contact}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <strong>Amenities:</strong> {station.amenities.join(', ')}
                      </p>
                      {station.website && (
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          <HiGlobe className="inline h-4 w-4 mr-1" />
                          <a href={station.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            Visit Website
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComponentWithWrapper;
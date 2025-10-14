import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMap, HiLightningBolt, HiLocationMarker, HiClock, HiTrendingUp } from 'react-icons/hi';
import { routeOptimizerService } from '../../services/aiService';

const RouteOptimizer = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [currentBattery, setCurrentBattery] = useState(80);
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);

  const handleOptimizeRoute = async () => {
    if (!startLocation || !endLocation) {
      alert('Please enter both start and end locations');
      return;
    }

    setIsLoading(true);
    try {
      const data = await routeOptimizerService.optimizeRoute(
        startLocation,
        endLocation,
        currentBattery
      );
      setRouteData(data);
    } catch (error) {
      console.error('Error optimizing route:', error);
    }
    setIsLoading(false);
  };

  const getStopColor = (stop, index) => {
    if (index === 0) return 'bg-green-500';
    if (index === routeData?.chargingStops.length - 1) return 'bg-red-500';
    return 'bg-blue-500';
  };

  const getStopIcon = (index) => {
    if (index === 0) return '🚗';
    if (routeData && index === routeData.chargingStops.length - 1) return '🏁';
    return '⚡';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <HiMap className="mr-3 text-blue-600 dark:text-blue-500" />
            AI Route Optimizer
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Plan your journey with optimal charging stops powered by AI
          </p>
        </motion.div>

        {/* Route Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <HiLocationMarker className="inline mr-1 text-green-600" />
                Start Location
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="e.g., Mumbai"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <HiLocationMarker className="inline mr-1 text-red-600" />
                End Location
              </label>
              <input
                type="text"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                placeholder="e.g., Pune"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <HiLightningBolt className="inline mr-1 text-emerald-600" />
                Current Battery ({currentBattery}%)
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={currentBattery}
                onChange={(e) => setCurrentBattery(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOptimizeRoute}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-5 w-5 border-3 border-white border-t-transparent rounded-full mr-2"
                />
                Optimizing Route...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <HiMap className="mr-2" />
                Optimize Route with AI
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* Route Results */}
        <AnimatePresence>
          {routeData && (
            <>
              {/* Route Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                  <HiMap className="h-8 w-8 mb-2 opacity-80" />
                  <p className="text-sm font-medium opacity-90">Total Distance</p>
                  <p className="text-3xl font-bold">{routeData.totalDistance} km</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                  <HiClock className="h-8 w-8 mb-2 opacity-80" />
                  <p className="text-sm font-medium opacity-90">Estimated Time</p>
                  <p className="text-3xl font-bold">{routeData.estimatedTime}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                  <HiLightningBolt className="h-8 w-8 mb-2 opacity-80" />
                  <p className="text-sm font-medium opacity-90">Charging Stops</p>
                  <p className="text-3xl font-bold">{routeData.chargingStopsCount}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                  <HiLightningBolt className="h-8 w-8 mb-2 opacity-80" />
                  <p className="text-sm font-medium opacity-90">Energy Used</p>
                  <p className="text-3xl font-bold">{routeData.totalEnergyNeeded} kWh</p>
                </div>
              </motion.div>

              {/* Visual Route Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <HiMap className="mr-2 text-blue-600 dark:text-blue-500" />
                  Route Overview
                </h3>
                
                <div className="relative">
                  {/* Route Line */}
                  <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 via-blue-500 to-red-500"></div>
                  
                  {/* Charging Stops */}
                  <div className="space-y-6">
                    {routeData.chargingStops.map((stop, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="relative"
                      >
                        <div className="flex items-start">
                          {/* Stop Marker */}
                          <div className={`relative z-10 flex-shrink-0 w-16 h-16 ${getStopColor(stop, index)} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                            {getStopIcon(index)}
                          </div>
                          
                          {/* Stop Details */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedStop(selectedStop === index ? null : index)}
                            className="flex-1 ml-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                {stop.name}
                              </h4>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {stop.distance} km from start
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Charge Time</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{stop.chargeTime}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Battery After</p>
                                <p className="font-semibold text-emerald-600 dark:text-emerald-500">{stop.batteryAfterCharge}%</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Cost</p>
                                <p className="font-semibold text-blue-600 dark:text-blue-500">₹{stop.cost}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Availability</p>
                                <p className="font-semibold text-green-600 dark:text-green-500">{stop.availability}</p>
                              </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                              {selectedStop === index && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                                >
                                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    <strong>AI Recommendation:</strong> {stop.aiRecommendation}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {stop.amenities && stop.amenities.map((amenity, i) => (
                                      <span
                                        key={i}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                                      >
                                        {amenity}
                                      </span>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 shadow-lg text-white mb-8"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <HiTrendingUp className="mr-2" />
                  AI-Generated Insights
                </h3>
                <div className="space-y-3">
                  {routeData.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3"
                    >
                      <HiLightningBolt className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Alternative Routes */}
              {routeData.alternativeRoutes && routeData.alternativeRoutes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    🔀 Alternative Routes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {routeData.alternativeRoutes.map((route, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                      >
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{route.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <p>Distance: <span className="font-semibold">{route.distance} km</span></p>
                          <p>Time: <span className="font-semibold">{route.time}</span></p>
                          <p>Stops: <span className="font-semibold">{route.stops}</span></p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{route.note}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!routeData && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <HiMap className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Route Planned Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Enter your start and end locations to get AI-optimized route recommendations
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RouteOptimizer;

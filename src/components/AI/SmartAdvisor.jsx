import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiLightningBolt, HiClock, HiCurrencyRupee, HiTrendingDown, HiCheckCircle } from 'react-icons/hi';
import { smartAdvisorService } from '../../services/aiService';

const SmartAdvisor = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationPrediction, setStationPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const data = await smartAdvisorService.getChargingRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
    setIsLoading(false);
  };

  const handleStationSelect = async (station) => {
    setSelectedStation(station);
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const prediction = await smartAdvisorService.predictOptimalCharging(station.id, hour, day);
    setStationPrediction(prediction);
  };

  const demandChartData = [
    { hour: '00:00', demand: 20 },
    { hour: '03:00', demand: 15 },
    { hour: '06:00', demand: 45 },
    { hour: '09:00', demand: 85 },
    { hour: '12:00', demand: 60 },
    { hour: '15:00', demand: 50 },
    { hour: '18:00', demand: 95 },
    { hour: '21:00', demand: 70 },
    { hour: '24:00', demand: 30 }
  ];

  const pricingChartData = [
    { time: 'Midnight-6AM', price: 96, label: 'Off-Peak' },
    { time: '6AM-10AM', price: 156, label: 'Peak' },
    { time: '10AM-5PM', price: 120, label: 'Regular' },
    { time: '5PM-9PM', price: 156, label: 'Peak' },
    { time: '9PM-Midnight', price: 120, label: 'Regular' }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="h-12 w-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
            <HiLightningBolt className="mr-3 text-emerald-600 dark:text-emerald-500" />
            AI Smart Charging Advisor
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Get intelligent recommendations for optimal charging times and locations
          </p>
        </motion.div>

        {/* AI Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {recommendations?.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300 text-sm">{insight}</p>
            </motion.div>
          ))}
        </div>

        {/* Current Time & Best Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 shadow-lg text-white"
          >
            <HiClock className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Current Time</h3>
            <p className="text-3xl font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p className="mt-2 text-orange-100">
              {recommendations?.currentHour >= 18 && recommendations?.currentHour <= 21
                ? '⚠️ Peak demand period'
                : '✅ Good time to charge'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white"
          >
            <HiCheckCircle className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Recommended Time</h3>
            <p className="text-3xl font-bold">11:00 PM - 6:00 AM</p>
            <p className="mt-2 text-emerald-100">💰 Save up to 20% on charging costs</p>
          </motion.div>
        </div>

        {/* Demand Pattern Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <HiTrendingDown className="mr-2 text-emerald-600 dark:text-emerald-500" />
            24-Hour Demand Pattern
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demandChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="demand"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 5 }}
                activeDot={{ r: 7 }}
                name="Demand %"
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            🌙 Off-peak hours (11 PM - 6 AM) offer the lowest demand and best rates
          </p>
        </motion.div>

        {/* Pricing Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <HiCurrencyRupee className="mr-2 text-emerald-600 dark:text-emerald-500" />
            Dynamic Pricing by Time of Day
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pricingChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="price" fill="#10B981" name="Price (₹/hr)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recommended Stations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 Top Recommended Stations Now
          </h3>
          <div className="space-y-4">
            {recommendations?.recommendations.slice(0, 5).map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleStationSelect(station)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedStation?.id === station.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{station.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{station.address}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-medium">
                        Score: {station.score}/100
                      </span>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        {station.distance} km away
                      </span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                        ₹{Math.round(station.estimatedCost)}/hr
                      </span>
                      {!station.isPeakHour && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                          ✅ Off-Peak
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                      {station.availableChargers}/{station.totalChargers}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Station Prediction Details */}
        {stationPrediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white"
          >
            <h3 className="text-xl font-bold mb-4">🔮 AI Prediction for {stationPrediction.stationName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-purple-200 text-sm">Current Wait Time</p>
                <p className="text-3xl font-bold">{stationPrediction.currentWaitTime} min</p>
              </div>
              <div>
                <p className="text-purple-200 text-sm">Recommended Slot</p>
                <p className="text-3xl font-bold">{stationPrediction.recommendedSlot}</p>
              </div>
              <div>
                <p className="text-purple-200 text-sm">Potential Savings</p>
                <p className="text-3xl font-bold">₹{stationPrediction.savings}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {stationPrediction.insights.map((insight, index) => (
                <p key={index} className="text-purple-100 text-sm">{insight}</p>
              ))}
            </div>
            <p className="mt-4 text-purple-200 text-sm">
              Confidence: {stationPrediction.confidence}%
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SmartAdvisor;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { HiLightningBolt, HiTrendingUp, HiExclamation, HiCheckCircle } from 'react-icons/hi';
import { batteryHealthService } from '../../services/aiService';

const BatteryInsights = () => {
  const [batteryData, setBatteryData] = useState(null);
  const [tripDistance, setTripDistance] = useState(100);
  const [tripPrediction, setTripPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBatteryData();
  }, []);

  const loadBatteryData = async () => {
    setIsLoading(true);
    try {
      const data = await batteryHealthService.analyzeBatteryHealth();
      setBatteryData(data);
    } catch (error) {
      console.error('Error loading battery data:', error);
    }
    setIsLoading(false);
  };

  const handleTripCalculation = async () => {
    const prediction = await batteryHealthService.predictBatteryForTrip(tripDistance);
    setTripPrediction(prediction);
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600 dark:text-green-500';
    if (health >= 80) return 'text-blue-600 dark:text-blue-500';
    if (health >= 70) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-red-600 dark:text-red-500';
  };

  const getHealthBgColor = (health) => {
    if (health >= 90) return 'from-green-500 to-emerald-600';
    if (health >= 80) return 'from-blue-500 to-blue-600';
    if (health >= 70) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

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
            Battery Health Insights
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI-powered analysis of your EV battery performance and predictions
          </p>
        </motion.div>

        {/* Battery Health Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`bg-gradient-to-br ${getHealthBgColor(batteryData.currentHealth)} rounded-xl p-8 shadow-lg text-white mb-8`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-semibold mb-2">Overall Battery Health</p>
              <p className="text-6xl font-bold">{batteryData.currentHealth}%</p>
              <p className="text-2xl mt-2 opacity-90">{batteryData.status}</p>
            </div>
            <div className="text-right">
              <HiLightningBolt className="h-32 w-32 opacity-30" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-sm opacity-80">Capacity</p>
              <p className="text-2xl font-bold">{batteryData.usableCapacity} kWh</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Cycles</p>
              <p className="text-2xl font-bold">{batteryData.totalCycles}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Temperature</p>
              <p className="text-2xl font-bold">{batteryData.temperature}°C</p>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <HiLightningBolt className="mr-2 text-yellow-500" />
              Key Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Degradation Rate</span>
                <span className="font-bold text-gray-900 dark:text-white">{batteryData.degradationRate}% / year</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Expected Lifespan</span>
                <span className="font-bold text-gray-900 dark:text-white">{batteryData.expectedLifespan} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Remaining Life</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-500">{batteryData.remainingLifespan} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Voltage Status</span>
                <span className="font-bold text-green-600 dark:text-green-500">{batteryData.voltageStatus}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <HiCheckCircle className="mr-2 text-emerald-500" />
              Predictions
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Health in 1 Year</span>
                <span className="font-bold text-gray-900 dark:text-white">{batteryData.predictions.estimatedHealthIn1Year}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Health in 2 Years</span>
                <span className="font-bold text-gray-900 dark:text-white">{batteryData.predictions.estimatedHealthIn2Years}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Health in 3 Years</span>
                <span className="font-bold text-gray-900 dark:text-white">{batteryData.predictions.estimatedHealthIn3Years}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Next Maintenance</span>
                <span className="font-bold text-blue-600 dark:text-blue-500">{batteryData.predictions.nextMaintenanceDate}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Battery Health Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <HiTrendingUp className="mr-2 text-emerald-600 dark:text-emerald-500" />
            Battery Health Trend Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={batteryData.trends}>
              <defs>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[80, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="health"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#healthGradient)"
                name="Health %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Charging Cycles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Charging Cycles Progression
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={batteryData.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
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
                dataKey="cycles"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 5 }}
                name="Total Cycles"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <HiExclamation className="mr-2 text-amber-500" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            {batteryData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
              >
                <HiLightningBolt className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trip Battery Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white"
        >
          <h3 className="text-xl font-bold mb-4">🚗 Trip Battery Calculator</h3>
          <p className="mb-4 text-blue-100">Calculate battery requirements for your planned trip</p>
          
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Trip Distance (km)</label>
              <input
                type="number"
                value={tripDistance}
                onChange={(e) => setTripDistance(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Enter distance in km"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTripCalculation}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Calculate
            </motion.button>
          </div>

          {tripPrediction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 pt-6 border-t border-white/20"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-blue-200">Energy Needed</p>
                  <p className="text-2xl font-bold">{tripPrediction.actualEnergyNeeded} kWh</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Battery Required</p>
                  <p className="text-2xl font-bold">{tripPrediction.batteryPercentNeeded}%</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Can Complete?</p>
                  <p className="text-2xl font-bold">{tripPrediction.canComplete ? '✅ Yes' : '⚠️ No'}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200">Charging Stops</p>
                  <p className="text-2xl font-bold">{tripPrediction.recommendedChargingStops}</p>
                </div>
              </div>
              <div className="space-y-2">
                {tripPrediction.insights.map((insight, index) => (
                  <p key={index} className="text-sm text-blue-100">{insight}</p>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* AI Insights Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🤖 AI Analysis Summary</h3>
          <div className="space-y-3">
            {batteryData.aiInsights.map((insight, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                {insight}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BatteryInsights;

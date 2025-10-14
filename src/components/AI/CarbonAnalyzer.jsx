import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HiTrendingUp, HiSparkles, HiLightningBolt, HiBadgeCheck, HiRefresh } from 'react-icons/hi';
import { carbonAnalyzerService } from '../../services/aiService';

const CarbonAnalyzer = () => {
  const [carbonData, setCarbonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCarbonData();
  }, [selectedPeriod]);

  const loadCarbonData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await carbonAnalyzerService.calculateCarbonSavings(selectedPeriod);
      setCarbonData(data);
    } catch (error) {
      console.error('Error loading carbon data:', error);
      setError('Failed to load carbon footprint data');
    }
    setIsLoading(false);
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              rotate: { repeat: Infinity, duration: 2, ease: 'linear' },
              scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
            }}
            className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h3
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xl font-semibold text-gray-700 dark:text-gray-300"
          >
            Loading Carbon Analysis...
          </motion.h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Calculating your environmental impact</p>
        </motion.div>
      </div>
    );
  }

  if (error || !carbonData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Carbon Data Unavailable
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {error || 'Unable to load carbon footprint data at the moment.'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadCarbonData}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold flex items-center mx-auto"
          >
            <HiRefresh className="mr-2" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 dark:from-gray-900 dark:via-emerald-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Carbon Footprint Analyzer
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Track your environmental impact and celebrate your contribution to a greener planet
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-2 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
            {['week', 'month', 'year'].map((period) => (
              <motion.button
                key={period}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all duration-300 ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                {period}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Hero Stats with 3D Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
          style={{ perspective: '1000px' }}
        >
          <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl p-8 shadow-2xl text-white transform-gpu hover:scale-[1.02] transition-transform duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">♻️</div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  className="text-5xl font-bold mb-2"
                >
                  {carbonData.totalSaved} kg
                </motion.p>
                <p className="text-xl opacity-90">CO₂ Saved</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🌳</div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                  className="text-5xl font-bold mb-2"
                >
                  {carbonData.treesEquivalent}
                </motion.p>
                <p className="text-xl opacity-90">Trees Planted Equivalent</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">⚡</div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                  className="text-5xl font-bold mb-2"
                >
                  {carbonData.totalChargingSessions}
                </motion.p>
                <p className="text-xl opacity-90">Green Charging Sessions</p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 pt-6 border-t border-white/20 text-center"
            >
              <p className="text-lg backdrop-blur-sm bg-white/10 rounded-lg p-4">
                {carbonData.comparisonText}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Achievements with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl mb-8 border border-white/20 dark:border-gray-700/20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <HiBadgeCheck className="mr-3 text-emerald-600 dark:text-emerald-500" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {carbonData.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                className={`relative overflow-hidden rounded-xl p-6 text-center transform-gpu ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                <div className="text-5xl mb-3">{achievement.icon}</div>
                <h4 className="font-bold text-lg mb-2">{achievement.title}</h4>
                <p className="text-sm opacity-90">{achievement.description}</p>
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="absolute top-2 right-2"
                  >
                    <HiBadgeCheck className="h-6 w-6" />
                  </motion.div>
                )}
                {!achievement.unlocked && (
                  <div className="mt-3 text-xs">
                    Progress: {achievement.progress}%
                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mt-1 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                        className="bg-emerald-500 h-2 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Carbon Savings Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl mb-8 border border-white/20 dark:border-gray-700/20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <HiTrendingUp className="mr-3 text-emerald-600 dark:text-emerald-500" />
            CO₂ Savings Over Time
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={carbonData.trends}>
              <defs>
                <linearGradient id="carbonGradient3D" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                  <stop offset="30%" stopColor="#059669" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#047857" stopOpacity={0.1}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="period" 
                stroke="#10B981" 
                tick={{ fill: '#10B981', fontWeight: 'bold' }}
                tickLine={{ stroke: '#10B981', strokeWidth: 2 }}
                axisLine={{ stroke: '#10B981', strokeWidth: 2 }}
              />
              <YAxis 
                stroke="#10B981" 
                tick={{ fill: '#10B981', fontWeight: 'bold' }}
                tickLine={{ stroke: '#10B981', strokeWidth: 2 }}
                axisLine={{ stroke: '#10B981', strokeWidth: 2 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(16, 185, 129, 0.95)',
                  border: '2px solid #059669',
                  borderRadius: '12px',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.4)',
                  fontWeight: 'bold'
                }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="carbonSaved"
                stroke="#10B981"
                strokeWidth={5}
                fill="url(#carbonGradient3D)"
                name="CO₂ Saved (kg)"
                dot={{ 
                  fill: '#10B981', 
                  r: 8, 
                  strokeWidth: 3, 
                  stroke: '#fff',
                  filter: 'url(#glow)'
                }}
                activeDot={{ 
                  r: 12, 
                  stroke: '#10B981', 
                  strokeWidth: 4,
                  fill: '#fff',
                  filter: 'url(#glow)'
                }}
                filter="url(#glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Enhanced Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* EV vs Gasoline with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="mr-2">⚡</span>EV vs <span className="mr-2">🚗</span>Gasoline Car
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={carbonData.comparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="type" 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  stroke="#9CA3AF" 
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Bar 
                  dataKey="emissions" 
                  name="CO₂ Emissions (kg)" 
                  radius={[8, 8, 0, 0]}
                >
                  {carbonData.comparison.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3"
            >
              You're saving <span className="font-bold text-emerald-600 dark:text-emerald-500 text-lg">{carbonData.percentageSaved}%</span> in emissions!
            </motion.p>
          </motion.div>

          {/* Energy Source Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              🔋 Energy Source Mix
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={carbonData.energyMix}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={3}
                  stroke="#fff"
                >
                  {carbonData.energyMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {carbonData.energyMix.map((source, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center text-sm"
                >
                  <div
                    className="w-4 h-4 rounded-full mr-2 shadow-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{source.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Impact Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl mb-8 border border-white/20 dark:border-gray-700/20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📊 Environmental Impact Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {carbonData.impactMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 text-center shadow-lg"
              >
                <div className="text-4xl mb-3">{metric.icon}</div>
                <motion.p
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {metric.value}
                </motion.p>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{metric.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 shadow-2xl text-white mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <HiSparkles className="mr-3 text-yellow-300" />
            AI-Generated Sustainability Insights
          </h3>
          <div className="space-y-4">
            {carbonData.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="flex items-start space-x-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
              >
                <HiLightningBolt className="h-6 w-6 flex-shrink-0 mt-0.5 text-yellow-300" />
                <p className="text-sm leading-relaxed">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            🏆 Community Leaderboard
          </h3>
          <div className="space-y-4">
            {carbonData.leaderboard.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 ${
                  user.isYou
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-2xl border-2 border-emerald-300'
                    : 'bg-gray-50 dark:bg-gray-700 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-2xl font-bold flex items-center justify-center w-12 h-12 rounded-full ${
                    user.isYou ? 'bg-white/20' : 'bg-emerald-100 dark:bg-emerald-800'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div>
                    <p className={`font-bold text-lg ${user.isYou ? '' : 'text-gray-900 dark:text-white'}`}>
                      {user.name} {user.isYou && '(You)'}
                    </p>
                    <p className={`text-sm ${user.isYou ? 'opacity-90' : 'text-gray-600 dark:text-gray-400'}`}>
                      {user.carbonSaved} kg CO₂ saved
                    </p>
                  </div>
                </div>
                <div className={`text-3xl ${user.isYou ? '' : 'text-gray-600 dark:text-gray-400'}`}>
                  {user.badge}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CarbonAnalyzer;
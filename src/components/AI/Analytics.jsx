import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { HiTrendingUp, HiTrendingDown, HiChartBar, HiLightningBolt, HiUsers, HiCurrencyRupee, HiClock, HiLocationMarker, HiRefresh, HiStar, HiEye } from 'react-icons/hi';
import analyticsData from '../../data/mockAnalytics.json';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedCounters, setAnimatedCounters] = useState({});

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Transform the data for better visualization
      const transformedData = {
        ...analyticsData.analytics,
        aiSummary: `🚀 EVconnects Analytics Dashboard - ${timeRange.toUpperCase()} Overview\n\n` +
          `Our charging network is experiencing exceptional growth with ${analyticsData.analytics.overview.totalStations} stations ` +
          `generating ₹${(analyticsData.analytics.overview.totalRevenue / 100000).toFixed(1)}L in revenue. ` +
          `We're serving ${analyticsData.analytics.overview.activeUsers} active users with a ${analyticsData.analytics.overview.growthRate}% growth rate.\n\n` +
          `🏆 Top performer: ${analyticsData.analytics.topStations[0].name} leads with ${analyticsData.analytics.topStations[0].bookings} bookings ` +
          `and an impressive ${analyticsData.analytics.topStations[0].utilizationRate}% utilization rate.\n\n` +
          `⚡ Peak demand occurs during evening rush hours (6-9 PM), presenting opportunities for dynamic pricing strategies.`,
        
        // Enhanced data structures for better charts
        revenueTrend: analyticsData.analytics.monthlyRevenue.map(item => ({
          period: item.month,
          revenue: item.revenue / 1000, // Convert to thousands
          bookings: item.bookings,
          growth: Math.floor(Math.random() * 15) + 5 // Simulated growth percentage
        })),
        
        userSegments: [
          { name: 'Premium Users', value: 35, count: 1210 },
          { name: 'Regular Users', value: 45, count: 1555 },
          { name: 'New Users', value: 20, count: 691 }
        ],
        
        revenueBreakdown: [
          { source: 'Fast Charging', amount: 456780, percentage: 37 },
          { source: 'AC Charging', amount: 342560, percentage: 27 },
          { source: 'Premium Services', amount: 289430, percentage: 23 },
          { source: 'Subscriptions', amount: 156910, percentage: 13 }
        ],
        
        predictions: [
          {
            icon: '📈',
            title: 'Revenue Growth',
            value: `₹${(analyticsData.analytics.predictions.nextMonthRevenue / 1000).toFixed(0)}K`,
            description: 'Projected next month revenue'
          },
          {
            icon: '⚡',
            title: 'Demand Surge',
            value: '+27%',
            description: 'Expected peak hour increase'
          },
          {
            icon: '🎯',
            title: 'New Stations',
            value: '2-3',
            description: 'Recommended expansion count'
          }
        ],
        
        actionItems: [
          {
            icon: '⚡',
            title: 'Expand CCS Infrastructure',
            description: 'Highest demand charger type at 42% usage. Consider adding 5 more CCS ports.',
            priority: 'high',
            impact: 'High Revenue'
          },
          {
            icon: '💰',
            title: 'Implement Dynamic Pricing',
            description: 'Peak hours (6-9 PM) show 35% higher demand. Dynamic pricing could increase revenue by 15%.',
            priority: 'medium',
            impact: 'Revenue Growth'
          },
          {
            icon: '🌟',
            title: 'Replicate Best Practices',
            description: 'Fortum station has 4.6 rating. Implement their practices across all stations.',
            priority: 'medium',
            impact: 'Customer Satisfaction'
          },
          {
            icon: '📍',
            title: 'Hyderabad Expansion',
            description: 'AI recommends 2 new stations in Hyderabad tech corridor for optimal coverage.',
            priority: 'low',
            impact: 'Market Expansion'
          }
        ]
      };
      
      setData(transformedData);
      
      // Animate counters
      const counters = {
        revenue: 0,
        users: 0,
        bookings: 0,
        rating: 0
      };
      
      const intervals = [
        setInterval(() => {
          if (counters.revenue < transformedData.overview.totalRevenue) {
            counters.revenue += Math.ceil(transformedData.overview.totalRevenue / 100);
            setAnimatedCounters(prev => ({ ...prev, revenue: Math.min(counters.revenue, transformedData.overview.totalRevenue) }));
          }
        }, 20),
        
        setInterval(() => {
          if (counters.users < transformedData.overview.activeUsers) {
            counters.users += Math.ceil(transformedData.overview.activeUsers / 100);
            setAnimatedCounters(prev => ({ ...prev, users: Math.min(counters.users, transformedData.overview.activeUsers) }));
          }
        }, 25),
        
        setInterval(() => {
          if (counters.bookings < transformedData.overview.totalBookings) {
            counters.bookings += Math.ceil(transformedData.overview.totalBookings / 100);
            setAnimatedCounters(prev => ({ ...prev, bookings: Math.min(counters.bookings, transformedData.overview.totalBookings) }));
          }
        }, 15),
        
        setInterval(() => {
          if (counters.rating < transformedData.overview.averageRating * 100) {
            counters.rating += Math.ceil((transformedData.overview.averageRating * 100) / 100);
            setAnimatedCounters(prev => ({ ...prev, rating: Math.min(counters.rating, transformedData.overview.averageRating * 100) / 100 }));
          }
        }, 30)
      ];
      
      // Clear intervals after animation
      setTimeout(() => {
        intervals.forEach(interval => clearInterval(interval));
      }, 2000);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback data in case of error
      setData(analyticsData.analytics);
    }
    setIsLoading(false);
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
  const GRADIENT_COLORS = [
    'from-emerald-500 to-green-600',
    'from-blue-500 to-indigo-600', 
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-red-500 to-rose-600',
    'from-cyan-500 to-blue-600'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
            className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.h3
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-xl font-semibold text-gray-700 dark:text-gray-300"
          >
            Loading AI Analytics...
          </motion.h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Analyzing business insights</p>
        </motion.div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Analytics Unavailable
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Unable to load analytics data at the moment.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadAnalyticsData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold flex items-center mx-auto"
          >
            <HiRefresh className="mr-2" />
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Enhanced Header with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
                <div className="mr-4">
                  <HiChartBar className="text-blue-600 dark:text-blue-500" />
                </div>
                AI-Powered Business Analytics
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Comprehensive insights and predictions for EVconnects platform
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-2 rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20">
            {[
              { id: 'overview', name: 'Overview', icon: HiEye },
              { id: 'revenue', name: 'Revenue', icon: HiCurrencyRupee },
              { id: 'users', name: 'Users', icon: HiUsers },
              { id: 'stations', name: 'Stations', icon: HiLocationMarker }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Content Based on Active Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* AI Summary Card with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
                style={{ perspective: '1000px' }}
              >
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 shadow-2xl text-white transform-gpu hover:scale-[1.02] transition-transform duration-300">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 flex items-center">
                      <HiLightningBolt className="mr-3 text-yellow-300" />
                      AI Executive Summary
                    </h3>
                    <div className="text-lg leading-relaxed space-y-2">
                      {data.aiSummary.split('\n\n').map((paragraph, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.2 }}
                          className="backdrop-blur-sm bg-white/10 rounded-lg p-3"
                        >
                          {paragraph}
                        </motion.p>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Key Metrics Grid with 3D Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  {
                    title: 'Total Revenue',
                    value: animatedCounters.revenue || 0,
                    format: (val) => `₹${(val / 100000).toFixed(1)}L`,
                    icon: HiCurrencyRupee,
                    gradient: 'from-emerald-500 to-green-600',
                    growth: '+23.5%'
                  },
                  {
                    title: 'Active Users',
                    value: animatedCounters.users || 0,
                    format: (val) => val.toLocaleString(),
                    icon: HiUsers,
                    gradient: 'from-blue-500 to-indigo-600',
                    growth: '+18.2%'
                  },
                  {
                    title: 'Total Bookings',
                    value: animatedCounters.bookings || 0,
                    format: (val) => val.toLocaleString(),
                    icon: HiLightningBolt,
                    gradient: 'from-purple-500 to-pink-600',
                    growth: '+15.7%'
                  },
                  {
                    title: 'Avg Rating',
                    value: animatedCounters.rating || 0,
                    format: (val) => val.toFixed(1),
                    icon: HiStar,
                    gradient: 'from-amber-500 to-orange-600',
                    growth: '+0.3 pts'
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, rotateY: -30 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    className={`bg-gradient-to-br ${metric.gradient} rounded-2xl p-6 text-white shadow-2xl transform-gpu`}
                    style={{ perspective: '1000px' }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <metric.icon className="h-10 w-10 opacity-80" />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1"
                      >
                        <span className="text-xs font-bold">{metric.growth}</span>
                      </motion.div>
                    </div>
                    <p className="text-sm font-medium opacity-90 mb-2">{metric.title}</p>
                    <motion.p
                      key={metric.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-bold"
                    >
                      {metric.format(metric.value)}
                    </motion.p>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Revenue Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl mb-8 border border-white/20 dark:border-gray-700/20"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <HiTrendingUp className="mr-3 text-emerald-600 dark:text-emerald-500" />
                  Revenue & Growth Trend
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={data.revenueTrend}>
                    <defs>
                      <linearGradient id="revenueGradient3D" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="50%" stopColor="#059669" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#047857" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="bookingsGradient3D" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="50%" stopColor="#2563EB" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="period" 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#9CA3AF" 
                      tick={{ fill: '#6B7280' }}
                      tickLine={{ stroke: '#6B7280' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(31, 41, 55, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={3}
                      fill="url(#revenueGradient3D)"
                      name="Revenue (₹K)"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#bookingsGradient3D)"
                      name="Bookings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'revenue' && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Revenue-focused content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Distribution */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    💰 Revenue Distribution
                  </h3>
                  <div className="space-y-4">
                    {data.revenueBreakdown.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item.source}</span>
                          <span className="font-bold text-gray-900 dark:text-white">₹{(item.amount / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ delay: 0.2 * index, duration: 1, ease: 'easeOut' }}
                            className="h-3 rounded-full relative"
                            style={{ 
                              background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`
                            }}
                          >
                            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Top Stations Revenue */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <HiLocationMarker className="mr-2 text-emerald-600 dark:text-emerald-500" />
                    Top Revenue Stations
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topStations} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        type="number" 
                        stroke="#9CA3AF" 
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#9CA3AF" 
                        width={120}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
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
                        dataKey="revenue" 
                        name="Revenue (₹)"
                        radius={[0, 8, 8, 0]}
                      >
                        {data.topStations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* User-focused content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* User Segments Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    👥 User Segments
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.userSegments}
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
                        {data.userSegments.map((entry, index) => (
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
                </motion.div>

                {/* User Growth Metrics */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    � User Growth Metrics
                  </h3>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
                      <p className="text-sm opacity-90">New Users This Month</p>
                      <p className="text-3xl font-bold">+847</p>
                      <p className="text-sm">18.2% growth</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                      <p className="text-sm opacity-90">User Retention Rate</p>
                      <p className="text-3xl font-bold">89.5%</p>
                      <p className="text-sm">Above industry average</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
                      <p className="text-sm opacity-90">Active Sessions</p>
                      <p className="text-3xl font-bold">2,340</p>
                      <p className="text-sm">+12% from last week</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stations' && (
            <motion.div
              key="stations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Station-focused content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Performing Stations */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <HiLocationMarker className="mr-2 text-emerald-600 dark:text-emerald-500" />
                    Station Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topStations} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        type="number" 
                        stroke="#9CA3AF" 
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        stroke="#9CA3AF" 
                        width={120}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
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
                        dataKey="revenue" 
                        name="Revenue (₹)"
                        radius={[0, 8, 8, 0]}
                      >
                        {data.topStations.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Peak Hours */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 dark:border-gray-700/20"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <HiClock className="mr-2 text-blue-600 dark:text-blue-500" />
                    Peak Demand Hours
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.peakHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                      <XAxis 
                        dataKey="hour" 
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
                        dataKey="bookings" 
                        fill="#3B82F6" 
                        name="Bookings" 
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Station Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl mb-8 border border-white/20 dark:border-gray-700/20"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  🔌 Station Network Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="text-3xl mb-2">⚡</div>
                    <p className="text-3xl font-bold">6</p>
                    <p className="text-sm opacity-90">Active Stations</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                    <div className="text-3xl mb-2">🔋</div>
                    <p className="text-3xl font-bold">24</p>
                    <p className="text-sm opacity-90">Total Chargers</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-3xl font-bold">87%</p>
                    <p className="text-sm opacity-90">Avg Utilization</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-2xl p-8 shadow-2xl text-white mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <HiLightningBolt className="mr-3 text-yellow-300" />
            AI Predictions & Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.predictions.map((prediction, index) => (
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
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <div className="text-4xl mb-3">{prediction.icon}</div>
                <h4 className="font-bold text-lg mb-2">{prediction.title}</h4>
                <div className="text-2xl font-bold mb-2 text-yellow-300">{prediction.value}</div>
                <p className="text-sm opacity-90">{prediction.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            ✅ AI-Recommended Action Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.actionItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`p-6 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ${
                  item.priority === 'high'
                    ? 'bg-red-50/80 dark:bg-red-900/20 border-red-300 dark:border-red-600 hover:shadow-red-200 dark:hover:shadow-red-900/50'
                    : item.priority === 'medium'
                    ? 'bg-yellow-50/80 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-600 hover:shadow-yellow-200 dark:hover:shadow-yellow-900/50'
                    : 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 hover:shadow-blue-200 dark:hover:shadow-blue-900/50'
                } hover:shadow-lg`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.priority === 'high'
                          ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                          : item.priority === 'medium'
                          ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                          : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                      }`}>
                        {item.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {item.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

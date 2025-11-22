import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookingHistorySEO } from '../components/SEO';
import { HiCalendar, HiClock, HiLocationMarker, HiLightningBolt, HiCreditCard, HiCheckCircle, HiXCircle, HiSearch, HiDownload, HiEye, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Mock booking data - In production, this would come from API
const mockBookings = [
    {
      id: 1,
      stationName: "Tesla Supercharger - Downtown Mall",
      location: "123 Main Street, City Center",
      date: "2024-01-15",
      startTime: "14:30",
      endTime: "15:45",
      duration: "1h 15m",
      energyCharged: "45.2 kWh",
      cost: "$18.95",
      status: "completed",
      vehicleModel: "Tesla Model 3",
      chargingSpeed: "150 kW",
      paymentMethod: "Visa •••• 1234",
      sessionId: "CHG-001-240115-1430"
    },
    {
      id: 2,
      stationName: "EVgo Fast Charge - City Plaza",
      location: "456 Business Blvd, Financial District",
      date: "2024-01-10",
      startTime: "09:15",
      endTime: "10:30",
      duration: "1h 15m",
      energyCharged: "38.7 kWh",
      cost: "$22.45",
      status: "completed",
      vehicleModel: "Tesla Model 3",
      chargingSpeed: "100 kW",
      paymentMethod: "Visa •••• 1234",
      sessionId: "CHG-002-240110-0915"
    },
    {
      id: 3,
      stationName: "ChargePoint Express - Airport Hub",
      location: "789 Airport Road, Terminal 2",
      date: "2024-01-08",
      startTime: "16:00",
      endTime: "17:20",
      duration: "1h 20m",
      energyCharged: "42.1 kWh",
      cost: "$19.80",
      status: "completed",
      vehicleModel: "Tesla Model 3",
      chargingSpeed: "125 kW",
      paymentMethod: "Visa •••• 1234",
      sessionId: "CHG-003-240108-1600"
    },
    {
      id: 4,
      stationName: "Electrify America - Shopping Center",
      location: "321 Retail Ave, West Side",
      date: "2024-01-05",
      startTime: "11:45",
      endTime: "12:30",
      duration: "45m",
      energyCharged: "28.5 kWh",
      cost: "$15.20",
      status: "cancelled",
      vehicleModel: "Tesla Model 3",
      chargingSpeed: "75 kW",
      paymentMethod: "Visa •••• 1234",
      sessionId: "CHG-004-240105-1145"
    },
    {
      id: 5,
      stationName: "Tesla Supercharger - Highway Rest Stop",
      location: "654 Highway 101, Mile Marker 45",
      date: "2024-01-03",
      startTime: "13:20",
      endTime: "14:45",
      duration: "1h 25m",
      energyCharged: "52.3 kWh",
      cost: "$25.10",
      status: "completed",
      vehicleModel: "Tesla Model 3",
      chargingSpeed: "180 kW",
      paymentMethod: "Visa •••• 1234",
      sessionId: "CHG-005-240103-1320"
    }
  ];

const BookingHistory = () => {
  const { isDarkMode } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBookings(mockBookings);
      setFilteredBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          filterDate.setFullYear(1970);
      }
      
      filtered = filtered.filter(booking => new Date(booking.date) >= filterDate);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <HiCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <HiXCircle className="text-red-500" />;
      default:
        return <HiClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const calculateTotalStats = () => {
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalEnergy = completedBookings.reduce((sum, b) => sum + parseFloat(b.energyCharged), 0);
    const totalCost = completedBookings.reduce((sum, b) => sum + parseFloat(b.cost.replace('$', '')), 0);
    const totalSessions = completedBookings.length;

    return { totalEnergy, totalCost, totalSessions };
  };

  const stats = calculateTotalStats();

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleDownloadReceipt = (booking) => {
    // In a real app, this would generate and download a PDF receipt
    alert(`Receipt for session ${booking.sessionId} would be downloaded`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading booking history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
      <BookingHistorySEO />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Booking History
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            View and manage your charging session history
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                <HiLightningBolt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Energy</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalEnergy.toFixed(1)} kWh
                </p>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                <HiCreditCard className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${stats.totalCost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg mr-4">
                <HiCalendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sessions</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stats.totalSessions}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm mb-8`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <HiSearch className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search by station or session ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
                }`}
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>

            {/* Export Button */}
            <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <HiDownload className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredBookings.length === 0 ? (
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-sm text-center`}>
              <HiCalendar className={`h-12 w-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mx-auto mb-4`} />
              <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                No bookings found
              </p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Try adjusting your filters or make your first booking.
              </p>
            </div>
          ) : (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                  {/* Station Info */}
                  <div className="lg:col-span-2">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                      {booking.stationName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <HiLocationMarker className="h-4 w-4 mr-1" />
                      {booking.location}
                    </div>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Session: {booking.sessionId}
                    </p>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(booking.date)}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {booking.startTime} - {booking.endTime}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Duration: {booking.duration}
                    </p>
                  </div>

                  {/* Energy & Cost */}
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {booking.energyCharged}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {booking.cost}
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {booking.chargingSpeed}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                        ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                      title="View Details"
                    >
                      <HiEye className="h-5 w-5" />
                    </button>
                    {booking.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadReceipt(booking)}
                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                          ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                        title="Download Receipt"
                      >
                        <HiDownload className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Session Details
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  <HiX className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Station Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedBooking.stationName}</p>
                    <p><span className="font-medium">Location:</span> {selectedBooking.location}</p>
                    <p><span className="font-medium">Charging Speed:</span> {selectedBooking.chargingSpeed}</p>
                  </div>
                </div>

                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Session Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Date:</span> {formatDate(selectedBooking.date)}</p>
                    <p><span className="font-medium">Start Time:</span> {selectedBooking.startTime}</p>
                    <p><span className="font-medium">End Time:</span> {selectedBooking.endTime}</p>
                    <p><span className="font-medium">Duration:</span> {selectedBooking.duration}</p>
                  </div>
                </div>

                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Charging Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Energy Charged:</span> {selectedBooking.energyCharged}</p>
                    <p><span className="font-medium">Vehicle:</span> {selectedBooking.vehicleModel}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)}
                        <span className="ml-1 capitalize">{selectedBooking.status}</span>
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Payment Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Total Cost:</span> {selectedBooking.cost}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedBooking.paymentMethod}</p>
                    <p><span className="font-medium">Session ID:</span> {selectedBooking.sessionId}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.status === 'completed' && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleDownloadReceipt(selectedBooking)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <HiDownload className="h-5 w-5 mr-2" />
                    Download Receipt
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
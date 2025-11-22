import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiUsers, 
  HiLightningBolt, 
  HiLocationMarker, 
  HiCreditCard, 
  HiChartBar, 
  HiCog, 
  HiEye,
  HiPencil,
  HiTrash,
  HiPlus,
  HiSearch,
  HiDownload,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiFilter
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminPanel = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - In production, this would come from API
  const [stats] = useState({
    totalUsers: 1247,
    totalStations: 89,
    totalBookings: 3456,
    monthlyRevenue: 45780,
    activeUsers: 234,
    stationUtilization: 67
  });

  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      joinDate: '2024-01-15',
      totalBookings: 23,
      lastActivity: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'active',
      joinDate: '2024-01-10',
      totalBookings: 15,
      lastActivity: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      status: 'inactive',
      joinDate: '2024-01-05',
      totalBookings: 8,
      lastActivity: '1 week ago'
    }
  ]);

  const [stations] = useState([
    {
      id: 1,
      name: 'Tesla Supercharger - Downtown',
      location: '123 Main St, City Center',
      status: 'online',
      connectors: 8,
      availableConnectors: 3,
      utilization: 62,
      totalSessions: 1456,
      revenue: '$12,450'
    },
    {
      id: 2,
      name: 'EVgo Fast Charge - Mall',
      location: '456 Shopping Blvd',
      status: 'online',
      connectors: 6,
      availableConnectors: 6,
      utilization: 45,
      totalSessions: 892,
      revenue: '$8,920'
    },
    {
      id: 3,
      name: 'ChargePoint - Office Park',
      location: '789 Business Ave',
      status: 'maintenance',
      connectors: 4,
      availableConnectors: 0,
      utilization: 0,
      totalSessions: 234,
      revenue: '$2,340'
    }
  ]);

  const [recentBookings] = useState([
    {
      id: 1,
      user: 'John Doe',
      station: 'Tesla Supercharger - Downtown',
      date: '2024-01-15',
      duration: '1h 15m',
      energy: '45.2 kWh',
      cost: '$18.95',
      status: 'completed'
    },
    {
      id: 2,
      user: 'Jane Smith',
      station: 'EVgo Fast Charge - Mall',
      date: '2024-01-15',
      duration: '45m',
      energy: '28.5 kWh',
      cost: '$14.25',
      status: 'in-progress'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      station: 'ChargePoint - Office Park',
      date: '2024-01-14',
      duration: '30m',
      energy: '15.2 kWh',
      cost: '$8.50',
      status: 'cancelled'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'online':
      case 'completed':
        return <HiCheckCircle className="text-green-500" />;
      case 'inactive':
      case 'maintenance':
      case 'cancelled':
        return <HiXCircle className="text-red-500" />;
      case 'in-progress':
        return <HiClock className="text-yellow-500" />;
      default:
        return <HiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'online':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
      case 'maintenance':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: HiChartBar },
    { id: 'users', name: 'Users', icon: HiUsers },
    { id: 'stations', name: 'Stations', icon: HiLocationMarker },
    { id: 'bookings', name: 'Bookings', icon: HiLightningBolt },
    { id: 'revenue', name: 'Revenue', icon: HiCreditCard },
    { id: 'settings', name: 'Settings', icon: HiCog }
  ];

  const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
          {change && (
            <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
          <Icon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={HiUsers}
          change={12}
          changeType="positive"
        />
        <StatCard
          title="Total Stations"
          value={stats.totalStations}
          icon={HiLocationMarker}
          change={5}
          changeType="positive"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={HiLightningBolt}
          change={18}
          changeType="positive"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={HiCreditCard}
          change={23}
          changeType="positive"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={HiUsers}
          change={-3}
          changeType="negative"
        />
        <StatCard
          title="Station Utilization"
          value={`${stats.stationUtilization}%`}
          icon={HiChartBar}
          change={8}
          changeType="positive"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Bookings
          </h3>
          <div className="space-y-3">
            {recentBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-2">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {booking.user}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {booking.station}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {booking.cost}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1 capitalize">{booking.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Station Status */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Station Status
          </h3>
          <div className="space-y-3">
            {stations.map((station) => (
              <div key={station.id} className="flex items-center justify-between py-2">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {station.name}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {station.availableConnectors}/{station.connectors} available
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(station.status)}`}>
                  {getStatusIcon(station.status)}
                  <span className="ml-1 capitalize">{station.status}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Users Header */}
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          User Management
        </h2>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <HiDownload className="h-5 w-5 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <HiPlus className="h-5 w-5 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <HiSearch className={`absolute left-3 top-3 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search users..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
            </div>
            <button className={`p-2 border rounded-lg ${isDarkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              <HiFilter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  User
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Join Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Bookings
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Last Activity
                </th>
                <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {users.map((user) => (
                <tr key={user.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {user.joinDate}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {user.totalBookings}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className={`p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                        <HiEye className="h-4 w-4" />
                      </button>
                      <button className={`p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button className={`p-1 rounded ${isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-900' : 'text-red-600 hover:text-red-900 hover:bg-red-100'}`}>
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'stations':
        return <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Station management coming soon...</div>;
      case 'bookings':
        return <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Booking management coming soon...</div>;
      case 'revenue':
        return <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Revenue analytics coming soon...</div>;
      case 'settings':
        return <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System settings coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm min-h-screen`}>
          <div className="p-6">
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Panel
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Manage your EV network
            </p>
          </div>

          <nav className="px-6 pb-6">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                        ${activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                        }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
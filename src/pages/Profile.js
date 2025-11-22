import React, { useState } from 'react';
import { ProfileSEO } from '../components/SEO';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiLocationMarker, 
  HiCog,
  HiPencil,
  HiCamera,
  HiSave,
  HiShieldCheck,
  HiCreditCard,
  HiTruck
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    location: {
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      country: user?.location?.country || 'India'
    },
    preferences: {
      theme: user?.preferences?.theme || 'auto',
      notifications: {
        email: user?.preferences?.notifications?.email ?? true,
        sms: user?.preferences?.notifications?.sms ?? false,
        push: user?.preferences?.notifications?.push ?? true
      },
      language: user?.preferences?.language || 'en'
    },
    vehicleInfo: {
      make: user?.vehicleInfo?.make || '',
      model: user?.vehicleInfo?.model || '',
      year: user?.vehicleInfo?.year || new Date().getFullYear(),
      batteryCapacity: user?.vehicleInfo?.batteryCapacity || '',
      chargingType: user?.vehicleInfo?.chargingType || [],
      efficiency: user?.vehicleInfo?.efficiency || ''
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    title: '',
    message: ''
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiUser },
    { id: 'vehicle', label: 'Vehicle Info', icon: HiTruck },
    { id: 'preferences', label: 'Preferences', icon: HiCog },
    { id: 'security', label: 'Security', icon: HiShieldCheck },
    { id: 'billing', label: 'Billing', icon: HiCreditCard }
  ];

  const chargingTypes = [
    'Type 1 (J1772)',
    'Type 2 (Mennekes)', 
    'CCS (Combined Charging System)',
    'CHAdeMO',
    'Tesla Supercharger'
  ];

  const vehicleMakes = [
    'Tata', 'Mahindra', 'MG', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 
    'Audi', 'Tesla', 'Nissan', 'Renault', 'BYD', 'Ola Electric', 'Ather'
  ];

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleChargingTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      vehicleInfo: {
        ...prev.vehicleInfo,
        chargingType: prev.vehicleInfo.chargingType.includes(type)
          ? prev.vehicleInfo.chargingType.filter(t => t !== type)
          : [...prev.vehicleInfo.chargingType, type]
      }
    }));
  };

  const validateProfile = () => {
    if (!formData.firstName || formData.firstName.length < 2) {
      return 'First name must be at least 2 characters long';
    }
    
    if (!formData.lastName || formData.lastName.length < 2) {
      return 'Last name must be at least 2 characters long';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      return 'Please enter a valid phone number';
    }
    
    return null;
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      return 'Current password is required';
    }
    
    if (passwordData.newPassword.length < 8) {
      return 'New password must be at least 8 characters long';
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return 'Passwords do not match';
    }
    
    return null;
  };

  const handleSave = async () => {
    const validationError = validateProfile();
    if (validationError) {
      setNotification({
        isVisible: true,
        type: 'error',
        title: 'Validation Error',
        message: validationError
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user in context
      updateUser(formData);
      
      setNotification({
        isVisible: true,
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated!'
      });
      
      setIsEditing(false);
    } catch (error) {
      setNotification({
        isVisible: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const validationError = validatePassword();
    if (validationError) {
      setNotification({
        isVisible: true,
        type: 'error',
        title: 'Password Error',
        message: validationError
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        isVisible: true,
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been successfully updated!'
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    } catch (error) {
      setNotification({
        isVisible: true,
        type: 'error',
        title: 'Password Change Failed',
        message: 'Failed to change password. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center overflow-hidden">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <HiUser className="h-10 w-10 text-emerald-600" />
            )}
          </div>
          {isEditing && (
            <button className="absolute -bottom-1 -right-1 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
              <HiCamera className="h-3 w-3" />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {formData.firstName} {formData.lastName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formData.email}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange(null, 'firstName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange(null, 'lastName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <HiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(null, 'email', e.target.value)}
              disabled={!isEditing}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <HiPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
              disabled={!isEditing}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            City
          </label>
          <div className="relative">
            <HiLocationMarker className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) => handleInputChange('location', 'city', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your city"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            value={formData.location.state}
            onChange={(e) => handleInputChange('location', 'state', e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your state"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
          />
        </div>
      </div>
    </div>
  );

  const renderVehicleTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vehicle Make
          </label>
          <select
            value={formData.vehicleInfo.make}
            onChange={(e) => handleInputChange('vehicleInfo', 'make', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
          >
            <option value="">Select Make</option>
            {vehicleMakes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vehicle Model
          </label>
          <input
            type="text"
            value={formData.vehicleInfo.model}
            onChange={(e) => handleInputChange('vehicleInfo', 'model', e.target.value)}
            disabled={!isEditing}
            placeholder="e.g., Nexon EV, ZS EV"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Year
          </label>
          <input
            type="number"
            value={formData.vehicleInfo.year}
            onChange={(e) => handleInputChange('vehicleInfo', 'year', parseInt(e.target.value))}
            disabled={!isEditing}
            min="2010"
            max={new Date().getFullYear() + 1}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Battery Capacity (kWh)
          </label>
          <input
            type="number"
            value={formData.vehicleInfo.batteryCapacity}
            onChange={(e) => handleInputChange('vehicleInfo', 'batteryCapacity', parseFloat(e.target.value))}
            disabled={!isEditing}
            placeholder="e.g., 30.2, 50.3"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Efficiency (km/kWh)
          </label>
          <input
            type="number"
            value={formData.vehicleInfo.efficiency}
            onChange={(e) => handleInputChange('vehicleInfo', 'efficiency', parseFloat(e.target.value))}
            disabled={!isEditing}
            placeholder="e.g., 4.5, 6.2"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Supported Charging Types
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {chargingTypes.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.vehicleInfo.chargingType.includes(type)}
                onChange={() => handleChargingTypeToggle(type)}
                disabled={!isEditing}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
              />
              <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <ProfileSEO />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h1>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <HiSave className="mr-2 h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <HiPencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'vehicle' && renderVehicleTab()}
          {/* Add other tabs as needed */}
        </div>
      </div>

      {/* Notification */}
      <Notification
        isVisible={notification.isVisible}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default Profile;
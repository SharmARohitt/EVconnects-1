import React, { useState } from 'react';
import { HiMenu, HiX, HiUserCircle, HiLogout, HiShoppingCart } from 'react-icons/hi';
import { BsSunFill, BsMoonStarsFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import mainLogo from '../assets/Mainlogo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    // No need for explicit navigation as the UI will update based on auth state
  };

  // Helper to get vehicle display text
  const getVehicleText = () => {
    if (!user || !user.vehicleInfo) return '';
    
    const { type, brand } = user.vehicleInfo;
    let vehicleType = type;
    
    if (type === 'car') vehicleType = '4 Wheeler';
    if (type === 'motorcycle') vehicleType = '2 Wheeler';
    
    return `${brand} ${vehicleType}`;
  };

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo - Left aligned */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={mainLogo} 
                alt="EVConnects Logo" 
                className="h-10 w-auto mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = process.env.PUBLIC_URL + '/Mainlogo.png';
                }}
              />
              <span className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                EVConnects
              </span>
            </Link>
          </div>
          
          {/* Navigation Menu - Center aligned (hidden on mobile) */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">Home</Link>
              <button 
                onClick={() => scrollToSection('about')}
                className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium bg-transparent transition-colors"
              >
                About
              </button>
              <Link to="/services" className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">Services</Link>
              
              {/* AI Features Dropdown */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsAIMenuOpen(!isAIMenuOpen)}
                    className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium bg-transparent transition-colors flex items-center"
                  >
                    🤖 AI Features
                    <svg className={`ml-1 h-4 w-4 transition-transform ${isAIMenuOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isAIMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <Link 
                        to="/smart-advisor" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        onClick={() => setIsAIMenuOpen(false)}
                      >
                        ⚡ Smart Charging Advisor
                      </Link>
                      <Link 
                        to="/battery-health" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        onClick={() => setIsAIMenuOpen(false)}
                      >
                        🔋 Battery Health Insights
                      </Link>
                      <Link 
                        to="/route-optimizer" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        onClick={() => setIsAIMenuOpen(false)}
                      >
                        🗺️ Route Optimizer
                      </Link>
                      <Link 
                        to="/carbon-footprint" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        onClick={() => setIsAIMenuOpen(false)}
                      >
                        🌍 Carbon Footprint
                      </Link>
                      <Link 
                        to="/admin/analytics" 
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        onClick={() => setIsAIMenuOpen(false)}
                      >
                        📊 Analytics Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Right side icons - Theme Toggle, Cart and Login/User */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <BsMoonStarsFill className="h-5 w-5 text-gray-700 hover:text-emerald-600 transition-colors" />
              ) : (
                <BsSunFill className="h-5 w-5 text-yellow-400 hover:text-yellow-500 transition-colors" />
              )}
            </button>
            
            <Link 
              to="/services" 
              className="p-1 rounded-full text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-gray-700 focus:outline-none transition-colors"
              aria-label="View services"
            >
              <HiShoppingCart className="h-7 w-7" />
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                    {user.firstName || 'User'}
                  </span>
                  {user.vehicleInfo && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getVehicleText()}
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  <HiLogout className="mr-2 h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <HiUserCircle className="mr-2 h-5 w-5" />
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center ml-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">{isMenuOpen ? 'Close main menu' : 'Open main menu'}</span>
              {isMenuOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
            <button 
              onClick={() => {
                scrollToSection('about');
                setIsMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 bg-transparent transition-colors"
            >
              About
            </button>
            <Link 
              to="/services" 
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            
            {/* AI Features Mobile Menu */}
            {user && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  🤖 AI Features
                </div>
                <Link 
                  to="/smart-advisor" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ⚡ Smart Charging
                </Link>
                <Link 
                  to="/battery-health" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔋 Battery Health
                </Link>
                <Link 
                  to="/route-optimizer" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🗺️ Route Optimizer
                </Link>
                <Link 
                  to="/carbon-footprint" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🌍 Carbon Footprint
                </Link>
                <Link 
                  to="/admin/analytics" 
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📊 Analytics
                </Link>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              </>
            )}
            
            {user ? (
              <>
                <div className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  Welcome, {user.firstName || 'User'}
                </div>
                {user.vehicleInfo && (
                  <div className="block px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    Vehicle: {getVehicleText()}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
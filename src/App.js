import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import BookingHistory from './pages/BookingHistory';
import AdminPanel from './pages/AdminPanel';
import StationSearch from './pages/StationSearch';
import VehicleSelection from './pages/VehicleSelection';
import Services from './pages/Services';
import AIChatbot from './components/AI/AIChatbot';
import SmartAdvisor from './components/AI/SmartAdvisor';
import BatteryInsights from './components/AI/BatteryInsights';
import RouteOptimizer from './components/AI/RouteOptimizer';
import CarbonAnalyzer from './components/AI/CarbonAnalyzer';
import Analytics from './components/AI/Analytics';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Protected route component to check if user has vehicle info
const RequireVehicleInfo = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>;
  }
  
  // If user is logged in but no vehicle info, redirect to vehicle selection
  if (user && !user.vehicleInfo) {
    return <Navigate to="/vehicle-selection" replace />;
  }
  
  // If not logged in, children will handle the redirect to login
  return children;
};

// Protected route component for authenticated users
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/vehicle-selection" element={
        <RequireAuth>
          <VehicleSelection />
        </RequireAuth>
      } />
      <Route path="/" element={
        <RequireAuth>
          <RequireVehicleInfo>
            <Home />
          </RequireVehicleInfo>
        </RequireAuth>
      } />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/stations" element={<StationSearch />} />
      <Route path="/profile" element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      } />
      <Route path="/bookings" element={
        <RequireAuth>
          <BookingHistory />
        </RequireAuth>
      } />
      <Route path="/admin" element={
        <RequireAuth>
          <AdminPanel />
        </RequireAuth>
      } />
      <Route path="/services" element={<Services />} />
      
      {/* AI Component Routes */}
      <Route path="/ai-chat" element={
        <RequireAuth>
          <AIChatbot />
        </RequireAuth>
      } />
      <Route path="/smart-advisor" element={
        <RequireAuth>
          <SmartAdvisor />
        </RequireAuth>
      } />
      <Route path="/battery-health" element={
        <RequireAuth>
          <BatteryInsights />
        </RequireAuth>
      } />
      <Route path="/route-optimizer" element={
        <RequireAuth>
          <RouteOptimizer />
        </RequireAuth>
      } />
      <Route path="/carbon-footprint" element={
        <RequireAuth>
          <CarbonAnalyzer />
        </RequireAuth>
      } />
      <Route path="/admin/analytics" element={
        <RequireAuth>
          <Analytics />
        </RequireAuth>
      } />
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              
              <main className="flex-grow">
                <AppRoutes />
              </main>
              
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;

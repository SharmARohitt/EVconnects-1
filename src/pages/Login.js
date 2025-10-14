import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiLockClosed, HiMail, HiUserCircle, HiUser } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Notification from '../components/Notification';
import { sendWelcomeEmail } from '../services/emailService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [notification, setNotification] = useState({
    isVisible: false,
    type: 'success',
    title: '',
    message: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password || !firstName || !lastName) {
      setError('Please enter all required fields');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Normally this would be a real API call
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any valid-looking email with password longer than 6 chars
      if (email.includes('@') && password.length >= 6) {
        // Create user object
        const userData = { email, firstName, lastName };
        
        // Use the login function from context
        login(userData);
        
        // Set email sending state
        setIsSendingEmail(true);
        
        try {
          // Send welcome email
          const emailResult = await sendWelcomeEmail(userData);
          
          console.log('Email sending result:', emailResult);
          
          // Show success notification
          setNotification({
            isVisible: true,
            type: 'success',
            title: 'Welcome to EVConnect!',
            message: `We've sent a welcome email to ${email}`
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          
          // Show error notification but don't block login flow
          setNotification({
            isVisible: true,
            type: 'warning',
            title: 'Welcome Email Issue',
            message: `We couldn't send a welcome email to ${email}. You can continue using the app.`
          });
        } finally {
          setIsSendingEmail(false);
        }
        
        // Redirect to home page after successful login
        navigate('/');
      } else {
        setError('Invalid email or password. Try demo@example.com / password123');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Close notification handler
  const handleCloseNotification = () => {
    setNotification({ ...notification, isVisible: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <HiUserCircle className="h-16 w-16 text-emerald-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w">
          Or{' '}
          <Link to="#" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/50 border-l-4 border-red-400 dark:border-red-700 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Name field */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="John"
                />
              </div>
            </div>

            {/* Last Name field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || isSendingEmail}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : (isSendingEmail ? 'Sending welcome email...' : 'Sign in')}
              </button>
            </div>
            
            {/* Demo credentials hint */}
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>For demo: use email "demo@example.com" and password "password123"</p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Notification component */}
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

export default Login;
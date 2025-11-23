import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiLocationMarker, HiCheck, HiX, HiClock, HiCurrencyRupee, HiStar } from 'react-icons/hi';
import { HiLightningBolt, HiCalendar, HiXCircle, HiPhone, HiCreditCard, HiCheckCircle, HiTicket } from 'react-icons/hi';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise, calculatePrice } from '../services/stripeService';
import PaymentForm from './PaymentForm';

const StationCard = ({ station }) => {
  const { 
    name, 
    address, 
    distance, 
    isAvailable, 
    chargerTypes, 
    rating, 
    totalChargers, 
    availableChargers, 
    pricing,
    amenities,
    powerOutput,
    demandLevel
  } = station;
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedChargerType, setSelectedChargerType] = useState(chargerTypes[0]);
  const [bookingHours, setBookingHours] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState({
    success: false,
    error: null,
    processing: false
  });
  const [showSuccessSplash, setShowSuccessSplash] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Get pricing for each charger type from station data
  const getPricing = (chargerType) => {
    const price = pricing && pricing[chargerType] ? pricing[chargerType] : {
      'CCS': 120,
      'CHAdeMO': 150,
      'Type 2 AC': 80,
      'Type 2': 80
    }[chargerType] || 100;
    
    return `₹${price}/hr`;
  };

  // Additional station details for the modal
  const stationDetails = {
    openingHours: '24 hours',
    contactNumber: '+91 ' + Math.floor(7000000000 + Math.random() * 999999999),
    amenities: ['Restrooms', 'Cafe', 'Wi-Fi', 'Parking'],
    paymentMethods: ['Credit Card', 'Debit Card', 'UPI', 'Cash']
  };

  const handlePayment = () => {
    setShowModal(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentDetails = {}) => {
    // Generate booking confirmation details
    const booking = {
      bookingId: 'EVC' + Date.now().toString().slice(-6),
      stationName: name,
      chargerType: selectedChargerType,
      duration: bookingHours,
      amount: calculatePrice(selectedChargerType, bookingHours),
      paymentId: paymentDetails.transactionId || 'PAY' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      bookingTime: new Date().toLocaleString(),
      estimatedStartTime: new Date(Date.now() + 15 * 60000).toLocaleString(), // 15 minutes from now
      address: address
    };
    
    setBookingDetails(booking);
    setPaymentStatus({
      success: true,
      error: null,
      processing: false
    });
    
    // Show splash screen after a brief delay
    setTimeout(() => {
      setShowPaymentModal(false);
      setShowSuccessSplash(true);
      
      // Auto-close splash screen after 4 seconds
      setTimeout(() => {
        setShowSuccessSplash(false);
        // Reset states
        setPaymentStatus({ success: false, error: null, processing: false });
        setBookingDetails(null);
      }, 4000);
    }, 1000);
  };

  const handlePaymentError = (errorMessage) => {
    setPaymentStatus({
      success: false,
      error: errorMessage || 'Payment failed. Please try again.',
      processing: false
    });
  };

  // Calculate total price
  const totalPrice = calculatePrice(selectedChargerType, bookingHours);

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-emerald-900/50 transition-all duration-300 overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
              {rating && (
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                    {rating} ({Math.floor(Math.random() * 200) + 50} reviews)
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isAvailable ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700' : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
              }`}>
                {isAvailable ? (
                  <>
                    <HiCheck className="mr-1 h-3 w-3" /> Available
                  </>
                ) : (
                  <>
                    <HiX className="mr-1 h-3 w-3" /> Occupied
                  </>
                )}
              </span>
              {totalChargers && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {availableChargers || 0}/{totalChargers} free
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex items-start text-gray-600 dark:text-gray-300">
            <HiLocationMarker className="mt-0.5 mr-2 flex-shrink-0 h-4 w-4 text-emerald-600 dark:text-emerald-500" />
            <span className="text-sm">{address}</span>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <span className="font-medium">Distance:</span>
              <span className="ml-1">{distance} km away</span>
            </div>
            {demandLevel && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                demandLevel === 'low' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                demandLevel === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300'
              }`}>
                {demandLevel} demand
              </span>
            )}
          </div>
          
          {powerOutput && (
            <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
              <HiLightningBolt className="mr-1 h-4 w-4 text-emerald-600 dark:text-emerald-500" />
              <span className="font-medium">Max Power:</span>
              <span className="ml-1">{powerOutput}</span>
            </div>
          )}
            
            <div className="mt-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Charger Types:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {chargerTypes.map((type, index) => {
                  const price = pricing && pricing[type] ? `₹${pricing[type]}/hr` : getPricing(type);
                  return (
                    <div key={index} className="flex flex-col">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <HiLightningBolt className="mr-1 h-3 w-3" />
                        {type}
                      </span>
                      <span className="text-xs text-center mt-1 text-gray-500 dark:text-gray-400">
                        {price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {amenities && amenities.length > 0 && (
              <div className="mt-3">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Amenities:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {amenities.slice(0, 4).map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {amenity}
                    </span>
                  ))}
                  {amenities.length > 4 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{amenities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          
          <div className="mt-4">
            <button
              onClick={() => setShowModal(true)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              aria-label={`Book now at ${name}`}
            >
              <HiCalendar className="mr-2 h-5 w-5" />
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-75"
              aria-hidden="true"
              onClick={() => setShowModal(false)}
            ></div>
            
            {/* Modal content */}
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
              <div className="relative px-4 pt-5 pb-4 sm:p-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none transition-colors"
                >
                  <HiXCircle className="w-6 h-6" />
                </button>
                
                <div>
                  <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-2xl font-bold leading-6 text-emerald-600 dark:text-emerald-400 mb-6">
                      {name}
                    </h3>
                    
                    <div className="mt-2 text-gray-700 dark:text-gray-200">
                      <div className="flex items-start mb-4">
                        <HiLocationMarker className="mt-0.5 mr-3 flex-shrink-0 h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                        <span>{address}</span>
                      </div>
                      
                      <div className="flex items-start mb-4">
                        <HiClock className="mt-0.5 mr-3 flex-shrink-0 h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                        <span>Hours: {stationDetails.openingHours}</span>
                      </div>
                      
                      <div className="flex items-start mb-4">
                        <HiPhone className="mt-0.5 mr-3 flex-shrink-0 h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                        <span>Contact: {stationDetails.contactNumber}</span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">Pricing</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                          <table className="w-full text-gray-700 dark:text-gray-200">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="py-2 text-left">Charger Type</th>
                                <th className="py-2 text-right">Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {chargerTypes.map((type, index) => (
                                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                  <td className="py-2 flex items-center">
                                    <HiLightningBolt className="mr-2 text-emerald-600 dark:text-emerald-500" />
                                    {type}
                                  </td>
                                  <td className="py-2 text-right flex items-center justify-end">
                                    <HiCurrencyRupee className="text-emerald-600 dark:text-emerald-500 mr-1" />
                                    {getPricing(type)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {stationDetails.amenities.map((amenity, index) => (
                            <span key={index} className="px-3 py-1 text-sm bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">Payment Methods</h4>
                        <div className="flex flex-wrap gap-2">
                          {stationDetails.paymentMethods.map((method, index) => (
                            <span key={index} className="px-3 py-1 text-sm flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-600">
                              <HiCreditCard className="mr-1 text-emerald-600 dark:text-emerald-500" />
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 sm:mt-6 flex gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 dark:bg-emerald-700 border border-transparent rounded-md hover:bg-emerald-700 dark:hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                    onClick={handlePayment}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-black bg-opacity-75 dark:bg-opacity-75"
              aria-hidden="true"
              onClick={() => !paymentStatus.processing && setShowPaymentModal(false)}
            ></div>
            
            {/* Modal content */}
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white dark:bg-gray-800 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
              <div className="relative px-4 pt-5 pb-4 sm:p-6">
                <button
                  onClick={() => !paymentStatus.processing && setShowPaymentModal(false)}
                  className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none transition-colors"
                  disabled={paymentStatus.processing}
                >
                  <HiXCircle className="w-6 h-6" />
                </button>
                
                <div>
                  <h3 className="text-2xl font-bold leading-6 text-emerald-600 dark:text-emerald-400 mb-6">
                    Payment for {name}
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
                      <span>Charger Type:</span>
                      <span>{selectedChargerType}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
                      <span>Duration:</span>
                      <span>{bookingHours} hour{bookingHours > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-900 dark:text-white mb-2 text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      Enter Card Details
                    </h4>
                  </div>
                  
                  {paymentStatus.success ? (
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 p-4 rounded-md border border-emerald-200 dark:border-emerald-700">
                      <div className="flex items-center">
                        <HiCheck className="h-6 w-6 mr-2" />
                        <span>Payment successful! Processing your booking...</span>
                      </div>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise}>
                      <PaymentForm 
                        amount={totalPrice}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                        onCancel={() => setShowPaymentModal(false)}
                      />
                    </Elements>
                  )}
                  
                  {paymentStatus.error && (
                    <div className="mt-4 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 p-3 rounded-md border border-red-200 dark:border-red-700">
                      <div className="flex items-center">
                        <HiX className="h-5 w-5 mr-2" />
                        <span>{paymentStatus.error}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Splash Screen */}
      <AnimatePresence>
        {showSuccessSplash && bookingDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 120,
                duration: 0.6
              }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
            >
              {/* Success Animation Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-green-500/10"></div>
              
              {/* Confetti Animation */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                    initial={{
                      x: Math.random() * 400 - 200,
                      y: -10,
                      rotate: 0,
                      opacity: 0.8
                    }}
                    animate={{
                      y: 400,
                      rotate: 360,
                      opacity: 0
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  className="mb-6"
                >
                  <div className="mx-auto w-20 h-20 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <HiCheckCircle className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Your charging slot has been booked
                  </p>
                </motion.div>

                {/* Booking Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700 text-left"
                >
                  <div className="flex items-center mb-3">
                    <HiTicket className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">Booking Confirmation</span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
                      <span className="font-mono text-emerald-700 dark:text-emerald-300">{bookingDetails.bookingId}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Station:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-right max-w-[60%] truncate">
                        {bookingDetails.stationName}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Charger Type:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{bookingDetails.chargerType}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{bookingDetails.duration}h</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-300">₹{bookingDetails.amount}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment ID:</span>
                      <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{bookingDetails.paymentId}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center">
                      <HiClock className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                      <div className="text-xs">
                        <div className="text-blue-800 dark:text-blue-300 font-medium">
                          Estimated Start Time
                        </div>
                        <div className="text-blue-600 dark:text-blue-400">
                          {bookingDetails.estimatedStartTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 space-y-3"
                >
                  <button
                    onClick={() => setShowSuccessSplash(false)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    Continue
                  </button>
                  
                  <button
                    onClick={() => {
                      // Generate booking receipt
                      const receiptText = `
EV CHARGING BOOKING RECEIPT
==========================
Booking ID: ${bookingDetails.bookingId}
Station: ${bookingDetails.stationName}
Address: ${bookingDetails.address}
Charger Type: ${bookingDetails.chargerType}
Duration: ${bookingDetails.duration} hour(s)
Amount Paid: ₹${bookingDetails.amount}
Payment ID: ${bookingDetails.paymentId}
Booking Time: ${bookingDetails.bookingTime}
Estimated Start: ${bookingDetails.estimatedStartTime}

Thank you for choosing EVconnects!
                      `.trim();
                      
                      navigator.clipboard.writeText(receiptText).then(() => {
                        const notification = document.createElement('div');
                        notification.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm z-[70]';
                        notification.textContent = 'Receipt copied to clipboard!';
                        document.body.appendChild(notification);
                        setTimeout(() => {
                          if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                          }
                        }, 2000);
                      });
                    }}
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Copy Receipt
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationCard;
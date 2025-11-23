import React, { useState } from 'react';
import { HiLocationMarker, HiCheck, HiX, HiClock, HiCurrencyRupee, HiStar } from 'react-icons/hi';
import { HiLightningBolt, HiCalendar, HiXCircle, HiPhone, HiCreditCard } from 'react-icons/hi';
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

  const handlePaymentSuccess = () => {
    setPaymentStatus({
      success: true,
      error: null,
      processing: false
    });
    
    setTimeout(() => {
      setShowPaymentModal(false);
      alert('Payment successful! Your slot has been booked.');
    }, 1500);
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
    </div>
  );
};

export default StationCard;
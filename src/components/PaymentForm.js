import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const cardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  },
  hidePostalCode: true
};

const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe hasn't loaded yet. Please try again.");
      setProcessing(false);
      return;
    }

    // In a real implementation, you would create a payment intent on your server
    // and return the client secret. Here we're mocking it for demo purposes.
    try {
      // Mock a successful payment with transaction details
      setTimeout(() => {
        const paymentDetails = {
          transactionId: 'TXN' + Date.now().toString().slice(-8),
          paymentMethod: 'Card',
          status: 'completed',
          timestamp: new Date().toISOString(),
          amount: amount
        };
        
        setProcessing(false);
        onPaymentSuccess(paymentDetails);
      }, 2000);
      
      // In a real implementation, you would use the client secret like this:
      /*
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
        onPaymentError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
      */
    } catch (err) {
      setError(err.message);
      onPaymentError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block text-dark-text mb-2 text-sm font-medium">
          Card Details
        </label>
        <div className="border border-dark-border rounded-md p-3 bg-dark-secondary">
          <CardElement options={cardElementOptions} />
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/50 text-red-300 p-3 rounded-md border border-red-700 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-dark-text bg-dark-accent border border-dark-border rounded-md hover:bg-dark-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 border border-transparent rounded-md hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay ₹${amount}`
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
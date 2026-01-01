'use client';
import { useState } from 'react';

const PricingForm = ({ plan, price, billingCycle, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    paymentMethod: 'credit-card',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email required';
    
    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        newErrors.cardNumber = 'Valid card number required';
      }
      if (!formData.expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
        newErrors.expiry = 'MM/YY format required';
      }
      if (!formData.cvc.match(/^\d{3,4}$/)) {
        newErrors.cvc = '3-4 digit CVC required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '');
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g'))?.join(' ') || '';
    }
    setFormData(prev => ({ ...prev, cardNumber: value }));
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value;
    if (value.length === 2 && !value.includes('/')) {
      value = value + '/';
    }
    setFormData(prev => ({ ...prev, expiry: value }));
    if (errors.expiry) setErrors(prev => ({ ...prev, expiry: '' }));
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">
            You've subscribed to {plan} ({billingCycle})
          </p>
          <p className="text-lg font-semibold">
            {price}/{billingCycle === 'yearly' ? 'year' : 'month'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Upgrade to {plan}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-lg font-semibold mb-6 text-primary">
          {price}/{billingCycle === 'yearly' ? 'year' : 'month'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* Credit Card Fields (Conditional) */}
          {formData.paymentMethod === 'credit-card' && (
            <div className="space-y-3">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleExpiryChange}
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.expiry ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.expiry && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    value={formData.cvc}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData(prev => ({ ...prev, cvc: value }));
                      if (errors.cvc) setErrors(prev => ({ ...prev, cvc: '' }));
                    }}
                    maxLength={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                      errors.cvc ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.cvc && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 bg-primary text-white font-medium rounded-lg transition-colors ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-dark'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Complete Payment - ${price}/${billingCycle === 'yearly' ? 'year' : 'month'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PricingForm;
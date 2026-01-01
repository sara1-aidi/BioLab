'use client';
import { useState } from 'react';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const plans = [
    {
      id: 'basic-1',
      name: "Normal",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: ["1 scans/month", "Basic support", "Email reports"],
      highlight: false,
    },
    {
      id: 'pro',
      name: "Pro",
      monthlyPrice: 10,
      yearlyPrice: 96,
      features: ["Unlimited scans", "Priority support", "Advanced analytics"],
      highlight: true,
    },
    {
      id: 'premium',
      name: "Premium",
      monthlyPrice: 25,
      yearlyPrice: 240,
      features: ["Unlimited scans", "24/7 priority support", "Advanced analytics", "Export PDF/CSV"],
      highlight: false,
    }
  ];

  const validateForm = () => {
    const newErrors = {};
    const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
    
    if (!/^\d{16}$/.test(cardNumber)) newErrors.cardNumber = 'Valid card number required';
    if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(paymentInfo.expiry)) newErrors.expiry = 'MM/YY format required';
    if (!/^\d{3,4}$/.test(paymentInfo.cvc)) newErrors.cvc = '3-4 digit CVC required';
    if (!paymentInfo.name.trim()) newErrors.name = 'Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setSelectedPlan(null);
      setIsSuccess(false);
      setPaymentInfo({ cardNumber: '', expiry: '', cvc: '', name: '' });
    }, 3000);
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
  };

  const formatExpiry = (value) => {
    return value
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{2})(\d{0,2})/, '$1/$2')
      .substring(0, 5);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-[var(--text-blue-dark)] mb-2">Choose Your Plan</h2>
        <p className="text-lg text-[var(--text-blue-medium)] max-w-2xl mx-auto">
          Select the perfect plan for your needs. Get started today and unlock powerful features.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex bg-[var(--pastel-blue-medium)] p-1 rounded-full">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-white shadow-sm text-[var(--text-blue-medium)]' 
                : 'text-[var(--text-blue-dark)] hover:text-[var(--text-blue-medium)]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full transition-colors ${
              billingCycle === 'yearly' 
                ? 'bg-white shadow-sm text-[var(--text-blue-medium)]' 
                : 'text-[var(--text-blue-dark)] hover:text-[var(--text-blue-medium)]'
            }`}
          >
            Yearly (Save 20%)
          </button>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const isNormalPlan = plan.id === 'basic-1';
          
          return (
            <div 
              key={plan.id} 
              className={`border rounded-xl p-6 transition-all hover:shadow-lg ${
                plan.highlight 
                  ? 'border-[var(--text-blue-medium)] ring-2 ring-[var(--text-blue-medium)] shadow-lg transform hover:-translate-y-1' 
                  : 'border-[var(--pastel-blue-dark)] hover:border-[var(--text-blue-medium)]'
              }`}
            >
              {plan.highlight && (
                <div className="bg-[var(--pastel-green-medium)] text-[var(--text-blue-dark)] text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className="font-bold text-2xl mb-2 text-[var(--text-blue-dark)]">{plan.name}</h3>
              <p className="text-4xl font-bold mb-4 text-[var(--text-blue-dark)]">
                ${price}
                <span className="text-base font-normal text-[var(--text-blue-medium)] ml-1">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </p>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 mr-2 text-[var(--pastel-green-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[var(--text-blue-dark)]">{feature}</span>
                  </li>
                ))}
              </ul>

              {isNormalPlan ? (
                <div className="w-full py-3 text-center bg-[var(--pastel-blue-light)] text-[var(--text-blue-dark)] rounded-lg font-medium">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => setSelectedPlan({ ...plan, billingCycle })}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.highlight 
                      ? 'bg-[var(--text-blue-medium)] hover:bg-[var(--text-blue-dark)] text-white' 
                      : 'bg-[var(--pastel-blue-dark)] hover:bg-[var(--text-blue-medium)] text-[var(--text-blue-dark)]'
                  }`}
                >
                  Get {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment modal */}
      {selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <div className="relative bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            {isSuccess ? (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-[var(--pastel-green-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-[var(--pastel-green-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--text-blue-dark)]">Payment Successful!</h3>
                <p className="text-[var(--text-blue-medium)] mb-4">
                  You've subscribed to {selectedPlan.name} ({selectedPlan.billingCycle})
                </p>
                <p className="text-lg font-semibold text-[var(--text-blue-dark)]">
                  ${selectedPlan[billingCycle === 'yearly' ? 'yearlyPrice' : 'monthlyPrice']}
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-[var(--text-blue-dark)]">Upgrade to {selectedPlan.name}</h3>
                  <button 
                    onClick={() => setSelectedPlan(null)} 
                    className="text-[var(--text-blue-medium)] hover:text-[var(--text-blue-dark)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-lg font-semibold mb-6 text-[var(--text-blue-dark)]">
                  ${selectedPlan[billingCycle === 'yearly' ? 'yearlyPrice' : 'monthlyPrice']}
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </p>

                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-4">
                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-blue-dark)] mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--text-blue-medium)] focus:border-transparent ${
                          errors.cardNumber ? 'border-red-500' : 'border-[var(--pastel-blue-dark)]'
                        }`}
                        value={formatCardNumber(paymentInfo.cardNumber)}
                        onChange={(e) => {
                          setPaymentInfo({...paymentInfo, cardNumber: e.target.value});
                          if (errors.cardNumber) setErrors({...errors, cardNumber: ''});
                        }}
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                      )}
                    </div>

                    {/* Expiry and CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-blue-dark)] mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--text-blue-medium)] focus:border-transparent ${
                            errors.expiry ? 'border-red-500' : 'border-[var(--pastel-blue-dark)]'
                          }`}
                          value={formatExpiry(paymentInfo.expiry)}
                          onChange={(e) => {
                            setPaymentInfo({...paymentInfo, expiry: e.target.value});
                            if (errors.expiry) setErrors({...errors, expiry: ''});
                          }}
                          maxLength={5}
                        />
                        {errors.expiry && (
                          <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-blue-dark)] mb-1">CVC</label>
                        <input
                          type="text"
                          placeholder="123"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--text-blue-medium)] focus:border-transparent ${
                            errors.cvc ? 'border-red-500' : 'border-[var(--pastel-blue-dark)]'
                          }`}
                          value={paymentInfo.cvc}
                          onChange={(e) => {
                            setPaymentInfo({...paymentInfo, cvc: e.target.value.replace(/\D/g, '')});
                            if (errors.cvc) setErrors({...errors, cvc: ''});
                          }}
                          maxLength={4}
                        />
                        {errors.cvc && (
                          <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                        )}
                      </div>
                    </div>

                    {/* Name on Card */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-blue-dark)] mb-1">Name on Card</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--text-blue-medium)] focus:border-transparent ${
                          errors.name ? 'border-red-500' : 'border-[var(--pastel-blue-dark)]'
                        }`}
                        value={paymentInfo.name}
                        onChange={(e) => {
                          setPaymentInfo({...paymentInfo, name: e.target.value});
                          if (errors.name) setErrors({...errors, name: ''});
                        }}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 bg-[var(--text-blue-medium)] text-white font-medium rounded-lg mt-6 transition-colors ${
                      isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--text-blue-dark)]'
                    }`}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      `Complete Payment - $${selectedPlan[billingCycle === 'yearly' ? 'yearlyPrice' : 'monthlyPrice']}`
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingSection;
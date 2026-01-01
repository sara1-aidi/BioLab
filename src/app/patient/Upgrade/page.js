
import React from 'react';
import PremiumBenefits from '../components/PremiumBenefits';
import PricingSection from '../components/PricingSection';

const UpgradePlanPage = () => {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">..Premium Access Starts Here..</h1>
      <PremiumBenefits />
      <div className="mt-12">
        <PricingSection />
      </div>
    </div>
  );
};

export default UpgradePlanPage;
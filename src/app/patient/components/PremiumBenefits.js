import Image from 'next/image';

const PremiumBenefits = () => {
  return (
    <div className="bg-gradient-to-r from-[var(--pastel-blue-light)] to-[var(--pastel-blue-medium)] p-8 rounded-xl mb-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        {/* Left Column - Text */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-[var(--text-blue-dark)] mb-4">
            Welcome to Premium
          </h2>
          <h3 className="text-2xl font-semibold text-[var(--text-blue-medium)] mb-6">
            Exclusive Member Benefits
          </h3>
          <p className="text-lg text-[var(--text-blue-medium)] mb-6">
            Enjoy exclusive benefits with our Premium plan, including unlimited scans, 
            priority support, and advanced AI features. Upgrade today to unlock the 
            full potential of our services.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-[var(--text-blue-medium)] text-white px-6 py-3 rounded-lg hover:bg-[var(--text-blue-dark)] transition-colors">
              Upgrade Now
            </button>
            <button className="border-2 border-[var(--text-blue-medium)] text-[var(--text-blue-medium)] px-6 py-3 rounded-lg hover:bg-[var(--pastel-blue-dark)] transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="md:w-1/2">
          <Image 
            src="/images/premium.png" 
            alt="Premium Benefits"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg border-4 border-[var(--pastel-blue-dark)]"
          />
        </div>
      </div>
    </div>
  );
};

export default PremiumBenefits;
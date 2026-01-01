// components/AIDiagnosis.js
"use client";
import { motion } from 'framer-motion';
import { BeakerIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/solid';

export default function AIDiagnosis() {
  return (
    <section className="py-20 px-4 bg-pastel-green-light">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <div className="space-y-8">
            <motion.h2 
              className="text-4xl font-bold text-text-blue-dark"
              initial={{ x: -50 }}
              whileInView={{ x: 0 }}
            >
              AI-Powered Precision Analysis
            </motion.h2>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              <div className="flex items-start gap-4">
                <BeakerIcon className="h-12 w-12 text-pastel-green-dark flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-text-blue-medium mb-2">Advanced Algorithms</h3>
                  <p className="text-text-blue-dark/80">Machine learning models trained on millions of data points</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ShieldCheckIcon className="h-12 w-12 text-pastel-green-dark flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-text-blue-medium mb-2">Secure Processing</h3>
                  <p className="text-text-blue-dark/80">HIPAA-compliant data handling with end-to-end encryption</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <ClockIcon className="h-12 w-12 text-pastel-green-dark flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold text-text-blue-medium mb-2">Fast Results</h3>
                  <p className="text-text-blue-dark/80">Average results delivery within 24 hours</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="relative aspect-square rounded-3xl overflow-hidden shadow-xl"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1578496781985-452d4a934d50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="AI Analysis"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
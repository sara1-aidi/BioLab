// components/CTA.js
"use client";
import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-20 px-4 bg-pastel-blue-dark text-pastel-blue-light">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready for Precision Diagnostics?
          </h2>
          <p className="text-xl md:text-2xl">
            Join thousands of healthcare providers and patients trusting our advanced analysis
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button className="bg-pastel-green-medium hover:bg-pastel-green-dark px-12 py-4 rounded-full text-xl font-semibold text-white transition-all">
              Get Started Now
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
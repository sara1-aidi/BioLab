// components/Features.js
"use client";
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  UserGroupIcon,
  LockClosedIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    title: "Fast Results",
    description: "Get AI-powered analysis within minutes of scan submission",
    icon: RocketLaunchIcon
  },
  {
    title: "Expert Review",
    description: "All reports validated by certified medical professionals",
    icon: UserGroupIcon
  },
  {
    title: "Secure & Private",
    description: "Military-grade encryption for all patient data",
    icon: LockClosedIcon
  },
  {
    title: "24/7 Access",
    description: "Round-the-clock support and portal access",
    icon: GlobeAltIcon
  }
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16 text-text-blue-dark"
        >
          Why Choose Us
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-6 rounded-xl bg-gradient-to-b from-pastel-blue-light to-white hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-pastel-green-medium rounded-full flex items-center justify-center text-2xl mb-4">
                <feature.icon className="h-10 w-10 text-pastel-green-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-blue-medium">{feature.title}</h3>
              <p className="text-text-blue-dark/80">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
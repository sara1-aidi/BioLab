// components/HowItWorks.js
"use client";
import { motion } from 'framer-motion';
import { 
  CalendarIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const steps = [
  {
    title: "Book Appointment",
    description: "Easy online scheduling system",
    icon: CalendarIcon
  },
  {
    title: "Upload Scans",
    description: "Secure digital submission portal",
    icon: CloudArrowUpIcon
  },
  {
    title: "AI Analysis",
    description: "Advanced algorithms processing",
    icon: CpuChipIcon
  },
  {
    title: "Get Results",
    description: "Detailed expert reports",
    icon: DocumentChartBarIcon
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-16 text-text-blue-dark"
        >
          Simple 4-Step Process
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-xl bg-pastel-blue-light hover:bg-pastel-blue-medium transition-all duration-300"
            >
              <div className="w-16 h-16 bg-white group-hover:bg-pastel-green-medium rounded-full flex items-center justify-center mb-4 transition-all">
                <step.icon className="h-10 w-10 text-pastel-blue-dark group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text-blue-medium">{step.title}</h3>
              <p className="text-text-blue-dark/80">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Demo Video Section */}
        <motion.div 
          className="mt-20 rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <iframe 
            className="w-full aspect-video"
            src="https://www.youtube.com/embed/your-demo-video-id" 
            title="Process Demo"
            allowFullScreen
          />
        </motion.div>
      </div>
    </section>
  );
}
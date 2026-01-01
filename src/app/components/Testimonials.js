// components/Testimonials.jsx
"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Radiologist",
    text: "The AI analysis has revolutionized our diagnostic workflow, providing accurate results in record time.",
    avatar: "/avatars/doctor1.jpg"
  },
  {
    name: "Michael Chen",
    role: "Patient",
    text: "Received my results faster than any previous lab experience. The 3D visualization helped me understand my condition better.",
    avatar: "/avatars/patient1.jpg"
  },
  {
    name: "HealthTech Review",
    role: "Industry Expert",
    text: "Setting new standards in medical diagnostics with their innovative AI-powered platform.",
    avatar: "/avatars/expert1.jpg"
  }
];

const Testimonials = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-20 px-4 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-center mb-16"
        >
          What They Say
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">"{testimonial.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
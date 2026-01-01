// components/Footer.jsx
"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Footer = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const links = [
    { title: "About Us", items: ["Our Team", "Technology", "Careers"] },
    { title: "Resources", items: ["Blog", "Research Papers", "FAQ"] },
    { title: "Legal", items: ["Privacy Policy", "Terms of Service"] },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <h3 className="text-white text-xl font-bold mb-4">BioLab Research</h3>
            <p className="mb-4">Pioneering AI-driven diagnostics for better healthcare outcomes</p>
          </motion.div>

          {links.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="hover:text-white transition-colors">
                    <a href="#">{item}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="border-t border-gray-800 pt-8 text-center"
        >
          <div className="flex justify-center space-x-6 mb-4">
            {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map((platform) => (
              <a
                key={platform}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BioLab Research. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
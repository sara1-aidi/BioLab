// components/FloatingIcons.js
"use client";
import { motion } from 'framer-motion';
import {
  BeakerIcon,
  CpuChipIcon,
  EyeDropperIcon,
  MagnifyingGlassIcon,
  ChartPieIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function FloatingIcons() {
  // Define icons array with proper JSX elements
  const icons = [
    <BeakerIcon key="beaker" className="h-12 w-12 text-pastel-blue-light/20" />,
    <CpuChipIcon key="cpu" className="h-12 w-12 text-pastel-green-medium/20" />,
    <EyeDropperIcon key="dropper" className="h-12 w-12 text-pastel-blue-light/20" />,
    <MagnifyingGlassIcon key="search" className="h-12 w-12 text-pastel-green-medium/20" />,
    <ChartPieIcon key="chart" className="h-12 w-12 text-pastel-blue-light/20" />,
    <ShieldCheckIcon key="shield" className="h-12 w-12 text-pastel-green-medium/20" />
  ];

  return (
    <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-4 p-8">
      {Array.from({ length: 48 }).map((_, i) => (
        <motion.div
          key={i}
          className="opacity-20 hover:opacity-40 transition-opacity"
          initial={{ y: 0, rotate: 0, scale: 0.8 }}
          animate={{ 
            y: [0, -80, 0],
            rotate: [0, 15, -15, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          {icons[i % icons.length]}
        </motion.div>
      ))}
    </div>
  );
}
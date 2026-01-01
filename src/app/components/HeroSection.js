// components/HeroSection.js
"use client";
import { motion } from 'framer-motion';
import FloatingIcons from './FloatingIcons';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';

 export default function HeroSection() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleExplore = () => {
    console.log('Button clicked - Current user:', user);
    console.log('Loading state:', loading);
    
    if (loading) {
      console.log('Still loading, aborting...');
      return;
    }
    
    if (!user) {
      console.log('No user - redirecting to signin');
      router.push('/signin');
    } else if (user.role === 'admin') {
      console.log('Admin detected - redirecting to admin dashboard');
      router.push('/admin/dashboard');
    } else if (user.role === 'patient') {
      console.log(`Patient detected (type: ${user.patient_type})`);
      const path = user.patient_type === 'external' ? '/upgrade' : '/patient/dashboard';
      console.log('Redirecting to:', path);
      router.push(path);
    } else {
      console.error('Unknown user role:', user.role);
    }
  };

  return (
    <section className="relative h-screen flex items-center px-4 lg:px-8 overflow-hidden">
      {/* Floating Icons Background */}
      <div className="absolute inset-0 z-0">
        <FloatingIcons />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text & CTA */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-pastel-blue-dark mb-2">
                BioLab Research
              </h2>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-pastel-blue-dark mb-2 leading-tight">
                Advanced Diagnostic Solutions through<br />
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Responsive AI Technology
                </span>
              </h1>
            </div>

            <p className="text-lg text-pastel-blue-dark mb-2 max-w-xl leading-relaxed">
              Precision medical analysis powered by adaptive machine learning and cutting-edge 
              laboratory research.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button 
                onClick={handleExplore}
                disabled={loading}
                className="bg-white/90 hover:bg-white text-pastel-green-dark px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all backdrop-blur-sm
                          disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label="Explore Solutions"
              >
                {loading ? 'Loading...' : 'Explore Solutions'}
              </button>
            </motion.div>
          </motion.div>

          {/* Right Column - Video */}
          <motion.div 
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <video 
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-label="Laboratory microscope video demonstration"
            >
              <source src="/videos/lab-microscope.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
// app/page.js
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import AIDiagnosis from './components/AIDiagnosis';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <HowItWorks />
      <AIDiagnosis />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
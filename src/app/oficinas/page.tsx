import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import BenefitsSection from './components/BenefitsSection';
import ServicesSection from './components/ServicesSection';
import PlansSection from './components/PlansSection';
import SocialProofSection from './components/SocialProofSection';
import VideoSection from './components/VideoSection';
import PlatformAccessSection from './components/PlatformAccessSection';
import FaqSection from './components/FaqSection';
import CtaSection from './components/CtaSection';
import Header from './components/Header';
import Footer from './components/Footer';

export default function OficinasLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ServicesSection />
        <PlansSection />
        <SocialProofSection />
        <VideoSection />
        <PlatformAccessSection />
        <FaqSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
} 
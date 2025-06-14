"use client";

import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Componentes de layout
import Header from "./components/Header";
import Footer from "./components/Footer";

// Componentes da página
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import PartnersCarousel from "./components/PartnersCarousel";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FeaturesSection from "./components/FeaturesSection";
import CoverageSimpleSection from "./components/CoverageSimpleSection";
import PartnersSection from "./components/PartnersSection";
import DownloadAppSection from "./components/DownloadAppSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";

export default function MotoristasPage() {
  // Inicializa as animações AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);
  
  // Referências para scroll
  const mainRef = useRef(null);

  return (
    <main ref={mainRef} className="overflow-hidden">
      <Header />
      
      <HeroSection />
      <PartnersCarousel />
      <BenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FeaturesSection />
      <CoverageSimpleSection />
      <PartnersSection />
      <DownloadAppSection />
      <FaqSection />
      <CtaSection />

      <Footer />
    </main>
  );
} 
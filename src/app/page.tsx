"use client";

import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// Componentes de layout
import Header from "./motoristas/components/Header";
import Footer from "./motoristas/components/Footer";

// Componentes da página
import HeroSection from "./motoristas/components/HeroSection";
import BenefitsSection from "./motoristas/components/BenefitsSection";
import PartnersCarousel from "./motoristas/components/PartnersCarousel";
import HowItWorksSection from "./motoristas/components/HowItWorksSection";
import TestimonialsSection from "./motoristas/components/TestimonialsSection";
import FeaturesSection from "./motoristas/components/FeaturesSection";
import CoverageSimpleSection from "./motoristas/components/CoverageSimpleSection";
import PartnersSection from "./motoristas/components/PartnersSection";
import DownloadAppSection from "./motoristas/components/DownloadAppSection";
import FaqSection from "./motoristas/components/FaqSection";
import CtaSection from "./motoristas/components/CtaSection";

export default function HomePage() {
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

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
import HowItWorksSection from "./motoristas/components/HowItWorksSection";
import TestimonialsSection from "./motoristas/components/TestimonialsSection";
import FeaturesSection from "./motoristas/components/FeaturesSection";
import PartnersSection from "./motoristas/components/PartnersSection";
import PlatformAccessSection from "./motoristas/components/DownloadAppSection";
import FaqSection from "./motoristas/components/FaqSection";
import CtaSection from "./motoristas/components/CtaSection";
import VehiclesSection from "./motoristas/components/VehiclesSection";
import ServicesSection from "./motoristas/components/ServicesSection";
import CoverageSimpleSection from "./motoristas/components/CoverageSimpleSection";

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
      <BenefitsSection />
      <HowItWorksSection />
      <VehiclesSection />
      <ServicesSection />
      <TestimonialsSection />
      <FeaturesSection />
      <CoverageSimpleSection />
      <PartnersSection />
      <PlatformAccessSection />
      <FaqSection />
      <CtaSection />

      <Footer />
    </main>
  );
}

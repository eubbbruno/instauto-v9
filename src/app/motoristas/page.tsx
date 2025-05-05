"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

// Componentes da página
import HeroSection from "./components/HeroSection";
import BenefitsSection from "./components/BenefitsSection";
import PartnersCarousel from "./components/PartnersCarousel";
import HowItWorksSection from "./components/HowItWorksSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FeaturesSection from "./components/FeaturesSection";
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
  
  // Items do menu
  const navItems = [
    { label: "Benefícios", href: "#beneficios" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Parceiros", href: "#parceiros" },
    { label: "Perguntas", href: "#faq" },
  ];

  return (
    <main ref={mainRef} className="overflow-hidden">
      <Navbar 
        items={navItems} 
        transparent={true} 
        showOfficinasLink={true}
      />
      
      <HeroSection />
      <PartnersCarousel />
      <BenefitsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FeaturesSection />
      <PartnersSection />
      <DownloadAppSection />
      <FaqSection />
      <CtaSection />

      <Footer />
    </main>
  );
} 
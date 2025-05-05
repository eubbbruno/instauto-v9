"use client";

import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

// Componentes da página
import HeroSection from "./motoristas/components/HeroSection";
import BenefitsSection from "./motoristas/components/BenefitsSection";
import HowItWorksSection from "./motoristas/components/HowItWorksSection";
import TestimonialsSection from "./motoristas/components/TestimonialsSection";
import FeaturesSection from "./motoristas/components/FeaturesSection";
import PartnersSection from "./motoristas/components/PartnersSection";
import DownloadAppSection from "./motoristas/components/DownloadAppSection";
import FaqSection from "./motoristas/components/FaqSection";
import CtaSection from "./motoristas/components/CtaSection";
import VehiclesSection from "./motoristas/components/VehiclesSection";
import ServicesSection from "./motoristas/components/ServicesSection";

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
  
  // Items do menu
  const navItems = [
    { label: "Benefícios", href: "#beneficios" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Veículos", href: "#veiculos" },
    { label: "Serviços", href: "#servicos" },
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
      <BenefitsSection />
      <HowItWorksSection />
      <VehiclesSection />
      <ServicesSection />
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

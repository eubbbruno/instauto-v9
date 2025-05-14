"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AOS from "aos";
import "aos/dist/aos.css";
import AuroraBackground from "@/components/AuroraBackground";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import HowItWorksSection from "./components/HowItWorksSection";
import BenefitsSection from "./components/BenefitsSection";
import PlatformAccessSection from "./components/PlatformAccessSection";
import ServicesSection from "./components/ServicesSection";
import SocialProofSection from "./components/SocialProofSection";
import VideoSection from "./components/VideoSection";
import PlansSection from "./components/PlansSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";

export default function OficinasPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  
  // Inicializa GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Inicializa animações AOS
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
    });
    
    // Animações de scroll com GSAP
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        },
        once: true,
      });
    });
    
    return () => {
      // Limpar ScrollTriggers na desmontagem
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  
  return (
    <div className="min-h-screen overflow-x-hidden" ref={mainRef}>
      {/* Fundo com efeito Aurora */}
      <AuroraBackground particleColor="#0047CC" />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Header />
          <HeroSection />
          <HowItWorksSection />
          <BenefitsSection />
          <PlatformAccessSection />
          <ServicesSection />
          <SocialProofSection />
          <VideoSection />
          <PlansSection />
          <FaqSection />
          <CtaSection />
          <Footer />
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 
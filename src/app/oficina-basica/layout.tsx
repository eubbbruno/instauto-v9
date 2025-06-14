"use client";

import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { motion } from "framer-motion";

interface OficinaLayoutProps {
  children: ReactNode;
}

export default function OficinaLayout({ children }: OficinaLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute requiredUserType="oficina">
      <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar userType="oficina" />
        
        {/* Sidebar móvel */}
        <div 
          className={`fixed inset-0 bg-black z-30 transition-opacity duration-300 md:hidden ${
            sidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        <div className={`fixed inset-y-0 left-0 z-40 w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}>
          <DashboardSidebar userType="oficina" />
        </div>
        
        {/* Main Content */}
        <motion.main
          className="flex-1 md:ml-64 min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="main-content-wrapper">
            <div className="sticky top-0 z-10">
              <DashboardHeader 
                title="Oficina Básica" 
                onToggleSidebar={toggleSidebar} 
              />
            </div>
            {children}
          </div>
        </motion.main>
      </div>
    </ProtectedRoute>
  );
} 
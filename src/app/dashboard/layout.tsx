"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
      <div className="fixed right-[-30%] top-[-10%] w-[800px] h-[800px] rounded-full bg-[#0047CC]/[0.02] blur-[100px] pointer-events-none"></div>
      <div className="fixed left-[-20%] bottom-[-20%] w-[600px] h-[600px] rounded-full bg-[#FFDE59]/[0.02] blur-[100px] pointer-events-none"></div>
      
      {/* Sidebar */}
      <DashboardSidebar />
      
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
        <DashboardSidebar />
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
              title="Dashboard" 
              onToggleSidebar={toggleSidebar} 
              notificationCount={1} 
            />
          </div>
          {children}
        </div>
      </motion.main>
    </div>
  );
} 
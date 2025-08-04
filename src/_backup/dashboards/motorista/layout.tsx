"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import ClientOnly from "@/components/ClientOnly";

interface MotoristaLayoutProps {
  children: React.ReactNode;
}

export default function MotoristaLayout({ children }: MotoristaLayoutProps) {
  return (
    <ProtectedRoute requiredUserType="motorista">
      <ClientOnly> {/* Adicionar ClientOnly aqui também */}
        <div className="flex h-screen bg-gray-100">
          <DashboardSidebar userType="motorista" />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
} 
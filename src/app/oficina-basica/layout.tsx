"use client";

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OficinaSidebar from '@/components/OficinaSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import ClientOnly from '@/components/ClientOnly';

interface OficinaLayoutProps {
  children: ReactNode;
}

export default function OficinaLayout({ children }: OficinaLayoutProps) {
  return (
    <ProtectedRoute requiredUserType="oficina">
      <ClientOnly> {/* Adicionar ClientOnly aqui também */}
        <div className="flex h-screen bg-gray-100">
          <OficinaSidebar planType="free" />
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
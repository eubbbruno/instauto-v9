"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OficinaSidebar from '@/components/OficinaSidebar';
import DashboardHeader from '@/components/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredUserType="oficina">
      <div className="flex h-screen bg-gray-100">
        <OficinaSidebar planType="pro" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
} 
"use client";

import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <DashboardSidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
} 
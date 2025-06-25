"use client";

import GlobalHeader from '@/components/GlobalHeader';

export default function VeiculoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader 
        title="Veículos"
        showSearch={true}
      />
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
} 
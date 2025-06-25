"use client";

import GlobalHeader from '@/components/GlobalHeader';
import { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
  customActions?: ReactNode;
}

export default function LayoutWrapper({ 
  children, 
  title = "Instauto",
  showSearch = true,
  customActions 
}: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader 
        title={title}
        showSearch={showSearch}
        customActions={customActions}
      />
      
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
} 
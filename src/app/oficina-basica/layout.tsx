"use client";

import { ReactNode } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface OficinaLayoutProps {
  children: ReactNode;
}

export default function OficinaLayout({ children }: OficinaLayoutProps) {
  return (
    <ProtectedRoute requiredUserType="oficina">
      {children}
    </ProtectedRoute>
  );
} 
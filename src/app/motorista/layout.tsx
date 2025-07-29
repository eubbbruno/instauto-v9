"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface MotoristaLayoutProps {
  children: React.ReactNode;
}

export default function MotoristaLayout({ children }: MotoristaLayoutProps) {
  return (
    <ProtectedRoute requiredUserType="motorista">
      {children}
    </ProtectedRoute>
  );
} 
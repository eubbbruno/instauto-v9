"use client";

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredUserType?: 'motorista' | 'oficina';
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredUserType,
  fallbackPath = '/auth'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Se não estiver logado, redireciona para login
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      // Se há restrição de tipo de usuário e não corresponde
      if (requiredUserType && user.type !== requiredUserType) {
        // Redireciona para a página apropriada do usuário
        const userDashboard = user.type === 'oficina' ? '/oficina-basica' : '/motorista';
        router.push(userDashboard);
        return;
      }
    }
  }, [user, loading, router, requiredUserType, fallbackPath]);

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingSpinner />;
  }

  // Se não estiver logado ou tipo de usuário não corresponder, não renderizar conteúdo
  if (!user || (requiredUserType && user.type !== requiredUserType)) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
} 
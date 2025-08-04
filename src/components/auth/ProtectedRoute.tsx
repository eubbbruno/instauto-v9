"use client";

import { useAuth } from '@/contexts/AuthContextNew';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode, useCallback } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import ClientOnly from '@/components/ClientOnly';

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
  const { user, loading, isInitialized } = useAuth(); // Usar isInitialized
  const router = useRouter();
  const pathname = usePathname();

  // Verificação principal com isInitialized
  const checkAuth = useCallback(() => {
    console.log('🔍 [PROTECTED] Verificando auth...', {
      isInitialized,
      loading,
      user: !!user,
      userType: user?.type,
      userPlanType: user?.planType,
      requiredUserType,
      pathname
    });

    // IMPORTANTE: Só verificar após inicialização completa
    if (!isInitialized) {
      console.log('⏳ [PROTECTED] Aguardando inicialização...');
      return;
    }

    if (!user) {
      console.log('❌ [PROTECTED] Sem usuário, redirecionando...');
      router.push(fallbackPath);
      return;
    }

    // Verificações de tipo...
    if (requiredUserType && user.type !== requiredUserType) {
      console.log('⚠️ [PROTECTED] Tipo incorreto, redirecionando...');
      
      let userDashboard = '/motorista'; // default
      
      if (user.type === 'oficina') {
        console.log('🔍 [PROTECTED] Oficina detectada, verificando plano:', user.planType);
        userDashboard = user.planType === 'pro' ? '/dashboard' : '/oficina-basica';
      }
      
      console.log('🎯 [PROTECTED] Redirecionando para:', userDashboard);
      router.push(userDashboard);
      return;
    }

    console.log('✅ [PROTECTED] Acesso autorizado para:', user.name);
  }, [isInitialized, user, router, requiredUserType, fallbackPath, pathname]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Renderização com ClientOnly wrapper
  if (!isInitialized || loading) {
    return <LoadingSpinner message="Carregando..." />;
  }

  if (!user) {
    return <LoadingSpinner message="Verificando autenticação..." />;
  }

  // IMPORTANTE: Envolver com ClientOnly
  return <ClientOnly>{children}</ClientOnly>;
}
"use client";

import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

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
  const [mounted, setMounted] = useState(false);

  // Aguardar montagem do componente
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log('🔍 [PROTECTED] Estado atual:', {
      loading,
      user: !!user,
      userType: user?.type,
      userPlanType: user?.planType,
      requiredUserType,
      pathname: window.location.pathname
    });

    // Se ainda está carregando, aguardar
    if (loading) {
      console.log('⏳ [PROTECTED] Aguardando contexto carregar...');
      return;
    }

    // Se não tem usuário, redirecionar para login
    if (!user) {
      console.log('❌ [PROTECTED] Sem usuário, redirecionando para:', fallbackPath);
      router.push(fallbackPath);
      return;
    }

    // Se tem restrição de tipo e não corresponde, redirecionar para dashboard correto
    if (requiredUserType && user.type !== requiredUserType) {
      console.log('⚠️ [PROTECTED] Tipo incorreto, redirecionando...');
      
      let correctDashboard = '/motorista'; // padrão
      
      if (user.type === 'oficina') {
        correctDashboard = user.planType === 'pro' ? '/dashboard' : '/oficina-basica';
      }
      
      console.log('🎯 [PROTECTED] Redirecionando para:', correctDashboard);
      router.push(correctDashboard);
      return;
    }

    console.log('✅ [PROTECTED] Acesso autorizado para:', user.name);
  }, [mounted, loading, user, requiredUserType, fallbackPath, router]);

  // Não renderizar no servidor ou durante carregamento
  if (!mounted || loading) {
    return <LoadingSpinner />;
  }

  // Se não tem usuário, não renderizar (vai redirecionar)
  if (!user) {
    return <LoadingSpinner />;
  }

  // Se tem restrição de tipo e não corresponde, não renderizar (vai redirecionar)
  if (requiredUserType && user.type !== requiredUserType) {
    return <LoadingSpinner />;
  }

  // Tudo OK, renderizar children
  return <>{children}</>;
}
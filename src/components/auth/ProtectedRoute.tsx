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
  const [supabaseLoading, setSupabaseLoading] = useState(true);
  const [hasSupabaseSession, setHasSupabaseSession] = useState(false);

  // Verificar sessão Supabase diretamente (para OAuth)
  useEffect(() => {
    const checkSupabaseSession = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        setSupabaseLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('🔍 [PROTECTED] Verificando sessão Supabase:', !!session);
        setHasSupabaseSession(!!session);
      } catch (error) {
        console.error('❌ [PROTECTED] Erro ao verificar sessão:', error);
        setHasSupabaseSession(false);
      } finally {
        setSupabaseLoading(false);
      }
    };

    checkSupabaseSession();
  }, []);

  useEffect(() => {
    // CORREÇÃO CLAUDE WEB: Fallback de emergência para casos edge
    if (!loading && !user) {
      // Tentar recuperar sessão diretamente
      if (isSupabaseConfigured() && supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.log('🚨 [PROTECTED] Contexto perdeu sessão! Recarregando...');
            window.location.reload(); // Force reload para resincronizar
          }
        });
      }
    }
  }, [loading, user]);

  // Debug permanente
  useEffect(() => {
    console.log('🔍 [PROTECTED] Debug Motorista Web:', {
      loading,
      supabaseLoading,
      user: !!user,
      userName: user?.name,
      userType: user?.type,
      userPlanType: user?.planType,
      hasSupabaseSession,
      requiredUserType,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'server',
      timestamp: new Date().toISOString()
    });
  }, [loading, supabaseLoading, user, hasSupabaseSession]);

  useEffect(() => {
    // Aguardar tanto o contexto quanto a verificação direta do Supabase
    if (!loading && !supabaseLoading) {
      console.log('🔍 [PROTECTED] Estado completo:', { 
        user: !!user, 
        userName: user?.name,
        userType: user?.type,
        hasSupabaseSession, 
        requiredUserType,
        currentPath: window.location.pathname,
        fallbackPath
      });

      // Se tem sessão Supabase mas não tem user no contexto, aguardar mais um pouco
      if (hasSupabaseSession && !user) {
        console.log('⏳ [PROTECTED] RACE CONDITION DETECTADA: Aguardando contexto carregar usuário...');
        console.log('📊 [PROTECTED] Debugging info:', {
          hasSupabaseSession,
          userFromContext: !!user,
          loadingContext: loading,
          loadingSupabase: supabaseLoading
        });
        
        setTimeout(() => {
          // Verificar novamente após delay
          if (!user) {
            console.log('⚠️ [PROTECTED] TIMEOUT: Contexto não carregou após 3 segundos, redirecionando...');
            router.push(fallbackPath);
          } else {
            console.log('✅ [PROTECTED] Contexto carregou com sucesso após delay!');
          }
        }, 3000); // Aumentar para 3 segundos
        return;
      }

      // Se não tem sessão Supabase E não tem user no contexto, redirecionar
      if (!hasSupabaseSession && !user) {
        console.log('❌ [PROTECTED] Sem autenticação, redirecionando para:', fallbackPath);
        router.push(fallbackPath);
        return;
      }

      // Se tem user mas tipo não corresponde
      if (user && requiredUserType && user.type !== requiredUserType) {
        console.log('⚠️ [PROTECTED] Tipo incorreto, redirecionando...');
        let userDashboard = '/motorista'; // padrão
        
        if (user.type === 'oficina') {
          // 🔧 CORREÇÃO: Usar planType do usuário para determinar dashboard correto
          console.log('🔍 [PROTECTED] Oficina detectada, verificando plano:', user.planType);
          userDashboard = user.planType === 'pro' ? '/dashboard' : '/oficina-basica';
        }
        
        console.log('🎯 [PROTECTED] Redirecionando para:', userDashboard);
        router.push(userDashboard);
        return;
      }

      console.log('✅ [PROTECTED] Acesso autorizado');
    }
  }, [user, loading, supabaseLoading, hasSupabaseSession, router, requiredUserType, fallbackPath]);

  // Mostrar loading enquanto verifica autenticação
  if (loading || supabaseLoading) {
    console.log('⏳ [PROTECTED] Carregando...', { loading, supabaseLoading });
    return <LoadingSpinner />;
  }

  // Se tem sessão Supabase mas contexto ainda não carregou, aguardar
  if (hasSupabaseSession && !user) {
    console.log('⏳ [PROTECTED] Aguardando contexto...');
    return <LoadingSpinner />;
  }

  // Se não tem sessão nem user, não renderizar (vai redirecionar)
  if (!hasSupabaseSession && !user) {
    return <LoadingSpinner />;
  }

  // Se tem restrição de tipo e não corresponde, não renderizar
  if (user && requiredUserType && user.type !== requiredUserType) {
    return <LoadingSpinner />;
  }

  console.log('🎉 [PROTECTED] Renderizando conteúdo protegido');
  return <>{children}</>;
} 
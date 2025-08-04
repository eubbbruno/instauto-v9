import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useAuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const getRedirectPath = (userType: string, planType?: string) => {
    if (userType === 'motorista') {
      return '/motorista';
    } else if (userType === 'oficina') {
      if (planType === 'pro') {
        return '/dashboard';
      } else {
        return '/oficina-basica';
      }
    }
    return '/auth';
  };

  useEffect(() => {
    // 🚨 DEBUG CRÍTICO - Se este hook estiver sendo usado, ele pode estar causando redirecionamentos
    console.log('🚨 [AUTH_REDIRECT] HOOK ATIVO - PODE ESTAR CAUSANDO O PROBLEMA!');
    console.log('🔍 [AUTH_REDIRECT] Estado atual:', { 
      user: !!user, 
      loading,
      userType: user?.type,
      currentPath: window.location.pathname
    });

    if (!loading && !user) {
      console.log('❌ [AUTH_REDIRECT] Sem usuário, redirecionando para /auth');
      router.push('/auth');
      return;
    }
    
    if (!loading && user) {
      const currentPath = window.location.pathname;
      const expectedPath = getRedirectPath(user.type);
      
      console.log('🎯 [AUTH_REDIRECT] Usuário logado:', {
        type: user.type,
        currentPath,
        expectedPath,
        shouldRedirect: currentPath !== expectedPath
      });
      
      if (currentPath !== expectedPath && !currentPath.startsWith(expectedPath)) {
        console.log('🔄 [AUTH_REDIRECT] Redirecionando para:', expectedPath);
        router.replace(expectedPath);
      }
    }
  }, [user, loading, router]);

  return { user, loading };
} 
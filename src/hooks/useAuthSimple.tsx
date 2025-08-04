'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface SimpleUser {
  id: string;
  email: string;
  name: string;
  type: 'motorista' | 'oficina';
  planType?: 'free' | 'pro';
}

export function useAuthSimple() {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 [SIMPLE AUTH] Inicializando...');
    
    // Direto ao ponto - sem complexidade
    supabase.auth.getUser().then(({ data: { user: supabaseUser } }) => {
      if (supabaseUser) {
        console.log('✅ [SIMPLE AUTH] Usuário encontrado:', supabaseUser.email);
        
        // Buscar profile direto
        supabase
          .from('profiles')
          .select(`
            *,
            workshops(plan_type),
            drivers(*)
          `)
          .eq('id', supabaseUser.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('❌ [SIMPLE AUTH] Erro ao buscar profile:', error);
              setLoading(false);
              return;
            }

            if (data) {
              const simpleUser: SimpleUser = {
                id: data.id,
                email: data.email,
                name: data.name,
                type: data.type,
                planType: data.workshops?.[0]?.plan_type || undefined
              };
              
              console.log('✅ [SIMPLE AUTH] Profile carregado:', simpleUser);
              setUser(simpleUser);
            } else {
              console.log('⚠️ [SIMPLE AUTH] Profile não encontrado');
            }
            
            setLoading(false);
          });
      } else {
        console.log('❌ [SIMPLE AUTH] Nenhum usuário logado');
        setLoading(false);
      }
    });
    
    // Listener simples - reload na mudança
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('🔄 [SIMPLE AUTH] Auth change:', event);
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN') {
        // Reload simples ao mudar auth
        console.log('🔄 [SIMPLE AUTH] Recarregando página...');
        window.location.reload();
      }
    });
    
    return () => {
      console.log('🧹 [SIMPLE AUTH] Cleanup');
      subscription.unsubscribe();
    };
  }, []);
  
  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.type === 'motorista') return '/motorista';
    if (user.type === 'oficina') {
      return user.planType === 'pro' ? '/dashboard' : '/oficina-basica';
    }
    return '/auth';
  };

  return { 
    user, 
    loading, 
    getDashboardPath,
    isMotorista: user?.type === 'motorista',
    isOficina: user?.type === 'oficina',
    isPro: user?.planType === 'pro'
  };
}
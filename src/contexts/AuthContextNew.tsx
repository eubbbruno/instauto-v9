'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, User, Profile, Workshop } from '@/lib/supabase-new';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  getDashboardPath: () => string;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 [NEW AUTH] Inicializando...');
    
    // 1. Checar sessão atual
    checkUser();
    
    // 2. Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [NEW AUTH] Event:', event);
        
        if (session?.user) {
          await checkUser();
        } else {
          console.log('🚪 [NEW AUTH] Logout detectado');
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 [NEW AUTH] Cleanup');
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      console.log('🔍 [NEW AUTH] Verificando usuário...');
      
      // Pegar usuário autenticado
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ [NEW AUTH] Erro ao buscar usuário:', userError);
        setLoading(false);
        return;
      }

      if (supabaseUser) {
        console.log('✅ [NEW AUTH] Usuário encontrado:', supabaseUser.email);
        
        // Buscar profile completo
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            *,
            workshops(plan_type, business_name, verified),
            drivers(*)
          `)
          .eq('id', supabaseUser.id)
          .single();

        if (profileError) {
          console.error('❌ [NEW AUTH] Erro ao buscar profile:', profileError);
          setLoading(false);
          return;
        }

        if (profileData) {
          console.log('✅ [NEW AUTH] Profile carregado:', profileData);
          
          // Montar objeto User simplificado
          const userData: User = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.name,
            type: profileData.type,
            planType: profileData.workshops?.[0]?.plan_type,
            avatar: profileData.avatar_url
          };

          setUser(userData);
          setProfile(profileData);
          
          console.log('✅ [NEW AUTH] Dados carregados:', userData);
        } else {
          console.log('⚠️ [NEW AUTH] Profile não encontrado');
        }
      } else {
        console.log('❌ [NEW AUTH] Nenhum usuário logado');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('💥 [NEW AUTH] Erro geral:', error);
      setLoading(false);
    }
  }

  const getDashboardPath = (): string => {
    if (!user) return '/auth';
    
    if (user.type === 'motorista') {
      return '/new-dashboard?type=motorista';
    } else if (user.type === 'oficina') {
      const planType = user.planType || 'free';
      return `/new-dashboard?type=oficina&plan=${planType}`;
    }
    
    return '/auth';
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('🚪 [NEW AUTH] Fazendo logout...');
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      window.location.href = '/auth';
    } catch (error) {
      console.error('❌ [NEW AUTH] Erro no logout:', error);
    }
  };

  const refresh = async (): Promise<void> => {
    setLoading(true);
    await checkUser();
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    getDashboardPath,
    logout,
    refresh
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
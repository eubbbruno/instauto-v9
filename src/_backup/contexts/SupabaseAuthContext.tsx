"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// *** LOGIN ADMIN FIXO PARA COMPATIBILIDADE ***
const ADMIN_CREDENTIALS = {
  'admin@instauto.com': { password: 'admin123', type: 'oficina', name: 'Admin Instauto' },
  'motorista@instauto.com': { password: 'motorista123', type: 'motorista', name: 'Motorista Teste' },
  'oficina@instauto.com': { password: 'oficina123', type: 'oficina', name: 'Oficina Teste' },
  'bruno@instauto.com': { password: 'bruno123', type: 'oficina', name: 'Bruno Admin' }
}

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'motorista' | 'oficina';
  avatar?: string;
  phone?: string;
  // Campos específicos do motorista
  cpf?: string;
  vehicles?: Vehicle[];
  // Campos específicos da oficina
  cnpj?: string;
  businessName?: string;
  address?: string;
  services?: string[];
  rating?: number;
  verified?: boolean;
  planType?: 'free' | 'pro'; // Para oficinas
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: 'motorista' | 'oficina';
  phone?: string;
  cpf?: string;
  cnpj?: string;
  businessName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isInitialized: boolean; // NOVA FLAG
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isOfficina: boolean;
  isMotorista: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false); // NOVA FLAG
  const router = useRouter();

  useEffect(() => {
    let isMounted = true; // Prevenir updates em componentes desmontados
    
    const initializeAuth = async () => {
      try {
        console.log('🚀 [CONTEXT] Inicializando...');
        
        // Verificar auth local primeiro (login fixo)
        const localUser = localStorage.getItem('instauto_user');
        if (localUser && isMounted) {
          try {
            const userData = JSON.parse(localUser);
            const mockUser: User = {
              id: userData.email,
              email: userData.email,
              name: userData.name,
              type: userData.type,
              avatar: userData.type === 'motorista' ? '🚗' : '🔧'
            };
            setUser(mockUser);
            console.log('✅ [CONTEXT] Usuário local carregado:', userData.name);
            
            // CRUCIAL: Marcar como inicializado APÓS tudo
            if (isMounted) {
              setLoading(false);
              setIsInitialized(true);
              console.log('✅ [CONTEXT] Inicialização completa (local)');
            }
            return;
          } catch (error) {
            console.error('❌ [CONTEXT] Erro ao parsear dados locais:', error);
            localStorage.removeItem('instauto_user');
          }
        }

        // IMPORTANTE: Sempre buscar sessão primeiro
        if (isSupabaseConfigured() && supabase) {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ [CONTEXT] Erro ao buscar sessão:', error);
          }
          
          if (session?.user && isMounted) {
            console.log('🔑 [CONTEXT] Sessão Supabase encontrada:', session.user.email);
            await loadUserProfile(session.user);
          } else {
            console.log('🚫 [CONTEXT] Nenhuma sessão encontrada');
          }
        }
        
        // CRUCIAL: Marcar como inicializado APÓS tudo
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
          console.log('✅ [CONTEXT] Inicialização completa');
        }
      } catch (error) {
        console.error('❌ [CONTEXT] Erro na inicialização:', error);
        if (isMounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };
    
    // Listener para mudanças
    let authSubscription: any = null;
    
    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!isMounted) return;
          
          console.log('🔄 [CONTEXT] Auth change:', event);
          
          // Não processar se tem auth local
          const localUser = localStorage.getItem('instauto_user');
          if (localUser) {
            console.log('📱 [CONTEXT] Auth local ativo, ignorando Supabase');
            return;
          }
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ [CONTEXT] Login detectado');
            await loadUserProfile(session.user);
          } else if (event === 'SIGNED_OUT') {
            console.log('🚪 [CONTEXT] Logout detectado');
            setUser(null);
          }
          
          setLoading(false);
        }
      );
      authSubscription = data.subscription;
    }
    
    // Inicializar
    initializeAuth();
    
    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  // Carregar perfil do usuário
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!isSupabaseConfigured() || !supabase) {
      return;
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('❌ [CONTEXT] Erro ao carregar perfil:', error);
        
        // SOLUÇÃO CLAUDE WEB: NÃO criar profile automaticamente aqui
        // Isso estava causando conflito com o callback
        if (error.code === 'PGRST116') { // Profile não encontrado
          console.log('⚠️ [CONTEXT] Profile não encontrado - aguardando criação pelo callback...');
          setUser(null);
          return;
        }
        
        setUser(null);
        return;
      }

      if (profile) {
        // Se for oficina, buscar dados da oficina
        if (profile.type === 'oficina') {
          const { data: workshopData } = await supabase
            .from('workshops')
            .select('*')
            .eq('profile_id', profile.id)
            .single();
          
          console.log('📋 Workshop carregada:', workshopData);

          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            type: profile.type,
            phone: profile.phone,
            avatar: profile.avatar_url,
            businessName: workshopData?.business_name,
            cnpj: workshopData?.cnpj,
            address: workshopData?.address,
            services: workshopData?.services || [],
            rating: workshopData?.rating,
            verified: workshopData?.verified,
            planType: workshopData?.plan_type || 'free' // FALLBACK para free
          });

          // IMPORTANTE: Verificar se plan_type está correto para redirecionamento
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            console.log('🔧 [CONTEXT] Verificando redirecionamento oficina:', {
              planType: workshopData?.plan_type,
              currentPath,
              shouldRedirectToDashboard: workshopData?.plan_type === 'pro' && currentPath === '/oficina-basica',
              shouldRedirectToBasic: workshopData?.plan_type === 'free' && currentPath === '/dashboard'
            });

            if (workshopData?.plan_type === 'pro' && currentPath === '/oficina-basica') {
              console.log('🎯 [CONTEXT] Redirecionando oficina PRO para /dashboard');
              window.location.href = '/dashboard';
            } else if (workshopData?.plan_type === 'free' && currentPath === '/dashboard') {
              console.log('🎯 [CONTEXT] Redirecionando oficina FREE para /oficina-basica');
              window.location.href = '/oficina-basica';
            }
          }
        } else {
          // Se for motorista, buscar dados do motorista
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            type: profile.type,
            phone: profile.phone,
            avatar: profile.avatar_url,
            cpf: profile.cpf
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    }
  };

  // Login com suporte a admin fixo
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);

      // *** TENTAR LOGIN FIXO PRIMEIRO ***
      const adminUser = ADMIN_CREDENTIALS[credentials.email as keyof typeof ADMIN_CREDENTIALS];
      
      if (adminUser && adminUser.password === credentials.password) {
        // Simular sessão local
        localStorage.setItem('instauto_user', JSON.stringify({
          email: credentials.email,
          name: adminUser.name,
          type: adminUser.type,
          authenticated: true
        }));
        
        setUser({
          id: credentials.email,
          email: credentials.email,
          name: adminUser.name,
          type: adminUser.type,
          avatar: adminUser.type === 'motorista' ? '🚗' : '🔧'
        });
        
        setLoading(false);
        return true;
      }

      // *** FALLBACK PARA SUPABASE ***
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserProfile(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            type: data.type,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Criar perfil do usuário
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            name: data.name,
            email: data.email,
            type: data.type,
            phone: data.phone,
          });

        if (profileError) throw profileError;

        // Se for oficina, criar registro de oficina
        if (data.type === 'oficina') {
          const { error: workshopError } = await supabase
            .from('workshops')
            .insert({
              profile_id: authData.user.id,
              business_name: data.businessName || data.name,
              cnpj: data.cnpj,
              verified: false,
            });

          if (workshopError) throw workshopError;
        }

        // Se for motorista, criar registro de motorista
        if (data.type === 'motorista') {
          const { error: driverError } = await supabase
            .from('drivers')
            .insert({
              profile_id: authData.user.id,
              cpf: data.cpf,
            });

          if (driverError) throw driverError;
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Limpar autenticação local
      localStorage.removeItem('instauto_user');
      
      // Logout do Supabase
      await supabase.auth.signOut();
      
      setUser(null);
      router.push('/auth');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Update user
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      // Se for usuário Supabase, atualizar no banco
      if (!localStorage.getItem('instauto_user')) {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: updatedUser.name,
            phone: updatedUser.phone,
            avatar_url: updatedUser.avatar,
          })
          .eq('id', updatedUser.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  // Sign out (alias para logout)
  const signOut = async () => {
    await logout();
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isOfficina = user?.type === 'oficina';
  const isMotorista = user?.type === 'motorista';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isInitialized, // NOVA FLAG
        login,
        register,
        logout,
        updateUser,
        isAuthenticated,
        isOfficina,
        isMotorista,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 
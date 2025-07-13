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
  const router = useRouter();

  useEffect(() => {
    // CORREÇÃO CLAUDE WEB: Carregar sessão inicial IMEDIATAMENTE
    const initializeAuth = async () => {
      try {
        // Verificar auth local primeiro (login fixo)
        const localUser = localStorage.getItem('instauto_user');
        if (localUser) {
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
            setLoading(false);
            return;
          } catch (error) {
            console.error('Erro ao parsear dados locais:', error);
            localStorage.removeItem('instauto_user');
          }
        }

        // Se não tem auth local E Supabase está configurado
        if (isSupabaseConfigured() && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.user) {
            console.log('🚀 [CONTEXT] Sessão inicial encontrada:', session.user.id);
            await loadUserProfile(session.user);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ [CONTEXT] Erro ao inicializar:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // CORREÇÃO CLAUDE WEB: Listener para mudanças com logs detalhados
    let subscription: { unsubscribe: () => void } | null = null;
    
    if (isSupabaseConfigured() && supabase) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('🔄 [CONTEXT] Auth state change:', event, session?.user?.id);
          
          // Não processar se tem auth local
          const localUser = localStorage.getItem('instauto_user');
          if (localUser) {
            console.log('📱 [CONTEXT] Auth local detectado, ignorando Supabase');
            return;
          }
          
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ [CONTEXT] SIGNED_IN event - carregando profile');
            await loadUserProfile(session.user);
          } else if (event === 'SIGNED_OUT') {
            console.log('🚪 [CONTEXT] SIGNED_OUT event - limpando user');
            setUser(null);
          }
        }
      );
      subscription = { unsubscribe: () => authSubscription.unsubscribe() };
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [supabase]); // IMPORTANTE: Dependência do supabase

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
        console.error('Erro ao carregar perfil:', error);
        
        // Se não encontrou o profile, criar automaticamente para usuários OAuth
        if (error.code === 'PGRST116') { // Profile não encontrado
          console.log('🔧 [CONTEXT] Profile não encontrado, criando automaticamente...');
          
          // CORREÇÃO CLAUDE WEB: Pegar tipo do metadata (fallback para motorista)
          const userType = supabaseUser.user_metadata?.user_type || 'motorista';
          const planType = supabaseUser.user_metadata?.plan_type || 'free';
          
          console.log('📝 [CONTEXT] Criando profile com metadata:', { userType, planType });
          
          const newProfile = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || 'Usuário',
            email: supabaseUser.email || '',
            type: userType as 'motorista' | 'oficina',
            avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          // Criar profile
          const { error: createError } = await supabase
            .from('profiles')
            .insert(newProfile);

          if (createError) {
            console.error('❌ [CONTEXT] Erro ao criar profile:', createError);
            return;
          }

          // Criar registro específico baseado no tipo
          if (userType === 'motorista') {
            console.log('🚗 [CONTEXT] Criando registro de motorista');
            const { error: driverError } = await supabase
              .from('drivers')
              .insert({
                profile_id: supabaseUser.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (driverError) {
              console.error('❌ [CONTEXT] Erro ao criar driver:', driverError);
            }
          } else if (userType === 'oficina') {
            console.log('🔧 [CONTEXT] Criando registro de oficina com plano:', planType);
            const { error: workshopError } = await supabase
              .from('workshops')
              .insert({
                profile_id: supabaseUser.id,
                plan_type: planType,
                business_name: newProfile.name,
                verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (workshopError) {
              console.error('❌ [CONTEXT] Erro ao criar workshop:', workshopError);
            }
          }

          // Definir usuário com plan_type se for oficina
          const userData: User = {
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            type: newProfile.type,
            avatar: newProfile.avatar_url
          };

          // Se for oficina, adicionar dados específicos
          if (userType === 'oficina') {
            // Estender o tipo User para oficinas
            Object.assign(userData, {
              plan_type: planType,
              businessName: newProfile.name,
              verified: false
            });
          }

          setUser(userData);

          console.log('✅ [CONTEXT] Profile criado automaticamente com tipo:', userType);
          return;
        }
        
        return;
      }

      if (profile) {
        // Se for oficina, buscar dados da oficina
        if (profile.type === 'oficina') {
          const { data: workshop } = await supabase
            .from('workshops')
            .select('*')
            .eq('profile_id', profile.id)
            .single();

          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            type: profile.type,
            phone: profile.phone,
            avatar: profile.avatar_url,
            businessName: workshop?.business_name,
            cnpj: workshop?.cnpj,
            address: workshop?.address,
            services: workshop?.services || [],
            rating: workshop?.rating,
            verified: workshop?.verified
          });
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
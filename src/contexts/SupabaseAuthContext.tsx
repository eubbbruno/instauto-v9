"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

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

  // Verificar autenticação inicial
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await loadUserProfile(session.user);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Carregar perfil do usuário
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
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
          const { data: driver } = await supabase
            .from('drivers')
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
            cpf: driver?.cpf
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  // Login
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        console.error('Erro no login:', error);
        setLoading(false);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      setLoading(false);
      return false;
    }
  };

  // Registro
  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            type: data.type
          }
        }
      });

      if (authError) {
        console.error('Erro no registro:', authError);
        setLoading(false);
        return false;
      }

      if (authData.user) {
        // Criar dados específicos baseado no tipo
        if (data.type === 'oficina' && data.businessName) {
          await supabase.from('workshops').insert({
            profile_id: authData.user.id,
            business_name: data.businessName,
            cnpj: data.cnpj,
            address: {},
            services: [],
            specialties: []
          });
        } else if (data.type === 'motorista') {
          await supabase.from('drivers').insert({
            profile_id: authData.user.id,
            cpf: data.cpf,
            address: {}
          });
        }

        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no registro:', error);
      setLoading(false);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  // Atualizar usuário
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone,
          avatar_url: userData.avatar
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erro ao atualizar perfil:', profileError);
        return;
      }

      // Atualizar estado local
      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isOfficina: user?.type === 'oficina',
    isMotorista: user?.type === 'motorista'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
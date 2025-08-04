"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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
  type: 'motorista' | 'oficina';
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

// Dados mockados para demonstração
const MOCK_USERS = {
  motoristas: [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      password: '123456',
      type: 'motorista' as const,
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
      avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=0047CC&color=fff',
      vehicles: [
        {
          id: '1',
          brand: 'Honda',
          model: 'Civic',
          year: 2020,
          plate: 'ABC-1234',
          color: 'Prata'
        }
      ]
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      password: '123456',
      type: 'motorista' as const,
      phone: '(11) 91234-5678',
      cpf: '987.654.321-00',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=0047CC&color=fff'
    }
  ],
  oficinas: [
    {
      id: '3',
      name: 'Carlos Ferreira',
      businessName: 'Auto Center Silva',
      email: 'carlos@autocenter.com',
      password: '123456',
      type: 'oficina' as const,
      phone: '(11) 99999-0000',
      cnpj: '12.345.678/0001-00',
      address: 'Rua das Oficinas, 123 - São Paulo/SP',
      services: ['Mecânica Geral', 'Elétrica', 'Funilaria'],
      rating: 4.8,
      verified: true,
      avatar: 'https://ui-avatars.com/api/?name=Auto+Center+Silva&background=0047CC&color=fff'
    },
    {
      id: '4',
      name: 'Ana Costa',
      businessName: 'Oficina Costa',
      email: 'ana@oficinacosta.com',
      password: '123456',
      type: 'oficina' as const,
      phone: '(11) 88888-1111',
      cnpj: '98.765.432/0001-00',
      address: 'Av. Principal, 456 - São Paulo/SP',
      services: ['Revisão', 'Troca de Óleo', 'Freios'],
      rating: 4.5,
      verified: true,
      avatar: 'https://ui-avatars.com/api/?name=Oficina+Costa&background=0047CC&color=fff'
    }
  ]
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar se há usuário logado no localStorage
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('instauto_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('instauto_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Buscar usuário nos dados mockados
      const allUsers = [...MOCK_USERS.motoristas, ...MOCK_USERS.oficinas];
      const foundUser = allUsers.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password &&
        u.type === credentials.type
      );

      if (foundUser) {
        // Remove password antes de salvar
        const userWithoutPassword = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          type: foundUser.type,
          phone: foundUser.phone,
          avatar: foundUser.avatar,
          ...(foundUser.type === 'motorista' ? {
            cpf: foundUser.cpf,
            vehicles: foundUser.vehicles
          } : {
            businessName: foundUser.businessName,
            cnpj: foundUser.cnpj,
            address: foundUser.address,
            services: foundUser.services,
            rating: foundUser.rating,
            verified: foundUser.verified
          })
        };
        
        setUser(userWithoutPassword as User);
        localStorage.setItem('instauto_user', JSON.stringify(userWithoutPassword));
        
        // Redirect baseado no tipo de usuário
        if (credentials.type === 'oficina') {
          router.push('/oficina-basica');
        } else {
          router.push('/motorista');
        }
        
        return true;
      } else {
        console.error('Credenciais não encontradas:', { 
          email: credentials.email, 
          type: credentials.type,
          availableUsers: allUsers.map(u => ({ email: u.email, type: u.type }))
        });
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Registro
  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Verificar se email já existe
      const allUsers = [...MOCK_USERS.motoristas, ...MOCK_USERS.oficinas];
      const existingUser = allUsers.find(u => u.email === data.email);
      
      if (existingUser) {
        throw new Error('Este email já está cadastrado');
      }

      // Criar novo usuário
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        type: data.type,
        phone: data.phone,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0047CC&color=fff`,
        ...(data.type === 'motorista' ? {
          cpf: data.cpf,
          vehicles: []
        } : {
          businessName: data.businessName,
          cnpj: data.cnpj,
          services: [],
          rating: 0,
          verified: false
        })
      };

      setUser(newUser);
      localStorage.setItem('instauto_user', JSON.stringify(newUser));
      
      // Redirect baseado no tipo de usuário
      if (data.type === 'oficina') {
        router.push('/oficina-basica');
      } else {
        router.push('/motorista');
      }
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('instauto_user');
    router.push('/');
  };

  // Atualizar dados do usuário
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('instauto_user', JSON.stringify(updatedUser));
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
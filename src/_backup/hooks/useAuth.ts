import { useState, useEffect, useCallback } from 'react';
import { authApi, handleApiError, isAuthError } from '@/utils/api';
import { Usuario, LoginRequest, RegisterRequest, ApiState } from '@/types/api';

interface AuthState extends ApiState<Usuario> {
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    data: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Verificar se usuário está autenticado
  const checkAuth = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authApi.getMe();
      
      setAuthState({
        data: response.data,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setAuthState({
        data: null,
        loading: false,
        error: isAuthError(error) ? null : errorMessage,
        isAuthenticated: false,
      });
    }
  }, []);

  // Login
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authApi.login(
        credentials.email,
        credentials.senha,
        credentials.tipo
      );
      
      setAuthState({
        data: response.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Register
  const register = useCallback(async (userData: RegisterRequest) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await authApi.register(userData);
      
      setAuthState({
        data: response.user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return { success: true, user: response.user };
    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setAuthState({
        data: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    }
  }, []);

  // Verificar autenticação na inicialização
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user: authState.data,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: authState.isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
}; 
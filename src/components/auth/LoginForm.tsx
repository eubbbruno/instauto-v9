"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LoginFormProps {
  userType: 'motorista' | 'oficina';
}

export default function LoginForm({ userType }: LoginFormProps) {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validações
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Tentar fazer login
      const success = await login({
        email: formData.email,
        password: formData.password,
        type: userType
      });

      if (!success) {
        setErrors({ general: 'Email, senha ou tipo de usuário incorretos. Verifique se selecionou o tipo correto (Motorista/Oficina).' });
      }
    } catch {
      setErrors({ general: 'Erro ao fazer login. Tente novamente.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Limpar erro geral também
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  // Dados de demonstração para facilitar teste
  const demoCredentials = userType === 'motorista' 
    ? { email: 'joao@email.com', password: '123456' }
    : { email: 'carlos@autocenter.com', password: '123456' };

  const handleDemoLogin = () => {
    setFormData(demoCredentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Demo credentials com visual melhorado */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-center mb-3">
          {userType === 'motorista' ? (
            <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
          ) : (
            <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-2" />
          )}
          <h3 className="text-sm font-semibold text-blue-800">
            🚀 Acesso para demonstração - {userType === 'motorista' ? 'Motorista' : 'Oficina'}
          </h3>
        </div>
        
        <div className="bg-white rounded-lg p-3 mb-3 border border-blue-100">
          <p className="text-xs text-blue-600 mb-2">
            <strong>Email:</strong> {demoCredentials.email}<br />
            <strong>Senha:</strong> {demoCredentials.password}
          </p>
        </div>
        
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
        >
          <span className="mr-2">⚡</span>
          Entrar com dados de demonstração
        </button>
      </div>

      {/* Erro geral */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-red-400 mr-2 mt-0.5">⚠️</div>
            <div>
              <h4 className="text-red-800 font-medium text-sm">Erro no login</h4>
              <p className="text-red-700 text-sm mt-1">{errors.general}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="seu@email.com"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors ${
              errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Digite sua senha"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Link esqueci senha */}
      <div className="text-right">
        <button
          type="button"
          className="text-sm text-[#0047CC] hover:underline"
          disabled={loading}
        >
          Esqueci minha senha
        </button>
      </div>

      {/* Botão de submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0047CC] hover:bg-[#0055EB] text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" text="" fullScreen={false} />
            <span className="ml-2">Entrando...</span>
          </>
        ) : (
          'Entrar'
        )}
      </button>

      {/* Link para cadastro */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => {
              const event = new CustomEvent('switch-tab', { detail: 'register' });
              document.dispatchEvent(event);
            }}
            className="text-[#0047CC] hover:underline font-medium"
            disabled={loading}
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </form>
  );
} 
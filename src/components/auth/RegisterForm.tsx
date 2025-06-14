"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/LoadingSpinner';

interface RegisterFormProps {
  userType: 'motorista' | 'oficina';
}

export default function RegisterForm({ userType }: RegisterFormProps) {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    cnpj: '',
    businessName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validações
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido. Use o formato: (11) 99999-9999';
    }

    // Validações específicas por tipo de usuário
    if (userType === 'motorista') {
      if (!formData.cpf) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
        newErrors.cpf = 'CPF inválido. Use o formato: 123.456.789-00';
      }
    } else {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Nome da empresa é obrigatório';
      }
      
      if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ inválido. Use o formato: 12.345.678/0001-00';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Tentar fazer registro
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      type: userType,
      phone: formData.phone,
      ...(userType === 'motorista' ? {
        cpf: formData.cpf
      } : {
        cnpj: formData.cnpj,
        businessName: formData.businessName
      })
    });

    if (!success) {
      setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação automática para telefone
    if (name === 'phone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d)/, '$1-$2')
        .slice(0, 15);
    }

    // Formatação automática para CPF
    if (name === 'cpf') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .slice(0, 14);
    }

    // Formatação automática para CNPJ
    if (name === 'cnpj') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .slice(0, 18);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Erro geral */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}
      
      {/* Nome */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {userType === 'motorista' ? 'Nome completo' : 'Nome do responsável'} *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors ${
            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Digite seu nome completo"
          disabled={loading}
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Nome da empresa (apenas para oficina) */}
      {userType === 'oficina' && (
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da empresa *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors ${
              errors.businessName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ex: Auto Center Silva"
            disabled={loading}
          />
          {errors.businessName && (
            <p className="text-red-600 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
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

      {/* Telefone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors ${
            errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="(11) 99999-9999"
          disabled={loading}
        />
        {errors.phone && (
          <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      {/* CPF ou CNPJ */}
      <div>
        <label htmlFor={userType === 'motorista' ? 'cpf' : 'cnpj'} className="block text-sm font-medium text-gray-700 mb-1">
          {userType === 'motorista' ? 'CPF' : 'CNPJ'} *
        </label>
        <input
          type="text"
          id={userType === 'motorista' ? 'cpf' : 'cnpj'}
          name={userType === 'motorista' ? 'cpf' : 'cnpj'}
          value={userType === 'motorista' ? formData.cpf : formData.cnpj}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors ${
            errors[userType === 'motorista' ? 'cpf' : 'cnpj'] ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder={userType === 'motorista' ? '123.456.789-00' : '12.345.678/0001-00'}
          disabled={loading}
        />
        {errors[userType === 'motorista' ? 'cpf' : 'cnpj'] && (
          <p className="text-red-600 text-sm mt-1">{errors[userType === 'motorista' ? 'cpf' : 'cnpj']}</p>
        )}
      </div>

      {/* Senhas em grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Senha */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha *
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
              placeholder="Mínimo 6 caracteres"
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

        {/* Confirmar senha */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar senha *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#0047CC]/20 focus:border-[#0047CC] transition-colors ${
                errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Repita sua senha"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>
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
            <span className="ml-2">Criando conta...</span>
          </>
        ) : (
          'Criar conta'
        )}
      </button>

      {/* Link para login */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => {
              const event = new CustomEvent('switch-tab', { detail: 'login' });
              document.dispatchEvent(event);
            }}
            className="text-[#0047CC] hover:underline font-medium"
            disabled={loading}
          >
            Faça login
          </button>
        </p>
      </div>
    </form>
  );
} 
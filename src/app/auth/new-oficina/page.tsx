"use client"

import { useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline"
import Link from 'next/link'

export default function NewOficinaAuthPage() {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free')

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-700 to-red-700 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/auth" 
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Voltar
          </Link>
          
          <div className="mb-6">
            <div className="text-6xl mb-4">🔧</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Área da Oficina
            </h1>
            <p className="text-orange-100">
              Cadastre sua oficina e conecte-se com milhares de motoristas
            </p>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Free Plan */}
          <div 
            className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPlan === 'free' 
                ? 'ring-4 ring-white shadow-2xl' 
                : 'hover:bg-white shadow-xl'
            }`}
            onClick={() => setSelectedPlan('free')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Plano Gratuito</h3>
              {selectedPlan === 'free' && (
                <CheckIcon className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">R$ 0<span className="text-lg text-gray-600">/mês</span></div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                Até 10 agendamentos/mês
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                Chat básico com clientes
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                Dashboard básico
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div 
            className={`bg-white/95 backdrop-blur-sm rounded-2xl p-6 cursor-pointer transition-all ${
              selectedPlan === 'pro' 
                ? 'ring-4 ring-yellow-400 shadow-2xl' 
                : 'hover:bg-white shadow-xl'
            }`}
            onClick={() => setSelectedPlan('pro')}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Plano PRO</h3>
              {selectedPlan === 'pro' && (
                <CheckIcon className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">R$ 97<span className="text-lg text-gray-600">/mês</span></div>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                Agendamentos ilimitados
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                IA para diagnósticos
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                Analytics avançados
              </li>
              <li className="flex items-center">
                <CheckIcon className="h-4 w-4 text-green-600 mr-2" />
                Suporte prioritário
              </li>
            </ul>
          </div>
        </div>

        {/* Auth UI Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Continuar com Plano {selectedPlan === 'free' ? 'Gratuito' : 'PRO'}
            </h2>
            <p className="text-gray-600">
              {selectedPlan === 'free' 
                ? 'Comece grátis e faça upgrade quando quiser' 
                : 'Acesso completo a todas as funcionalidades'}
            </p>
          </div>

          <Auth
            supabaseClient={supabase!}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  background: selectedPlan === 'free' ? '#ea580c' : '#d97706',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontSize: '16px',
                  padding: '12px 24px',
                },
                anchor: {
                  color: selectedPlan === 'free' ? '#ea580c' : '#d97706',
                },
                input: {
                  borderRadius: '0.75rem',
                  fontSize: '16px',
                  padding: '12px 16px',
                }
              }
            }}
            providers={['google', 'facebook']}
            redirectTo={`${window.location.origin}/auth/callback?type=oficina&plan_type=${selectedPlan}`}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Continuar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre aqui'
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Criar Conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Continuar com {{provider}}',
                  link_text: 'Não tem conta? Cadastre-se'
                }
              }
            }}
          />
        </div>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <h3 className="text-white font-semibold mb-4">Benefícios para sua oficina</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-orange-100">
            <div className="flex items-center justify-center">
              <span className="mr-2">👥</span>
              Mais clientes
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">📈</span>
              Aumento no faturamento
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">⭐</span>
              Reputação online
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
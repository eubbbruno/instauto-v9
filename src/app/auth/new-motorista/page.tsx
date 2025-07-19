"use client"

import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import Link from 'next/link'

export default function NewMotoristaAuthPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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
            <div className="text-6xl mb-4">🚗</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Área do Motorista
            </h1>
            <p className="text-blue-100">
              Entre ou cadastre-se para encontrar as melhores oficinas
            </p>
          </div>
        </div>

        {/* Auth UI Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {mounted && <Auth
            supabaseClient={supabase!}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  background: '#1d4ed8',
                  color: 'white',
                  borderRadius: '0.75rem',
                  fontSize: '16px',
                  padding: '12px 24px',
                },
                anchor: {
                  color: '#1d4ed8',
                },
                input: {
                  borderRadius: '0.75rem',
                  fontSize: '16px',
                  padding: '12px 16px',
                }
              }
            }}
            providers={['google', 'facebook']}
            redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/new-callback?type=motorista` : '/auth/new-callback?type=motorista'}
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
          />}
        </div>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <h3 className="text-white font-semibold mb-4">Por que usar o InstAuto?</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-blue-100">
            <div className="flex items-center justify-center">
              <span className="mr-2">🔍</span>
              Encontre oficinas próximas e confiáveis
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">⭐</span>
              Avaliações reais de outros motoristas
            </div>
            <div className="flex items-center justify-center">
              <span className="mr-2">📱</span>
              Agende serviços direto pelo app
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
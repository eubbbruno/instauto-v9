"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// Componentes de formulário
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [userType, setUserType] = useState<"motorista" | "oficina">("motorista");
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // Ouvir eventos personalizados para alternar entre tabs
  useEffect(() => {
    const handleSwitchTab = (e: CustomEvent) => {
      if (e.detail === 'login' || e.detail === 'register') {
        setActiveTab(e.detail);
      }
    };

    // Adicionando event listener
    document.addEventListener('switch-tab', handleSwitchTab as EventListener);

    // Removendo event listener ao desmontar
    return () => {
      document.removeEventListener('switch-tab', handleSwitchTab as EventListener);
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true)
    setMessage('🔄 Redirecionando para Google...')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) throw error
      
      // Se chegou aqui sem erro, o redirect deve acontecer automaticamente
      console.log('OAuth iniciado:', data)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
      setLoading(false)
    }
  }

  const signInWithFacebook = async () => {
    setLoading(true)
    setMessage('🔄 Redirecionando para Facebook...')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      setMessage(`❌ Erro: ${errorMessage}`)
      setLoading(false)
    }
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setMessage(`✅ Logado como: ${user.email}`)
      setTimeout(() => router.push('/oficinas'), 1500)
    } else {
      setMessage('❌ Não logado')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setMessage('👋 Logout realizado!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚗 InstaAuto</h1>
          <p className="text-gray-600">Entre com sua conta social</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? '⏳ Carregando...' : 'Continuar com Google'}
          </button>

          <button
            onClick={signInWithFacebook}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {loading ? '⏳ Carregando...' : 'Continuar com Facebook'}
          </button>

          <div className="border-t pt-4">
            <div className="flex gap-2">
              <button
                onClick={checkUser}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm"
              >
                🔍 Verificar Status
              </button>
              
              <button
                onClick={signOut}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-sm">
            {message}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          🔒 Seus dados estão seguros e protegidos
        </div>
      </div>
    </div>
  );
} 
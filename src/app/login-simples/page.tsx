'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginSimplesPage() {
  const [email, setEmail] = useState('teste@instauto.com')
  const [password, setPassword] = useState('123456789')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const signUp = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Usuário Teste',
            user_type: 'workshop_owner'
          }
        }
      })

      if (error) throw error

      setMessage('✅ Usuário criado! Agora pode fazer login.')
      console.log('Usuário criado:', data)
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async () => {
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setMessage('✅ Login realizado com sucesso!')
      console.log('Login:', data)
      
      // Redirecionar para página de teste
      setTimeout(() => {
        router.push('/oficinas-supabase')
      }, 1000)
    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setMessage(user ? `✅ Logado como: ${user.email}` : '❌ Não logado')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">🔐 Login Simples</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={signUp}
              disabled={loading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳' : '📝 Criar Conta'}
            </button>
            
            <button
              onClick={signIn}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳' : '🚪 Entrar'}
            </button>
          </div>

          <button
            onClick={checkUser}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
          >
            🔍 Verificar Status
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          💡 Use o email/senha padrão ou crie uma nova conta
        </div>
      </div>
    </div>
  )
} 
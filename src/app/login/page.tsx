'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [userType, setUserType] = useState<'motorista' | 'oficina'>('motorista')
  const [oficinaPlano, setOficinaPlano] = useState<'free' | 'pro'>('free')
  const [loading, setLoading] = useState(false)
  
  const handleAuth = async () => {
    setLoading(true)
    
    try {
      if (isSignUp) {
        // Criar conta
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { user_type: userType }
          }
        })
        
        if (error) {
          alert('Erro ao criar conta: ' + error.message)
          return
        }
        
        if (data?.user) {
          // Criar profile
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            type: userType
          })
          
          if (profileError) {
            alert('Erro ao criar profile: ' + profileError.message)
            return
          }
          
          if (userType === 'oficina') {
            alert(`🎉 Conta OFICINA criada!\nPlano: ${oficinaPlano.toUpperCase()}\n\nFaça login para acessar!`)
          } else {
            alert('🚗 Conta MOTORISTA criada! Faça login.')
          }
          setIsSignUp(false)
        }
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) {
          alert('Erro no login: ' + error.message)
          return
        }
        
        if (data?.user) {
          console.log('✅ Login realizado:', data.user.email)
          
          // Buscar profile para redirecionamento inteligente
          const { data: profile } = await supabase
            .from('profiles')
            .select('type')
            .eq('id', data.user.id)
            .single()
          
          if (profile?.type === 'motorista') {
            window.location.href = '/motorista'
          } else if (profile?.type === 'oficina') {
            // Por enquanto sempre FREE, depois implementar lógica de plano
            window.location.href = '/oficina-free'
          } else {
            window.location.href = '/dashboard'
          }
        }
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro inesperado!')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? 'Criar Conta' : 'Login'}
        </h1>
        
        {isSignUp && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de conta:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('motorista')}
                  className={`p-3 rounded-md border-2 transition-all ${
                    userType === 'motorista' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🚗 Motorista
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('oficina')}
                  className={`p-3 rounded-md border-2 transition-all ${
                    userType === 'oficina' 
                      ? 'bg-green-50 border-green-500 text-green-700' 
                      : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  🔧 Oficina
                </button>
              </div>
            </div>
            
            {userType === 'oficina' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escolha seu plano:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOficinaPlano('free')}
                    className={`p-4 rounded-md border-2 transition-all ${
                      oficinaPlano === 'free' 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🆓</div>
                      <div className="font-bold text-green-600">FREE</div>
                      <div className="text-xs text-gray-500">Até 10 clientes</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOficinaPlano('pro')}
                    className={`p-4 rounded-md border-2 transition-all ${
                      oficinaPlano === 'pro' 
                        ? 'bg-yellow-50 border-yellow-500' 
                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">💎</div>
                      <div className="font-bold text-yellow-600">PRO</div>
                      <div className="text-xs text-gray-500">R$ 99/mês</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button 
          onClick={handleAuth}
          disabled={loading || !email || !password}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
        >
          {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
        </button>
        
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-blue-600 hover:text-blue-800 underline"
        >
          {isSignUp ? 'Já tenho conta' : 'Criar nova conta'}
        </button>
      </div>
    </div>
  )
}
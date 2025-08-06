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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.3]"></div>
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-400/10 rounded-full blur-[100px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-[120px]"></div>

      <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 relative z-10">
        {/* Header com logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Junte-se à plataforma InstaAuto' : 'Faça login na sua conta'}
          </p>
        </div>
        
        {isSignUp && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Escolha o tipo de conta:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('motorista')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    userType === 'motorista' 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-500 text-blue-700 shadow-lg transform scale-105' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🚗</div>
                  <div className="font-semibold">Motorista</div>
                  <div className="text-xs opacity-75">Encontre oficinas</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('oficina')}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    userType === 'oficina' 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-500 text-green-700 shadow-lg transform scale-105' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🔧</div>
                  <div className="font-semibold">Oficina</div>
                  <div className="text-xs opacity-75">Gerencie clientes</div>
                </button>
              </div>
            </div>
            
            {userType === 'oficina' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Selecione seu plano:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOficinaPlano('free')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      oficinaPlano === 'free' 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-500 shadow-lg transform scale-105' 
                        : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🆓</div>
                      <div className={`font-bold ${oficinaPlano === 'free' ? 'text-green-700' : 'text-gray-600'}`}>FREE</div>
                      <div className="text-xs text-gray-500 mt-1">Até 10 clientes</div>
                      <div className="text-xs text-gray-500">30 ordens/mês</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOficinaPlano('pro')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 relative ${
                      oficinaPlano === 'pro' 
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-500 shadow-lg transform scale-105' 
                        : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      POPULAR
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-2">💎</div>
                      <div className={`font-bold ${oficinaPlano === 'pro' ? 'text-yellow-700' : 'text-gray-600'}`}>PRO</div>
                      <div className="text-xs text-gray-500 mt-1">Clientes ilimitados</div>
                      <div className="text-xs text-green-600 font-semibold">R$ 99/mês</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        <div className="space-y-4 mb-6">
          <div>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              required
            />
          </div>
        </div>
        
        <button 
          onClick={handleAuth}
          disabled={loading || !email || !password}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed mb-4 font-semibold shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processando...
            </div>
          ) : (
            isSignUp ? 'Criar Conta' : 'Entrar na Plataforma'
          )}
        </button>
        
        <div className="text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            {isSignUp ? (
              <>Já tem uma conta? <span className="text-blue-600 hover:underline">Faça login</span></>
            ) : (
              <>Não tem conta? <span className="text-blue-600 hover:underline">Criar nova conta</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
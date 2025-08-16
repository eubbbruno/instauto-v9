'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestAuthSimple() {
  const [email, setEmail] = useState('admin@instauto.com.br')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [profileTest, setProfileTest] = useState<any>(null)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🔄 Testando login simples...')
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setResult({ error: error.message, type: 'error' })
        return
      }
      
      // Buscar profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      setResult({
        user: data.user,
        profile: profile,
        profileError: profileError?.message,
        type: 'success'
      })
      
    } catch (error: any) {
      setResult({ error: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const testProfile = async () => {
    setLoading(true)
    setProfileTest(null)
    
    try {
      console.log('🔍 Testando profile com service_role...')
      
      const response = await fetch('/api/test-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '4c7a55d9-b3e9-40f9-8755-df07fa7eb689' })
      })
      
      const data = await response.json()
      setProfileTest(data)
      
    } catch (error: any) {
      setProfileTest({ error: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      console.log('🔄 Testando signup simples...')
      
      const { data, error } = await supabase.auth.signUp({
        email: 'teste@exemplo.com',
        password: '123456',
        options: {
          data: {
            user_type: 'motorista',
            name: 'Teste Usuario'
          }
        }
      })
      
      setResult({
        user: data.user,
        session: data.session,
        error: error?.message,
        type: error ? 'error' : 'success'
      })
      
    } catch (error: any) {
      setResult({ error: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Debug Auth Simples</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Testando...' : 'Testar Login'}
            </button>
            
            <button
              onClick={testProfile}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Testando...' : 'Testar Profile (Admin)'}
            </button>
            
            <button
              onClick={testSignup}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Testando...' : 'Testar Signup'}
            </button>
          </div>
        </div>
        
        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            result.type === 'error' ? 'bg-red-100 border-red-300' : 'bg-green-100 border-green-300'
          } border`}>
            <h3 className="font-bold mb-2">
              {result.type === 'error' ? '❌ Erro Login' : '✅ Sucesso Login'}
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        {profileTest && (
          <div className={`mt-6 p-4 rounded-lg ${
            profileTest.success ? 'bg-blue-100 border-blue-300' : 'bg-red-100 border-red-300'
          } border`}>
            <h3 className="font-bold mb-2">
              {profileTest.success ? '🔍 Teste Profile (Admin)' : '❌ Erro Profile Test'}
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(profileTest, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

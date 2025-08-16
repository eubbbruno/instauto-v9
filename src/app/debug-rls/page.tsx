'use client'

import { useState } from 'react'

export default function DebugRLS() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fixRLS = async () => {
    setResults([])
    setLoading(true)
    
    try {
      const response = await fetch('/api/debug-rls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'fix-rls' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
      } else {
        setResults([{
          step: 'Erro na API',
          success: false,
          error: data.error
        }])
      }
    } catch (error: any) {
      setResults([{
        step: 'Erro de conexão',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  const fixAnonRLS = async () => {
    setResults([])
    setLoading(true)
    
    try {
      const response = await fetch('/api/fix-anon-rls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'fix-anon-rls' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
      } else {
        setResults([{
          step: 'Erro na API Anon',
          success: false,
          error: data.error
        }])
      }
    } catch (error: any) {
      setResults([{
        step: 'Erro de conexão Anon',
        success: false,
        error: error.message
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Debug RLS - Correção Automática</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Executar Correção RLS</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={fixRLS}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '⏳ Executando...' : '🚀 Corrigir RLS Base'}
            </button>
            
            <button
              onClick={fixAnonRLS}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '⏳ Executando...' : '🔑 Corrigir RLS Anon/Auth'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>RLS Base:</strong> Cria estrutura básica das políticas</p>
            <p><strong>RLS Anon/Auth:</strong> Corrige políticas para anon e authenticated funcionarem</p>
          </div>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? '✅' : '❌'} {result.step}
              </h3>
              
              {result.error && (
                <p className="text-red-600 mt-2 font-mono text-sm">
                  {result.error}
                </p>
              )}
              
              {result.data && (
                <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

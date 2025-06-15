'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestInsertPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const insertTestData = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Inserir dados de teste diretamente
      const { data, error } = await supabase
        .from('workshops')
        .insert([
          {
            business_name: 'Oficina Teste 1',
            address: {
              rua: 'Rua Teste, 123',
              bairro: 'Centro',
              cidade: 'São Paulo',
              cep: '01000-000',
              lat: -23.5505,
              lng: -46.6333
            },
            services: ['Mecânica Geral', 'Troca de Óleo'],
            specialties: ['Honda', 'Toyota'],
            rating: 4.5,
            total_reviews: 10,
            verified: true,
            opening_hours: {
              segunda: '08:00 - 18:00',
              sabado: '08:00 - 14:00',
              domingo: 'Fechado'
            },
            price_range: '$$'
          }
        ])
        .select()

      if (error) throw error

      setResult(data)
      console.log('✅ Dados inseridos:', data)
    } catch (err: any) {
      setError(err.message)
      console.error('❌ Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkshops = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('workshops')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setResult(data)
      console.log('📋 Workshops encontrados:', data)
    } catch (err: any) {
      setError(err.message)
      console.error('❌ Erro ao buscar:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearWorkshops = async () => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

      if (error) throw error

      setResult('Todos os workshops foram removidos')
      console.log('🗑️ Workshops removidos')
    } catch (err: any) {
      setError(err.message)
      console.error('❌ Erro ao limpar:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧪 Teste de Inserção - Supabase</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ações</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={insertTestData}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Inserindo...' : '➕ Inserir Dados de Teste'}
            </button>
            
            <button
              onClick={fetchWorkshops}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Buscando...' : '📋 Buscar Workshops'}
            </button>
            
            <button
              onClick={clearWorkshops}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Limpando...' : '🗑️ Limpar Todos'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>❌ Erro:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Resultado</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 
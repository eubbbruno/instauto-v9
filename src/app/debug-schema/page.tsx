'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugSchemaPage() {
  const [tableInfo, setTableInfo] = useState<any>(null)
  const [constraints, setConstraints] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkSchema()
  }, [])

  const checkSchema = async () => {
    try {
      // Verificar se a tabela existe e sua estrutura
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('*')
        .eq('table_name', 'workshops')

      if (tablesError) throw tablesError

      // Verificar colunas da tabela
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('*')
        .eq('table_name', 'workshops')
        .order('ordinal_position')

      if (columnsError) throw columnsError

      setTableInfo({ tables, columns })

      // Tentar uma inserção simples para ver o erro específico
      const { data, error: insertError } = await supabase
        .from('workshops')
        .insert([{
          business_name: 'Teste Simples',
          address: { rua: 'Teste' },
          services: ['Teste'],
          specialties: ['Teste'],
          rating: 4.0,
          total_reviews: 1,
          verified: false,
          opening_hours: { segunda: '08:00-18:00' },
          price_range: '$'
        }])
        .select()

      if (insertError) {
        setError(`Erro de inserção: ${insertError.message}`)
      } else {
        setError('Inserção funcionou! Dados: ' + JSON.stringify(data))
      }

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testDirectInsert = async () => {
    try {
      // Teste com dados mínimos
      const { data, error } = await supabase
        .from('workshops')
        .insert({
          business_name: 'Oficina Teste Direto'
        })
        .select()

      if (error) {
        setError(`Erro inserção direta: ${error.message}`)
      } else {
        setError(`✅ Sucesso inserção direta: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setError(`Erro catch: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">⏳ Verificando schema...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug Schema - Workshops</h1>
        
        <button
          onClick={testDirectInsert}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mb-6"
        >
          🧪 Teste Inserção Direta
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>⚠️ Status:</strong> {error}
          </div>
        )}

        {tableInfo && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Informações da Tabela</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(tableInfo.tables, null, 2)}
              </pre>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">🏗️ Colunas da Tabela</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Nome</th>
                      <th className="px-4 py-2 text-left">Tipo</th>
                      <th className="px-4 py-2 text-left">Nulo?</th>
                      <th className="px-4 py-2 text-left">Padrão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableInfo.columns?.map((col: any, idx: number) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-2 font-mono">{col.column_name}</td>
                        <td className="px-4 py-2">{col.data_type}</td>
                        <td className="px-4 py-2">{col.is_nullable}</td>
                        <td className="px-4 py-2 text-sm">{col.column_default || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
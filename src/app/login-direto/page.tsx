'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginDiretoPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const criarDadosDireto = async () => {
    setLoading(true)
    setMessage('🔄 Criando dados de teste...')

    try {
      // Criar um ID fixo para teste
      const testUserId = '12345678-1234-1234-1234-123456789012'
      
      // 1. Primeiro criar o profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: testUserId,
          full_name: 'Oficina Teste',
          user_type: 'workshop_owner'
        })
        .select()

      if (profileError) {
        console.log('Profile já existe ou erro:', profileError)
      }

      // 2. Criar as oficinas
      const oficinas = [
        {
          profile_id: testUserId,
          business_name: 'Auto Centro Silva',
          address: {
            rua: 'Rua das Oficinas, 123',
            bairro: 'Vila Madalena',
            cidade: 'São Paulo',
            cep: '05014-000',
            lat: -23.5505,
            lng: -46.6333
          },
          services: ['Mecânica Geral', 'Elétrica Automotiva', 'Troca de Óleo'],
          specialties: ['Honda', 'Toyota', 'Ford'],
          rating: 4.8,
          total_reviews: 156,
          verified: true,
          opening_hours: {
            segunda: '08:00 - 18:00',
            sabado: '08:00 - 14:00',
            domingo: 'Fechado'
          },
          price_range: '$$'
        },
        {
          profile_id: testUserId,
          business_name: 'Oficina Costa & Cia',
          address: {
            rua: 'Av. Principal, 456',
            bairro: 'Pinheiros',
            cidade: 'São Paulo',
            cep: '05422-000',
            lat: -23.5629,
            lng: -46.6825
          },
          services: ['Revisão Preventiva', 'Troca de Óleo', 'Sistema de Freios'],
          specialties: ['Volkswagen', 'Fiat', 'Renault'],
          rating: 4.5,
          total_reviews: 89,
          verified: true,
          opening_hours: {
            segunda: '07:00 - 17:00',
            sabado: '07:00 - 12:00',
            domingo: 'Fechado'
          },
          price_range: '$'
        },
        {
          profile_id: testUserId,
          business_name: 'MegaAuto Especializada',
          address: {
            rua: 'Rua dos Mecânicos, 789',
            bairro: 'Moema',
            cidade: 'São Paulo',
            cep: '04077-000',
            lat: -23.5893,
            lng: -46.6658
          },
          services: ['Mecânica Geral', 'Diagnóstico Computadorizado', 'Injeção Eletrônica'],
          specialties: ['BMW', 'Audi', 'Mercedes'],
          rating: 4.9,
          total_reviews: 203,
          verified: true,
          opening_hours: {
            segunda: '08:00 - 19:00',
            sabado: '08:00 - 16:00',
            domingo: '09:00 - 14:00'
          },
          price_range: '$$$'
        }
      ]

      const { data: workshops, error: workshopsError } = await supabase
        .from('workshops')
        .upsert(oficinas)
        .select()

      if (workshopsError) throw workshopsError

      setMessage(`✅ Sucesso! ${workshops.length} oficinas criadas!`)
      console.log('Oficinas criadas:', workshops)

      // Redirecionar para ver o resultado
      setTimeout(() => {
        router.push('/oficinas-supabase')
      }, 2000)

    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
      console.error('Erro completo:', error)
    } finally {
      setLoading(false)
    }
  }

  const verificarDados = async () => {
    setLoading(true)
    setMessage('🔍 Verificando dados...')

    try {
      const { data: workshops, error } = await supabase
        .from('workshops')
        .select('*')

      if (error) throw error

      setMessage(`📊 Encontradas ${workshops.length} oficinas no banco`)
      console.log('Workshops encontrados:', workshops)
    } catch (error: any) {
      setMessage(`❌ Erro ao verificar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const limparDados = async () => {
    setLoading(true)
    setMessage('🗑️ Limpando dados...')

    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')

      if (error) throw error

      setMessage('✅ Dados limpos!')
    } catch (error: any) {
      setMessage(`❌ Erro ao limpar: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🚀 Criação Direta de Dados</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <p className="mb-6 text-gray-600">
            Vamos criar os dados diretamente no banco, sem precisar de autenticação complicada!
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={criarDadosDireto}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Criando...' : '🏪 Criar Oficinas'}
            </button>
            
            <button
              onClick={verificarDados}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Verificando...' : '🔍 Verificar Dados'}
            </button>
            
            <button
              onClick={limparDados}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Limpando...' : '🗑️ Limpar Tudo'}
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded mb-6">
            {message}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">💡 Como funciona:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Cria um profile de teste com ID fixo</li>
            <li>Cria 3 oficinas vinculadas a esse profile</li>
            <li>Não precisa de autenticação real</li>
            <li>Depois vá para <code>/oficinas-supabase</code> para ver</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 
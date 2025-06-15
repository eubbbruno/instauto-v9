'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CriarOficinaPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (!user) {
      setMessage('❌ Você precisa estar logado! Redirecionando...')
      setTimeout(() => router.push('/login-simples'), 2000)
    }
  }

  const criarOficina = async () => {
    if (!user) return

    setLoading(true)
    setMessage('')

    try {
      // Primeiro, criar o profile se não existir
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: 'Oficina Teste',
          user_type: 'workshop_owner'
        })
        .select()

      if (profileError) throw profileError

      // Agora criar a oficina
      const { data: workshop, error: workshopError } = await supabase
        .from('workshops')
        .insert({
          profile_id: user.id,
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
        })
        .select()

      if (workshopError) throw workshopError

      setMessage('✅ Oficina criada com sucesso!')
      console.log('Oficina criada:', workshop)

      // Redirecionar para ver as oficinas
      setTimeout(() => {
        router.push('/oficinas-supabase')
      }, 2000)

    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const criarMaisOficinas = async () => {
    if (!user) return

    setLoading(true)
    setMessage('Criando várias oficinas...')

    try {
      const oficinas = [
        {
          profile_id: user.id,
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
          profile_id: user.id,
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

      const { data, error } = await supabase
        .from('workshops')
        .insert(oficinas)
        .select()

      if (error) throw error

      setMessage(`✅ ${data.length} oficinas criadas com sucesso!`)
      console.log('Oficinas criadas:', data)

    } catch (error: any) {
      setMessage(`❌ Erro: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">🔐 Verificando autenticação...</div>
          {message && <div className="text-red-600">{message}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🏪 Criar Oficinas de Teste</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <strong>👤 Usuário logado:</strong> {user.email}
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={criarOficina}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Criando...' : '🏪 Criar 1 Oficina'}
            </button>
            
            <button
              onClick={criarMaisOficinas}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? '⏳ Criando...' : '🏪 Criar 3 Oficinas'}
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-gray-100 border-l-4 border-blue-500 p-4 rounded">
            {message}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">💡 Como usar:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Primeiro faça login em <code>/login-simples</code></li>
            <li>Depois volte aqui para criar as oficinas</li>
            <li>Vá para <code>/oficinas-supabase</code> para ver o resultado</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 
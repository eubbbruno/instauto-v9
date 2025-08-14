'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  UserGroupIcon,
  UserIcon,
  BuildingStorefrontIcon,
  ShieldCheckIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

// Definir os usuários demo
const DEMO_USERS = [
  {
    id: 'motorista',
    email: 'motorista.demo@instauto.com.br',
    password: 'InstaAuto2025!',
    name: 'João Silva - Motorista Demo',
    type: 'motorista',
    icon: UserIcon,
    color: 'blue',
    description: 'Usuário motorista para testar funcionalidades de busca, agendamentos e avaliações',
    redirectTo: '/motorista'
  },
  {
    id: 'oficina-free',
    email: 'oficina.free@instauto.com.br',
    password: 'InstaAuto2025!',
    name: 'Mecânica do José - FREE Demo',
    type: 'workshop_owner',
    planType: 'free',
    icon: BuildingStorefrontIcon,
    color: 'green',
    description: 'Oficina com plano FREE para testar recursos básicos e limitações',
    redirectTo: '/oficina-free',
    workshopData: {
      business_name: 'Mecânica do José - FREE Demo',
      address: {
        rua: 'Rua das Flores, 123',
        numero: '123',
        bairro: 'Vila Madalena',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '05014-000',
        lat: -23.5505,
        lng: -46.6333
      },
      phone: '(11) 98765-4321',
      description: 'Oficina familiar com mais de 15 anos de experiência. Ideal para demonstração do plano FREE.',
      services: ['Mecânica Geral', 'Troca de Óleo', 'Sistema de Freios', 'Alinhamento e Balanceamento'],
      specialties: ['Volkswagen', 'Fiat', 'Ford'],
      rating: 4.3,
      total_reviews: 87,
      verified: true,
      plan_type: 'free',
      price_range: '$',
      whatsapp: '(11) 98765-4321'
    }
  },
  {
    id: 'oficina-pro',
    email: 'oficina.pro@instauto.com.br',
    password: 'InstaAuto2025!',
    name: 'AutoCenter Premium - PRO Demo',
    type: 'workshop_owner',
    planType: 'pro',
    icon: BuildingStorefrontIcon,
    color: 'purple',
    description: 'Oficina com plano PRO e trial ativo para testar todos os recursos premium',
    redirectTo: '/oficina-pro',
    workshopData: {
      business_name: 'AutoCenter Premium - PRO Demo',
      address: {
        rua: 'Av. Paulista, 1500',
        numero: '1500',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01310-100',
        lat: -23.5614,
        lng: -46.6558
      },
      phone: '(11) 91234-5678',
      description: 'Centro automotivo premium com tecnologia de ponta. Demonstração completa dos recursos PRO.',
      services: ['Mecânica Geral', 'Diagnóstico Computadorizado', 'Injeção Eletrônica', 'Ar Condicionado', 'Sistema de Freios', 'Motor', 'Câmbio', 'Elétrica Automotiva'],
      specialties: ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Honda', 'Toyota'],
      rating: 4.8,
      total_reviews: 234,
      verified: true,
      plan_type: 'pro',
      is_trial: true,
      price_range: '$$',
      whatsapp: '(11) 91234-5678',
      website: 'https://autocenterpremium.com.br'
    }
  },
  {
    id: 'admin',
    email: 'admin.demo@instauto.com.br',
    password: 'InstaAuto2025!',
    name: 'Admin InstaAuto - Demo',
    type: 'admin',
    icon: ShieldCheckIcon,
    color: 'red',
    description: 'Usuário administrador para testar painel admin e gestão de oficinas',
    redirectTo: '/admin'
  }
]

export default function DemoUsersPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ [key: string]: { success: boolean; message: string; userId?: string } }>({})
  const [showPasswords, setShowPasswords] = useState(false)

  const createDemoUser = async (user: typeof DEMO_USERS[0]) => {
    try {
      console.log(`🔄 Criando usuário demo: ${user.email}`)

      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { user_type: user.type }
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Usuário não foi criado')
      }

      const userId = authData.user.id

      // Criar profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: user.email,
          full_name: user.name,
          type: user.type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) throw profileError

      // Se for oficina, criar workshop
      if (user.type === 'workshop_owner' && user.workshopData) {
        const workshopData = {
          ...user.workshopData,
          id: userId,
          profile_id: userId,
          email: user.email,
          opening_hours: {
            segunda: '08:00 - 18:00',
            terca: '08:00 - 18:00',
            quarta: '08:00 - 18:00',
            quinta: '08:00 - 18:00',
            sexta: '08:00 - 18:00',
            sabado: '08:00 - 14:00',
            domingo: 'Fechado'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Se for PRO com trial, adicionar data de expiração
        if (user.planType === 'pro') {
          const trialEndDate = new Date()
          trialEndDate.setDate(trialEndDate.getDate() + 5) // 5 dias para demo
          workshopData.trial_ends_at = trialEndDate.toISOString()
        }

        const { error: workshopError } = await supabase
          .from('workshops')
          .insert(workshopData)

        if (workshopError) throw workshopError
      }

      return { success: true, message: 'Usuário criado com sucesso!', userId }

    } catch (error: any) {
      console.error(`❌ Erro ao criar ${user.email}:`, error)
      return { success: false, message: error.message }
    }
  }

  const handleCreateAllUsers = async () => {
    setLoading(true)
    setResults({})

    for (const user of DEMO_USERS) {
      const result = await createDemoUser(user)
      setResults(prev => ({ ...prev, [user.id]: result }))
      
      // Pequena pausa entre criações
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setLoading(false)
  }

  const handleCreateSingleUser = async (user: typeof DEMO_USERS[0]) => {
    setLoading(true)
    const result = await createDemoUser(user)
    setResults(prev => ({ ...prev, [user.id]: result }))
    setLoading(false)
  }

  const copyCredentials = () => {
    const credentials = DEMO_USERS.map(user => 
      `${user.name}:\n  Email: ${user.email}\n  Senha: ${user.password}\n  Acesso: ${user.redirectTo}\n`
    ).join('\n')

    navigator.clipboard.writeText(credentials)
    alert('Credenciais copiadas para a área de transferência!')
  }

  const allUsersCreated = DEMO_USERS.every(user => results[user.id]?.success)
  const hasErrors = Object.values(results).some(result => result && !result.success)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar ao Painel Admin
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Usuários Demo para Testes
          </h1>
          <p className="text-gray-600">
            Crie usuários pré-configurados para testar todas as funcionalidades do sistema
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <ClipboardDocumentIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Instruções:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Os usuários serão criados automaticamente no Supabase Authentication</li>
                <li>• Senhas seguras já configuradas para todos os usuários</li>
                <li>• Oficinas PRO incluem trial de 5 dias ativo para demonstração</li>
                <li>• Todos os dados são realistas e prontos para uso</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4">
              <button
                onClick={handleCreateAllUsers}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <UserGroupIcon className="h-5 w-5" />
                {loading ? 'Criando...' : 'Criar Todos os Usuários'}
              </button>

              <button
                onClick={copyCredentials}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
                Copiar Credenciais
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-gray-600 hover:text-gray-800 p-2"
                title={showPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}
              >
                {showPasswords ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_USERS.map((user) => {
            const Icon = user.icon
            const result = results[user.id]
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg bg-${user.color}-100`}>
                      <Icon className={`h-6 w-6 text-${user.color}-600`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className={`text-sm px-2 py-1 rounded-full bg-${user.color}-100 text-${user.color}-800 inline-block mt-1`}>
                        {user.type === 'motorista' ? 'Motorista' : 
                         user.type === 'admin' ? 'Administrador' :
                         `Oficina ${user.planType?.toUpperCase()}`}
                      </p>
                    </div>
                  </div>

                  {result && (
                    <div className="flex items-center">
                      {result.success ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4">{user.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Senha:</span>
                    <span className="text-sm text-gray-600 font-mono">
                      {showPasswords ? user.password : '••••••••••••'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Acesso:</span>
                    <span className="text-sm text-blue-600">{user.redirectTo}</span>
                  </div>
                </div>

                {result && (
                  <div className={`p-3 rounded-lg mb-4 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                      {result.message}
                    </p>
                    {result.userId && (
                      <p className="text-xs text-gray-600 mt-1">
                        ID: {result.userId}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCreateSingleUser(user)}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm ${
                      result?.success 
                        ? 'bg-gray-100 text-gray-600' 
                        : `bg-${user.color}-600 text-white hover:bg-${user.color}-700`
                    } disabled:opacity-50`}
                  >
                    {result?.success ? 'Criado' : loading ? 'Criando...' : 'Criar Usuário'}
                  </button>

                  {result?.success && (
                    <a
                      href={user.redirectTo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg bg-${user.color}-100 text-${user.color}-700 hover:bg-${user.color}-200 transition-colors text-sm`}
                    >
                      Testar
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Results Summary */}
        {Object.keys(results).length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Criação</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {DEMO_USERS.length}
                </div>
                <div className="text-sm text-blue-700">Total de Usuários</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(results).filter(r => r?.success).length}
                </div>
                <div className="text-sm text-green-700">Criados com Sucesso</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(results).filter(r => r && !r.success).length}
                </div>
                <div className="text-sm text-red-700">Erros</div>
              </div>
            </div>

            {allUsersCreated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="font-medium">Todos os usuários demo foram criados com sucesso!</span>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  Você pode agora testar todas as funcionalidades do sistema com as credenciais criadas.
                </p>
              </div>
            )}

            {hasErrors && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="font-medium">Alguns usuários não puderam ser criados</span>
                </div>
                <p className="text-red-700 text-sm mt-2">
                  Verifique os erros específicos acima e tente novamente.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Credentials Card */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Credenciais para Testes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DEMO_USERS.map((user) => (
              <div key={user.id} className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{user.name}</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Senha:</strong> <code className="bg-gray-100 px-1 rounded">{user.password}</code></div>
                  <div><strong>Acesso:</strong> <a href={user.redirectTo} className="text-blue-600 hover:underline">{user.redirectTo}</a></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

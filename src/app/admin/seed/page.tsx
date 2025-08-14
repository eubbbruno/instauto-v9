'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'

// Dados das oficinas reais para seed
const OFICINAS_SEED = [
  // São Paulo
  {
    business_name: "Auto Center Silva",
    address: {
      rua: "Av. Paulista, 1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
      lat: -23.5614,
      lng: -46.6558
    },
    phone: "(11) 3251-4000",
    email: "contato@autocentrosilva.com.br",
    description: "Oficina especializada em carros nacionais e importados com mais de 20 anos de experiência.",
    services: ["Mecânica Geral", "Elétrica Automotiva", "Troca de Óleo", "Diagnóstico Computadorizado"],
    specialties: ["Volkswagen", "Fiat", "Ford", "Chevrolet"],
    rating: 4.5,
    total_reviews: 127,
    verified: true,
    plan_type: "pro",
    price_range: "$$",
    whatsapp: "(11) 99999-1000"
  },
  {
    business_name: "Mecânica do João",
    address: {
      rua: "Rua Augusta, 2500",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01412-100",
      lat: -23.5506,
      lng: -46.6653
    },
    phone: "(11) 3123-5000",
    email: "joao@mecanicadojoao.com.br",
    description: "Oficina familiar com atendimento personalizado e preços justos.",
    services: ["Mecânica Geral", "Sistema de Freios", "Suspensão", "Alinhamento e Balanceamento"],
    specialties: ["Honda", "Toyota", "Nissan"],
    rating: 4.8,
    total_reviews: 89,
    verified: true,
    plan_type: "free",
    price_range: "$"
  },
  {
    business_name: "Premium Auto Service",
    address: {
      rua: "Av. Faria Lima, 3000",
      bairro: "Itaim Bibi",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04538-132",
      lat: -23.5781,
      lng: -46.6890
    },
    phone: "(11) 3078-9000",
    email: "atendimento@premiumauto.com.br",
    description: "Centro automotivo premium especializado em veículos de luxo.",
    services: ["Mecânica Geral", "Diagnóstico Computadorizado", "Ar Condicionado", "Injeção Eletrônica"],
    specialties: ["BMW", "Audi", "Mercedes-Benz", "Volvo"],
    rating: 4.9,
    total_reviews: 245,
    verified: true,
    plan_type: "pro",
    price_range: "$$$",
    whatsapp: "(11) 99999-3000",
    website: "https://www.premiumauto.com.br"
  },

  // Rio de Janeiro
  {
    business_name: "Oficina Carioca",
    address: {
      rua: "Av. Copacabana, 500",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22020-000",
      lat: -22.9068,
      lng: -43.1729
    },
    phone: "(21) 2547-8000",
    email: "contato@oficinacarioca.com.br",
    description: "Tradição e qualidade no coração de Copacabana há 30 anos.",
    services: ["Mecânica Geral", "Elétrica Automotiva", "Motor", "Câmbio"],
    specialties: ["Volkswagen", "Fiat", "Renault", "Peugeot"],
    rating: 4.3,
    total_reviews: 156,
    verified: true,
    plan_type: "pro",
    price_range: "$$"
  },
  {
    business_name: "Auto Repair RJ",
    address: {
      rua: "Rua do Catete, 200",
      bairro: "Catete",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      cep: "22220-000",
      lat: -22.9197,
      lng: -43.1775
    },
    phone: "(21) 2558-7000",
    email: "info@autorepairrj.com.br",
    description: "Especialistas em importados com equipamentos de última geração.",
    services: ["Diagnóstico Computadorizado", "Ar Condicionado", "Injeção Eletrônica", "Sistema de Freios"],
    specialties: ["Honda", "Toyota", "Hyundai", "Nissan"],
    rating: 4.6,
    total_reviews: 201,
    verified: true,
    plan_type: "free",
    price_range: "$$"
  },

  // Londrina, PR
  {
    business_name: "Mecânica Londrina",
    address: {
      rua: "Av. Higienópolis, 1000",
      bairro: "Centro",
      cidade: "Londrina",
      estado: "PR",
      cep: "86020-911",
      lat: -23.3045,
      lng: -51.1696
    },
    phone: "(43) 3325-4000",
    email: "atendimento@mecaniclondrina.com.br",
    description: "A oficina mais tradicional de Londrina, atendendo a região há 25 anos.",
    services: ["Mecânica Geral", "Troca de Óleo", "Revisão Preventiva", "Alinhamento e Balanceamento"],
    specialties: ["Volkswagen", "Fiat", "Ford", "Chevrolet"],
    rating: 4.4,
    total_reviews: 98,
    verified: true,
    plan_type: "pro",
    price_range: "$"
  },
  {
    business_name: "Auto Center Norte",
    address: {
      rua: "Rua Pará, 500",
      bairro: "Zona Norte",
      cidade: "Londrina",
      estado: "PR",
      cep: "86041-140",
      lat: -23.2908,
      lng: -51.1789
    },
    phone: "(43) 3346-7000",
    email: "contato@autocentronorte.com.br",
    description: "Oficina moderna com foco em atendimento rápido e eficiente.",
    services: ["Sistema de Freios", "Suspensão", "Diagnóstico Computadorizado", "Elétrica Automotiva"],
    specialties: ["Honda", "Toyota", "Hyundai"],
    rating: 4.7,
    total_reviews: 112,
    verified: true,
    plan_type: "free",
    price_range: "$$"
  },

  // Itapema, SC
  {
    business_name: "Oficina Litoral",
    address: {
      rua: "Av. Osvaldo Reis, 300",
      bairro: "Centro",
      cidade: "Itapema",
      estado: "SC",
      cep: "88220-000",
      lat: -27.0897,
      lng: -48.6114
    },
    phone: "(47) 3368-2000",
    email: "contato@oficinalitoral.com.br",
    description: "Oficina à beira-mar especializada em veículos de turismo e locais.",
    services: ["Mecânica Geral", "Ar Condicionado", "Lavagem e Enceramento", "Troca de Óleo"],
    specialties: ["Volkswagen", "Fiat", "Renault", "Citroën"],
    rating: 4.2,
    total_reviews: 67,
    verified: true,
    plan_type: "free",
    price_range: "$"
  },
  {
    business_name: "Beach Auto Service",
    address: {
      rua: "Rua João Pessoa, 150",
      bairro: "Meia Praia",
      cidade: "Itapema",
      estado: "SC",
      cep: "88220-000",
      lat: -27.0681,
      lng: -48.6289
    },
    phone: "(47) 3368-5000",
    email: "beach@beachautoservice.com.br",
    description: "Cuidamos do seu carro enquanto você aproveita a praia!",
    services: ["Troca de Óleo", "Revisão Preventiva", "Sistema de Freios", "Alinhamento e Balanceamento"],
    specialties: ["Honda", "Toyota", "Nissan", "Hyundai"],
    rating: 4.5,
    total_reviews: 84,
    verified: true,
    plan_type: "pro",
    price_range: "$$",
    whatsapp: "(47) 99999-5000"
  }
]

export default function SeedOficinasPage() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{ success: number; errors: string[] }>({ success: 0, errors: [] })
  const [completed, setCompleted] = useState(false)

  const handleSeedOficinas = async () => {
    setLoading(true)
    setProgress(0)
    setResults({ success: 0, errors: [] })
    setCompleted(false)

    try {
      let successCount = 0
      const errors: string[] = []

      for (let i = 0; i < OFICINAS_SEED.length; i++) {
        const oficina = OFICINAS_SEED[i]
        
        try {
          // Criar usuário fictício para a oficina
          const tempEmail = `${oficina.business_name.toLowerCase().replace(/\s+/g, '')}@temp.instauto.com`
          
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: tempEmail,
            password: 'TempPassword123!',
            email_confirm: true,
            user_metadata: { user_type: 'workshop_owner' }
          })

          if (authError) throw authError

          if (authData.user) {
            // Criar profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                email: oficina.email,
                name: oficina.business_name,
                type: 'workshop_owner',
                created_at: new Date().toISOString()
              })

            if (profileError) throw profileError

            // Criar workshop
            const { error: workshopError } = await supabase
              .from('workshops')
              .insert({
                id: authData.user.id,
                profile_id: authData.user.id,
                business_name: oficina.business_name,
                address: oficina.address,
                phone: oficina.phone,
                email: oficina.email,
                description: oficina.description,
                services: oficina.services,
                specialties: oficina.specialties,
                rating: oficina.rating,
                total_reviews: oficina.total_reviews,
                verified: oficina.verified,
                plan_type: oficina.plan_type,
                price_range: oficina.price_range,
                whatsapp: oficina.whatsapp || oficina.phone,
                website: oficina.website,
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
              })

            if (workshopError) throw workshopError

            successCount++
          }
        } catch (error: any) {
          console.error(`Erro ao criar oficina ${oficina.business_name}:`, error)
          errors.push(`${oficina.business_name}: ${error.message}`)
        }

        // Atualizar progresso
        setProgress(((i + 1) / OFICINAS_SEED.length) * 100)
        setResults({ success: successCount, errors })
        
        // Pequena pausa para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setCompleted(true)
    } catch (error) {
      console.error('Erro geral no seed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
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
            Importar Oficinas Reais
          </h1>
          <p className="text-gray-600">
            Importe oficinas pré-configuradas para São Paulo, Rio de Janeiro, Londrina e Itapema
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <DocumentTextIcon className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">O que será importado:</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• <strong>São Paulo:</strong> 3 oficinas (Auto Center Silva, Mecânica do João, Premium Auto Service)</li>
                <li>• <strong>Rio de Janeiro:</strong> 2 oficinas (Oficina Carioca, Auto Repair RJ)</li>
                <li>• <strong>Londrina:</strong> 2 oficinas (Mecânica Londrina, Auto Center Norte)</li>
                <li>• <strong>Itapema:</strong> 2 oficinas (Oficina Litoral, Beach Auto Service)</li>
              </ul>
              <p className="text-blue-700 mt-3 text-sm">
                <strong>Total:</strong> {OFICINAS_SEED.length} oficinas com dados realistas, 
                incluindo endereços, serviços, especialidades e avaliações.
              </p>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {!completed ? (
            <div className="text-center">
              <div className="mb-6">
                <BuildingStorefrontIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Pronto para Importar
                </h2>
                <p className="text-gray-600">
                  Este processo criará {OFICINAS_SEED.length} oficinas com dados realistas no sistema
                </p>
              </div>

              {loading && (
                <div className="mb-6">
                  <div className="bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div
                      className="bg-blue-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Criando oficinas... {Math.round(progress)}%
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    {results.success} oficinas criadas com sucesso
                  </p>
                  {results.errors.length > 0 && (
                    <div className="mt-4 text-left">
                      <p className="text-sm text-red-600 mb-2">Erros encontrados:</p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                        {results.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-700">{error}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleSeedOficinas}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2 mx-auto"
              >
                <CloudArrowUpIcon className="h-5 w-5" />
                {loading ? 'Importando...' : 'Iniciar Importação'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Importação Concluída!
              </h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 font-medium">
                  ✅ {results.success} oficinas criadas com sucesso
                </p>
                {results.errors.length > 0 && (
                  <p className="text-red-700 mt-2">
                    ❌ {results.errors.length} erros encontrados
                  </p>
                )}
              </div>

              {results.errors.length > 0 && (
                <div className="text-left mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                    Erros Detalhados:
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {results.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700 mb-1">{error}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Link
                  href="/admin"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver no Painel Admin
                </Link>
                <button
                  onClick={() => {
                    setCompleted(false)
                    setResults({ success: 0, errors: [] })
                    setProgress(0)
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Importar Novamente
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Data */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preview dos Dados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFICINAS_SEED.slice(0, 6).map((oficina, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{oficina.business_name}</h4>
                <p className="text-sm text-gray-600">{oficina.address.cidade}, {oficina.address.estado}</p>
                <p className="text-sm text-gray-500 mt-1">{oficina.services.length} serviços</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    oficina.plan_type === 'pro' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {oficina.plan_type.toUpperCase()}
                  </span>
                  {oficina.verified && (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
          {OFICINAS_SEED.length > 6 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              E mais {OFICINAS_SEED.length - 6} oficinas...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

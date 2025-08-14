'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  SparklesIcon,
  CheckIcon,
  CreditCardIcon,
  ClockIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import MercadoPagoCheckout from '@/components/payments/MercadoPagoCheckout'

export default function UpgradePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [workshop, setWorkshop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profile)

      const { data: workshop } = await supabase
        .from('workshops')
        .select('*')
        .eq('id', user.id)
        .single()

      setWorkshop(workshop)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const proFeatures = [
    'Conversas ilimitadas com clientes',
    'Relatórios avançados com IA',
    'Analytics detalhadas de performance',
    'Templates profissionais de orçamento',
    'Integração com WhatsApp Business',
    'Suporte prioritário 24/7',
    'Backup automático de dados',
    'API personalizada para integração',
    'Marketing automático por email',
    'Gestão avançada de estoque'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="/images/logo.svg" alt="InstaAuto" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">InstaAuto</h1>
            </div>
            <Link
              href="/oficina-free"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Desbloqueie Todo o Potencial da Sua Oficina
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upgrade para o plano PRO e tenha acesso a recursos avançados que vão revolucionar sua gestão
            </p>
          </motion.div>

          {/* Trial Status */}
          {workshop?.is_trial && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg mb-8 max-w-md mx-auto"
            >
              <div className="flex items-center justify-center space-x-2">
                <ClockIcon className="h-5 w-5" />
                <span className="font-medium">
                  {workshop.trial_ends_at && new Date(workshop.trial_ends_at) > new Date()
                    ? 'Seu trial está expirando em breve'
                    : 'Seu trial PRO expirou'
                  }
                </span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              O que você ganha com o PRO:
            </h2>
            <div className="space-y-4">
              {proFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
          >
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4 inline-block">
                MAIS POPULAR
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Plano PRO</h3>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-5xl font-bold text-gray-900">R$ 89</span>
                <span className="text-gray-500">/mês</span>
              </div>
              <p className="text-gray-600 mt-2">
                Cancele quando quiser • Sem taxa de setup
              </p>
            </div>

            {!showPayment ? (
              <button
                onClick={() => setShowPayment(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <CreditCardIcon className="h-5 w-5" />
                <span>Fazer Upgrade Agora</span>
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            ) : (
              <div className="space-y-4">
                <MercadoPagoCheckout
                  planId="oficina-pro"
                  userId={user?.id}
                  userEmail={user?.email}
                  onSuccess={() => {
                    alert('Upgrade realizado com sucesso!')
                    window.location.href = '/dashboard'
                  }}
                  onError={(error) => {
                    console.error('Erro no pagamento:', error)
                    alert('Erro no pagamento. Tente novamente.')
                  }}
                />
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Voltar
                </button>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <span>🔒 Pagamento 100% seguro</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Perguntas Frequentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode cancelar seu plano PRO a qualquer momento sem taxas adicionais.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">
                Meus dados ficam seguros?
              </h3>
              <p className="text-gray-600">
                Todos os seus dados são criptografados e armazenados com segurança em servidores certificados.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">
                Tenho suporte técnico?
              </h3>
              <p className="text-gray-600">
                Sim! Clientes PRO têm suporte prioritário 24/7 via chat, email e telefone.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">
                Posso migrar meus dados?
              </h3>
              <p className="text-gray-600">
                Todos os seus dados do plano FREE são automaticamente migrados para o PRO.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

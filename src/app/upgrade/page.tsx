'use client'
import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ClockIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import MercadoPagoCheckout from '@/components/payments/MercadoPagoCheckout'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'

function UpgradeContent() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [workshop, setWorkshop] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [trialExpired, setTrialExpired] = useState(false)
  const [daysLeft, setDaysLeft] = useState(0)

  useEffect(() => {
    checkUserAndTrial()
    
    // Verificar parâmetros da URL
    const expired = searchParams.get('trial_expired')
    if (expired === 'true') {
      setTrialExpired(true)
    }
  }, [searchParams])

  const checkUserAndTrial = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        window.location.href = '/login'
        return
      }
      
      setUser(user)
      
      // Buscar dados da oficina
      const { data: workshopData } = await supabase
        .from('workshops')
        .select('*')
        .eq('profile_id', user.id)
        .single()
      
      if (workshopData) {
        setWorkshop(workshopData)
        
        // Calcular dias restantes do trial
        if (workshopData.is_trial && workshopData.trial_ends_at) {
          const trialEnd = new Date(workshopData.trial_ends_at)
          const now = new Date()
          const diffTime = trialEnd.getTime() - now.getTime()
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          setDaysLeft(Math.max(0, diffDays))
          
          if (diffDays <= 0) {
            setTrialExpired(true)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar trial:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeSuccess = async () => {
    // Atualizar status no banco
    await supabase
      .from('workshops')
      .update({
        plan_type: 'pro',
        is_trial: false,
        trial_ends_at: null
      })
      .eq('profile_id', user?.id)
    
    // Redirecionar para dashboard PRO
    window.location.href = '/oficina-pro?upgraded=true'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            {trialExpired ? (
              <div className="bg-red-100 border border-red-300 rounded-xl p-6 mb-6">
                <ClockIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <h1 className="text-3xl font-bold text-red-800 mb-2">
                  Trial Expirado
                </h1>
                <p className="text-red-600">
                  Seu período gratuito de 7 dias terminou. Faça upgrade para continuar usando todas as funcionalidades PRO.
                </p>
              </div>
            ) : (
              <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 mb-6">
                <ClockIcon className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <h1 className="text-3xl font-bold text-yellow-800 mb-2">
                  {daysLeft} Dias Restantes
                </h1>
                <p className="text-yellow-600">
                  Seu trial PRO termina em {daysLeft} dias. Faça upgrade agora para não perder acesso.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Comparação de Planos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Por que fazer upgrade?
            </h2>
            
            <div className="space-y-4">
              {[
                'ERP + CRM Completo',
                'Ordens de Serviço Ilimitadas',
                'Gestão de Estoque',
                'Relatórios Avançados',
                'Suporte com IA',
                'WhatsApp Integrado',
                'Atendimento Prioritário',
                'Backup Automático'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">R$ 89</div>
                <div className="text-sm text-blue-500">por mês</div>
                <div className="text-xs text-gray-500 mt-1">
                  Primeira cobrança hoje, depois todo dia {new Date().getDate()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Checkout MercadoPago */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8"
          >
            <div className="text-center mb-6">
              <CreditCardIcon className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                Fazer Upgrade Agora
              </h2>
              <p className="text-gray-600">
                Pagamento seguro via MercadoPago
              </p>
            </div>

            <MercadoPagoCheckout 
              planType="pro"
              onSuccess={handleUpgradeSuccess}
              onError={() => alert('Erro no pagamento. Tente novamente.')}
            />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                🔒 Pagamento 100% seguro<br/>
                ✅ Cancele quando quiser<br/>
                📞 Suporte 24/7
              </p>
            </div>
          </motion.div>
        </div>

        {/* Voltar para Free */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Não quer fazer upgrade agora?
          </p>
          <button
            onClick={() => {
              // Voltar para plano free
              supabase
                .from('workshops')
                .update({
                  plan_type: 'free',
                  is_trial: false,
                  trial_ends_at: null
                })
                .eq('profile_id', user?.id)
                .then(() => {
                  window.location.href = '/oficina-free'
                })
            }}
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Continuar com Plano Gratuito
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}

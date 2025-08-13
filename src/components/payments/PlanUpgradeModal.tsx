'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  GiftIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

interface Plan {
  id: 'free' | 'pro' | 'premium'
  name: string
  price: number
  period: 'month' | 'year'
  description: string
  features: string[]
  popular?: boolean
  discount?: number
}

interface PlanUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  onSelectPlan: (planId: string, paymentMethod: 'pix' | 'credit_card') => void
  loading?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    price: 0,
    period: 'month',
    description: 'Ideal para começar',
    features: [
      'Até 10 clientes',
      'Até 30 ordens/mês',
      'Agendamentos básicos',
      'Suporte por email',
      'Relatórios básicos'
    ]
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 59.90,
    period: 'month',
    description: 'Para oficinas em crescimento',
    popular: true,
    features: [
      'Clientes ilimitados',
      'Ordens ilimitadas',
      'Chat em tempo real',
      'Relatórios avançados',
      'Gestão de estoque',
      'Integração WhatsApp',
      'Analytics IA',
      'Suporte prioritário'
    ]
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 99.90,
    period: 'month',
    description: 'Para redes e franquias',
    discount: 15,
    features: [
      'Tudo do PRO +',
      'Multi-filiais',
      'Dashboard executivo',
      'API completa',
      'Backup automático',
      'Treinamento personalizado',
      'Gerente de conta dedicado',
      'SLA 99.9% uptime'
    ]
  }
]

export default function PlanUpgradeModal({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
  loading = false
}: PlanUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix')
  const [showPayment, setShowPayment] = useState(false)

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return
    setSelectedPlan(planId)
    setShowPayment(true)
  }

  const handleConfirmPayment = () => {
    if (selectedPlan) {
      onSelectPlan(selectedPlan, paymentMethod)
    }
  }

  const getPlanPrice = (plan: Plan) => {
    if (plan.discount) {
      const discountedPrice = plan.price * (1 - plan.discount / 100)
      return discountedPrice
    }
    return plan.price
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {!showPayment ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
                  <p className="text-blue-100 mt-1">Turbine sua oficina com funcionalidades premium</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const isCurrentPlan = plan.id === currentPlan
                  const finalPrice = getPlanPrice(plan)
                  
                  return (
                    <motion.div
                      key={plan.id}
                      whileHover={{ scale: 1.02 }}
                      className={`
                        relative rounded-xl border-2 p-6 cursor-pointer transition-all
                        ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'}
                        ${isCurrentPlan ? 'opacity-60 cursor-not-allowed' : ''}
                      `}
                      onClick={() => !isCurrentPlan && handleSelectPlan(plan.id)}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <StarIconSolid className="w-4 h-4" />
                            MAIS POPULAR
                          </div>
                        </div>
                      )}

                      {/* Current Plan Badge */}
                      {isCurrentPlan && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                            <CheckIcon className="w-4 h-4" />
                            PLANO ATUAL
                          </div>
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                        
                        <div className="mb-4">
                          {plan.discount && (
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <span className="text-lg text-gray-400 line-through">
                                {formatPrice(plan.price)}
                              </span>
                              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">
                                -{plan.discount}%
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-baseline justify-center">
                            <span className="text-3xl font-bold text-gray-900">
                              {formatPrice(finalPrice)}
                            </span>
                            <span className="text-gray-600 ml-1">/{plan.period === 'month' ? 'mês' : 'ano'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      {!isCurrentPlan && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors
                            ${plan.popular 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }
                          `}
                        >
                          {plan.id === 'free' ? 'Downgrade' : 'Escolher Plano'}
                        </motion.button>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Benefits */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GiftIcon className="w-6 h-6 text-blue-600" />
                  Por que escolher o InstaAuto PRO?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <SparklesIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Aumente sua receita</h4>
                      <p className="text-sm text-gray-600">Oficinas PRO faturam em média 40% mais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <StarIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Mais clientes satisfeitos</h4>
                      <p className="text-sm text-gray-600">98% de satisfação dos clientes PRO</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Payment Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Finalizar Pagamento</h2>
                  <p className="text-green-100 mt-1">
                    Plano {plans.find(p => p.id === selectedPlan)?.name} - 
                    {formatPrice(getPlanPrice(plans.find(p => p.id === selectedPlan)!))}
                  </p>
                </div>
                <button 
                  onClick={() => setShowPayment(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Escolha a forma de pagamento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setPaymentMethod('pix')}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'pix' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <DevicePhoneMobileIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">PIX</h4>
                        <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                        <p className="text-xs text-green-600 font-semibold">5% de desconto</p>
                      </div>
                      {paymentMethod === 'pix' && (
                        <CheckIcon className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`
                      p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${paymentMethod === 'credit_card' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CreditCardIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Cartão de Crédito</h4>
                        <p className="text-sm text-gray-600">Parcelamento em até 12x</p>
                        <p className="text-xs text-blue-600 font-semibold">Sem juros até 6x</p>
                      </div>
                      {paymentMethod === 'credit_card' && (
                        <CheckIcon className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Resumo do pedido</h3>
                
                {selectedPlan && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plano {plans.find(p => p.id === selectedPlan)?.name}</span>
                      <span className="font-semibold">
                        {formatPrice(plans.find(p => p.id === selectedPlan)?.price || 0)}
                      </span>
                    </div>
                    
                    {plans.find(p => p.id === selectedPlan)?.discount && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto anual</span>
                        <span>-{formatPrice((plans.find(p => p.id === selectedPlan)?.price || 0) * (plans.find(p => p.id === selectedPlan)?.discount || 0) / 100)}</span>
                      </div>
                    )}
                    
                    {paymentMethod === 'pix' && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto PIX (5%)</span>
                        <span>-{formatPrice(getPlanPrice(plans.find(p => p.id === selectedPlan)!) * 0.05)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        {formatPrice(
                          getPlanPrice(plans.find(p => p.id === selectedPlan)!) * 
                          (paymentMethod === 'pix' ? 0.95 : 1)
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processando...
                  </div>
                ) : (
                  `Pagar ${formatPrice(
                    getPlanPrice(plans.find(p => p.id === selectedPlan)!) * 
                    (paymentMethod === 'pix' ? 0.95 : 1)
                  )}`
                )}
              </motion.button>

              {/* Security Info */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Pagamento 100% seguro via MercadoPago
                </p>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCardIcon, 
  QrCodeIcon, 
  DocumentTextIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useToastHelpers } from '@/components/ui/toast'
import { PageTransition, CardTransition, ButtonTransition } from '@/components/ui/PageTransition'

interface CheckoutFormProps {
  planType: 'free' | 'pro'
  amount: number
  userEmail: string
  userName: string
  onSuccess?: (paymentData: any) => void
  onError?: (error: any) => void
}

export default function CheckoutForm({
  planType,
  amount,
  userEmail,
  userName,
  onSuccess,
  onError
}: CheckoutFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'credit' | 'boleto'>('pix')
  const [loading, setLoading] = useState(false)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [pixCopyPaste, setPixCopyPaste] = useState<string | null>(null)
  
  const { success, error: showError } = useToastHelpers()

  const paymentMethods = [
    {
      id: 'pix',
      name: 'PIX',
      description: 'Aprovação instantânea',
      icon: QrCodeIcon,
      discount: 5,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'credit',
      name: 'Cartão de Crédito',
      description: 'Até 12x sem juros',
      icon: CreditCardIcon,
      discount: 0,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      description: 'Vencimento em 3 dias',
      icon: DocumentTextIcon,
      discount: 0,
      color: 'from-orange-500 to-red-600'
    }
  ]

  const calculateFinalAmount = () => {
    const method = paymentMethods.find(m => m.id === selectedMethod)
    const discount = method?.discount || 0
    return amount * (1 - discount / 100)
  }

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          paymentMethod: selectedMethod,
          amount: calculateFinalAmount(),
          userEmail,
          userName,
          externalReference: `${planType}_${Date.now()}_${userEmail}`
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar pagamento')
      }

      const data = await response.json()

      if (selectedMethod === 'pix') {
        // Para PIX, mostrar QR Code
        setPixQrCode(data.qr_code_base64)
        setPixCopyPaste(data.qr_code)
        success('QR Code PIX gerado com sucesso!')
      } else {
        // Para outros métodos, redirecionar para MercadoPago
        window.open(data.init_point, '_blank')
        success('Redirecionando para pagamento...')
      }

      onSuccess?.(data)
    } catch (error) {
      console.error('Erro no pagamento:', error)
      showError('Erro ao processar pagamento. Tente novamente.')
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  const copyPixCode = () => {
    if (pixCopyPaste) {
      navigator.clipboard.writeText(pixCopyPaste)
      success('Código PIX copiado!')
    }
  }

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Pagamento
          </h1>
          <p className="text-gray-600">
            Plano {planType === 'pro' ? 'PRO' : 'FREE'} - R$ {amount.toFixed(2)}
          </p>
        </div>

        {!pixQrCode ? (
          <CardTransition>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Resumo do Pedido */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumo do Pedido
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plano {planType.toUpperCase()}</span>
                    <span className="font-medium">R$ {amount.toFixed(2)}</span>
                  </div>
                  {selectedMethod === 'pix' && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto PIX (5%)</span>
                      <span>- R$ {(amount * 0.05).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>R$ {calculateFinalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Métodos de Pagamento */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Escolha a forma de pagamento
                </h3>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <motion.button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id as any)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">
                                {method.name}
                              </h4>
                              {method.discount > 0 && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  -{method.discount}%
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{method.description}</p>
                          </div>
                          {selectedMethod === method.id && (
                            <CheckCircleIcon className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Segurança */}
              <div className="mb-8 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-900">Pagamento Seguro</h4>
                    <p className="text-green-700 text-sm">
                      Processado pelo MercadoPago com criptografia SSL
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Pagamento */}
              <ButtonTransition>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Processando...
                    </div>
                  ) : (
                    `Pagar R$ ${calculateFinalAmount().toFixed(2)}`
                  )}
                </button>
              </ButtonTransition>
            </div>
          </CardTransition>
        ) : (
          /* QR Code PIX */
          <CardTransition>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <QrCodeIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Pagamento via PIX
                </h3>
                <p className="text-gray-600">
                  Escaneie o QR Code ou copie o código para pagar
                </p>
              </div>

              {/* QR Code */}
              <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                <img
                  src={`data:image/png;base64,${pixQrCode}`}
                  alt="QR Code PIX"
                  className="w-64 h-64 mx-auto"
                />
              </div>

              {/* Código Copia e Cola */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ou copie o código PIX:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixCopyPaste || ''}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={copyPixCode}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p>• O pagamento será processado automaticamente</p>
                <p>• Você receberá uma confirmação por email</p>
                <p>• Válido por 24 horas</p>
              </div>
            </div>
          </CardTransition>
        )}
      </div>
    </PageTransition>
  )
}

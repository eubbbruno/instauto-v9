'use client';

import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { CreditCardIcon, CheckCircleIcon, QrCodeIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

// Inicializar MercadoPago
if (process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
}

interface CheckoutProps {
  planType: 'free' | 'pro';
  onSuccess?: () => void;
  onError?: () => void;
}

const planDetails = {
  free: {
    name: 'Plano Gratuito',
    price: 0,
    features: [
      'Receber e responder orçamentos',
      'Acesso via celular',
      'Gestão básica de agendamentos'
    ],
    color: 'gray'
  },
  pro: {
    name: 'Plano Profissional',
    price: 149,
    features: [
      'ERP + CRM completo',
      'Ordens de Serviço',
      'Estoque, financeiro, relatórios',
      'Suporte com IA + WhatsApp',
      'Atendimento prioritário',
      'Relatórios avançados'
    ],
    color: 'blue'
  }
};

export default function MercadoPagoCheckout({ planType, onSuccess, onError }: CheckoutProps) {
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'all' | 'pix' | 'boleto' | 'card'>('all');
  const [pixCode, setPixCode] = useState<string>('');
  
  const plan = planDetails[planType];

  // Se for plano gratuito, não mostrar checkout
  if (planType === 'free') {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md mx-auto">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Plano Gratuito Ativado!</h3>
          <p className="text-gray-600 mb-6">
            Você já pode começar a usar todas as funcionalidades do plano gratuito.
          </p>
          <button
            onClick={onSuccess}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Acessar Dashboard
          </button>
        </div>
      </div>
    );
  }

  const createPreference = async (methodType: 'all' | 'pix' | 'boleto' | 'card' = 'all') => {
    setLoading(true);
    setError(null);
    setPaymentMethod(methodType);
    
    try {
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          workshopId: 'temp-workshop-id', // Em produção, pegar do contexto de auth
          payer: {
            name: 'Usuário Teste', // Em produção, pegar do contexto de auth
            email: 'teste@exemplo.com',
            phone: {
              area_code: '11',
              number: '999999999'
            }
          },
          paymentMethods: {
            preferredMethod: methodType
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pagamento');
      }

      const data = await response.json();
      setPreferenceId(data.id);
      
      // Se for PIX, capturar QR Code
      if (methodType === 'pix' && data.qr_code) {
        setPixCode(data.qr_code);
      }
      
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar pagamento. Tente novamente.');
      onError?.();
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    // Mostrar feedback visual (pode implementar toast aqui)
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md mx-auto">
      {/* Detalhes do Plano */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold text-blue-600">
            R$ {plan.price.toFixed(2)}
          </span>
          <span className="text-gray-600 ml-2">/mês</span>
        </div>
        
        <ul className="space-y-2 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opções de Pagamento */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Escolha sua forma de pagamento:</h4>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => createPreference('pix')}
            disabled={loading}
            className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 flex flex-col items-center"
          >
            <QrCodeIcon className="h-6 w-6 text-blue-600 mb-1" />
            <span className="text-sm font-medium">PIX Instantâneo</span>
          </button>
          
          <button
            onClick={() => createPreference('card')}
            disabled={loading}
            className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 flex flex-col items-center"
          >
            <CreditCardIcon className="h-6 w-6 text-blue-600 mb-1" />
            <span className="text-sm font-medium">Cartão</span>
          </button>
        </div>
        
        <button
          onClick={() => createPreference('boleto')}
          disabled={loading}
          className="w-full p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-sm font-medium">Boleto Bancário</span>
        </button>
      </div>

      {/* PIX Code Display */}
      {paymentMethod === 'pix' && pixCode && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-semibold text-blue-800 mb-2">🔥 PIX Instantâneo</h5>
          <p className="text-sm text-blue-700 mb-3">Copie o código PIX abaixo:</p>
          <div className="bg-white p-2 rounded border text-xs font-mono break-all">
            {pixCode.substring(0, 50)}...
          </div>
          <button
            onClick={copyPixCode}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            📋 Copiar código PIX
          </button>
          <div className="flex items-center mt-2 text-xs text-blue-600">
            <ClockIcon className="h-4 w-4 mr-1" />
            Válido por 30 minutos
          </div>
        </div>
      )}

      {/* Teste de Pagamento */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium mb-2 text-yellow-800">🧪 Modo de Teste</h4>
        <div className="text-sm text-yellow-700 space-y-1">
          <p><strong>Cartão aprovado:</strong> 5031 4332 1540 6351</p>
          <p><strong>Nome:</strong> APRO</p>
          <p><strong>Validade:</strong> 11/25 | <strong>CVV:</strong> 123</p>
          <p><strong>PIX:</strong> Aprovação automática em 30s</p>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Wallet MercadoPago */}
      {preferenceId && !pixCode && (
        <div id="wallet_container">
          <Wallet
            initialization={{
              preferenceId: preferenceId,
              redirectMode: 'self'
            }}
            onReady={() => {
              console.log('Wallet ready');
            }}
            onError={(error) => {
              console.error('Wallet error:', error);
              setError('Erro no checkout. Tente novamente.');
              onError?.();
            }}
          />
        </div>
      )}

      {/* Botão de Loading */}
      {loading && (
        <button
          disabled
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center opacity-50"
        >
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processando...
        </button>
      )}

      {/* Segurança */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Pagamento 100% seguro processado pelo Mercado Pago
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PIX instantâneo • Parcelamento até 12x • Boleto bancário
        </p>
      </div>
    </div>
  );
} 
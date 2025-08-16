'use client';

import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

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
      'Receber e responder orcamentos',
      'Acesso via celular',
      'Gestao basica de agendamentos'
    ],
    color: 'gray'
  },
  pro: {
    name: 'Plano Profissional',
    price: 89,
    features: [
      'ERP + CRM completo',
      'Ordens de Servico',
      'Estoque, financeiro, relatorios',
      'Suporte com IA + WhatsApp',
      'Atendimento prioritario',
      'Relatorios avancados'
    ],
    color: 'blue'
  }
};

export default function MercadoPagoCheckout({ planType, onSuccess, onError }: CheckoutProps) {
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const plan = planDetails[planType];

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profile);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error);
    }
  }

  // Se for plano gratuito, nao mostrar checkout
  if (planType === 'free') {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md mx-auto">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Plano Gratuito Ativado!</h3>
          <p className="text-gray-600 mb-6">
            Voce ja pode comecar a usar todas as funcionalidades do plano gratuito.
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

  const createPreference = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          workshopId: user?.id || 'temp-workshop-id',
          payer: {
            name: profile?.name || user?.user_metadata?.name || 'Usuário',
            email: user?.email || 'teste@exemplo.com',
            phone: {
              area_code: '11',
              number: profile?.phone || '999999999'
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pagamento');
      }

      const data = await response.json();
      setPreferenceId(data.id);
      
    } catch (error) {
      console.error('Erro ao criar preferencia:', error);
      setError(error instanceof Error ? error.message : 'Erro ao processar pagamento. Tente novamente.');
      onError?.();
    } finally {
      setLoading(false);
    }
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
          <span className="text-gray-600 ml-2">/mes</span>
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

      {/* Teste de Pagamento */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium mb-2 text-yellow-800">🧪 Modo de Teste</h4>
        <div className="text-sm text-yellow-700 space-y-1">
          <p><strong>Cartao de teste:</strong> 5031 4332 1540 6351</p>
          <p><strong>Nome:</strong> APRO</p>
          <p><strong>Validade:</strong> 11/25 | <strong>CVV:</strong> 123</p>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Botao de Pagamento */}
      {!preferenceId ? (
        <button
          onClick={createPreference}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <CreditCardIcon className="h-5 w-5 mr-2" />
              Pagar com Mercado Pago
            </>
          )}
        </button>
      ) : (
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

      {/* Seguranca */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Pagamento 100% seguro processado pelo Mercado Pago
        </p>
      </div>
    </div>
  );
} 
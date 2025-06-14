'use client';

import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializar MercadoPago
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);
}

interface CheckoutProps {
  agendamento: {
    id: string;
    servico: string;
    preco: number;
    oficina: string;
    cliente: {
      nome: string;
      email: string;
      telefone: string;
    };
  };
}

export default function MercadoPagoCheckout({ agendamento }: CheckoutProps) {
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const createPreference = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: {
            id: agendamento.id,
            title: `${agendamento.servico} - ${agendamento.oficina}`,
            price: agendamento.preco
          },
          payer: {
            name: agendamento.cliente.nome,
            email: agendamento.cliente.email,
            phone: {
              area_code: agendamento.cliente.telefone.substring(1, 3),
              number: agendamento.cliente.telefone.substring(4)
            }
          },
          external_reference: agendamento.id
        })
      });

      const data = await response.json();
      setPreferenceId(data.id);
      
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Finalizar Pagamento</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Serviço:</span>
          <span className="font-medium">{agendamento.servico}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Oficina:</span>
          <span className="font-medium">{agendamento.oficina}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total:</span>
          <span className="text-[#0047CC]">
            R$ {agendamento.preco.toFixed(2)}
          </span>
        </div>
      </div>

      {!preferenceId ? (
        <button
          onClick={createPreference}
          disabled={loading}
          className="w-full bg-[#009EE3] hover:bg-[#0084C7] text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Pagar com Mercado Pago'}
        </button>
      ) : (
        <Wallet
          initialization={{
            preferenceId: preferenceId,
            redirectMode: 'self'
          }}
          customization={{
            texts: {
              valueProp: 'smart_option'
            }
          }}
        />
      )}
    </div>
  );
} 
'use client';

import MercadoPagoCheckout from '@/components/payments/MercadoPagoCheckout';

export default function TestMercadoPago() {
  const agendamentoTeste = {
    id: 'test-123',
    servico: 'Troca de Óleo',
    preco: 89.90,
    oficina: 'Auto Center Silva',
    cliente: {
      nome: 'João Silva',
      email: 'joao@email.com',
      telefone: '(11) 98765-4321'
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            Teste Mercado Pago
          </h1>
          <p className="text-gray-600 text-center">
            Teste o sistema de pagamentos com dados fictícios
          </p>
        </div>
        
        <MercadoPagoCheckout agendamento={agendamentoTeste} />
        
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Modo de Teste</h3>
          <p className="text-yellow-700 text-sm">
            Este é um ambiente de teste. Use os cartões de teste do Mercado Pago para simular pagamentos.
          </p>
        </div>
      </div>
    </div>
  );
} 
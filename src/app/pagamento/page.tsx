"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon,
  BanknotesIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  ArrowLeftIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data do serviço
const mockServico = {
  id: '1',
  oficina: {
    nome: 'Auto Center Silva',
    endereco: 'Rua das Oficinas, 123 - Vila Madalena, São Paulo',
    telefone: '(11) 99999-0000',
    avaliacao: 4.8
  },
  servico: {
    nome: 'Troca de óleo + Filtros',
    descricao: 'Troca de óleo do motor, filtro de óleo e filtro de ar',
    preco: 150.00,
    tempoEstimado: '2 horas',
    garantia: '6 meses'
  },
  agendamento: {
    data: '2024-01-20',
    horario: '14:00',
    veiculo: 'Honda Civic 2020 - ABC-1234'
  }
};

type FormaPagamento = 'cartao' | 'pix' | 'boleto';

interface DadosCartao {
  numero: string;
  nome: string;
  validade: string;
  cvv: string;
}

export default function PagamentoPage() {
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('cartao');
  const [dadosCartao, setDadosCartao] = useState<DadosCartao>({
    numero: '',
    nome: '',
    validade: '',
    cvv: ''
  });
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  const [pagamentoConcluido, setPagamentoConcluido] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [erros, setErros] = useState<{[key: string]: string}>({});
  const router = useRouter();

  // Gerar código PIX mockado
  useEffect(() => {
    if (formaPagamento === 'pix') {
      setPixCode('00020101021226830014BR.GOV.BCB.PIX2561pix-qr.mercadopago.com/instore/o/v2/7b9f9b8c-4f2e-4b5a-8f3d-2e4c6a7b9f8d5204000053039865802BR5913AutoCenterSilva6009SAO PAULO62070503***63041234');
    }
  }, [formaPagamento]);

  const formatarNumeroCartao = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    const grupos = apenasNumeros.match(/.{1,4}/g) || [];
    return grupos.join(' ').substr(0, 19);
  };

  const formatarValidade = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros.length >= 2) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}`;
    }
    return apenasNumeros;
  };

  const validarFormulario = () => {
    const novosErros: {[key: string]: string} = {};

    if (formaPagamento === 'cartao') {
      if (!dadosCartao.numero || dadosCartao.numero.replace(/\s/g, '').length < 16) {
        novosErros.numero = 'Número de cartão inválido';
      }
      if (!dadosCartao.nome) {
        novosErros.nome = 'Nome no cartão é obrigatório';
      }
      if (!dadosCartao.validade || dadosCartao.validade.length < 5) {
        novosErros.validade = 'Validade inválida';
      }
      if (!dadosCartao.cvv || dadosCartao.cvv.length < 3) {
        novosErros.cvv = 'CVV inválido';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const processarPagamento = async () => {
    if (formaPagamento === 'cartao' && !validarFormulario()) {
      return;
    }

    setProcessandoPagamento(true);
    setErros({});

    // Simular processamento do pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));

    setProcessandoPagamento(false);
    setPagamentoConcluido(true);

    // Redirecionar após sucesso
    setTimeout(() => {
      router.push('/agendamento/confirmacao');
    }, 3000);
  };

  const precoTotal = mockServico.servico.preco;
  const taxaServico = precoTotal * 0.05; // 5% de taxa
  const valorFinal = precoTotal + taxaServico;

  if (pagamentoConcluido) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Seu agendamento foi confirmado e o pagamento processado com sucesso.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Número do pedido:</p>
            <p className="font-mono font-bold text-[#0047CC]">#AGD-{Date.now().toString().slice(-6)}</p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecionando para confirmação...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-3 md:px-4 lg:px-8">
          <div className="flex items-center py-3 md:py-4">
            <Link href="/oficinas" className="mr-3 md:mr-4 p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">Finalizar Pagamento</h1>
              <p className="text-sm md:text-base text-gray-600 hidden sm:block">Confirme os dados e escolha a forma de pagamento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 lg:sticky lg:top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h3>
              
              {/* Oficina */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="font-medium text-gray-900">{mockServico.oficina.nome}</h4>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{mockServico.oficina.endereco}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  <span>{mockServico.oficina.telefone}</span>
                </div>
              </div>

              {/* Serviço */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="font-medium text-gray-900">{mockServico.servico.nome}</h4>
                <p className="text-gray-600 text-sm">{mockServico.servico.descricao}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span>{mockServico.servico.tempoEstimado}</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    R$ {mockServico.servico.preco.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Agendamento */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="font-medium text-gray-900 mb-2">Agendamento</h4>
                <div className="space-y-1">
                  <div className="flex items-center text-gray-600 text-sm">
                    <CalendarDaysIcon className="h-4 w-4 mr-2" />
                    <span>{new Date(mockServico.agendamento.data).toLocaleDateString('pt-BR')} às {mockServico.agendamento.horario}</span>
                  </div>
                  <div className="text-gray-600 text-sm ml-6">
                    {mockServico.agendamento.veiculo}
                  </div>
                </div>
              </div>

              {/* Valores */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Serviço</span>
                  <span className="text-gray-900">R$ {precoTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de serviço</span>
                  <span className="text-gray-900">R$ {taxaServico.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#0047CC]">R$ {valorFinal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Garantia */}
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800 text-sm">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium">Garantia: {mockServico.servico.garantia}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-6">Forma de Pagamento</h3>
              
              {/* Abas de Pagamento - Mobile Optimized */}
              <div className="grid grid-cols-3 gap-1 md:gap-2 mb-4 md:mb-6">
                <button
                  onClick={() => setFormaPagamento('cartao')}
                  className={`p-2 md:p-4 border rounded-lg text-center transition-colors ${
                    formaPagamento === 'cartao'
                      ? 'bg-[#0047CC] text-white border-[#0047CC]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CreditCardIcon className="h-4 w-4 md:h-6 md:w-6 mx-auto mb-1 md:mb-2" />
                  <span className="text-xs md:text-sm font-medium">Cartão</span>
                </button>
                
                <button
                  onClick={() => setFormaPagamento('pix')}
                  className={`p-2 md:p-4 border rounded-lg text-center transition-colors ${
                    formaPagamento === 'pix'
                      ? 'bg-[#0047CC] text-white border-[#0047CC]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <QrCodeIcon className="h-4 w-4 md:h-6 md:w-6 mx-auto mb-1 md:mb-2" />
                  <span className="text-xs md:text-sm font-medium">PIX</span>
                </button>
                
                <button
                  onClick={() => setFormaPagamento('boleto')}
                  className={`p-2 md:p-4 border rounded-lg text-center transition-colors ${
                    formaPagamento === 'boleto'
                      ? 'bg-[#0047CC] text-white border-[#0047CC]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <BanknotesIcon className="h-4 w-4 md:h-6 md:w-6 mx-auto mb-1 md:mb-2" />
                  <span className="text-xs md:text-sm font-medium">Boleto</span>
                </button>
              </div>

              {/* Formulário Cartão */}
              {formaPagamento === 'cartao' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      value={dadosCartao.numero}
                      onChange={(e) => setDadosCartao(prev => ({
                        ...prev,
                        numero: formatarNumeroCartao(e.target.value)
                      }))}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent ${
                        erros.numero ? 'border-red-300' : 'border-gray-300'
                      }`}
                      maxLength={19}
                    />
                    {erros.numero && (
                      <p className="text-red-600 text-sm mt-1">{erros.numero}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      value={dadosCartao.nome}
                      onChange={(e) => setDadosCartao(prev => ({
                        ...prev,
                        nome: e.target.value.toUpperCase()
                      }))}
                      placeholder="NOME COMO ESTÁ NO CARTÃO"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent ${
                        erros.nome ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {erros.nome && (
                      <p className="text-red-600 text-sm mt-1">{erros.nome}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validade
                      </label>
                      <input
                        type="text"
                        value={dadosCartao.validade}
                        onChange={(e) => setDadosCartao(prev => ({
                          ...prev,
                          validade: formatarValidade(e.target.value)
                        }))}
                        placeholder="MM/AA"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent ${
                          erros.validade ? 'border-red-300' : 'border-gray-300'
                        }`}
                        maxLength={5}
                      />
                      {erros.validade && (
                        <p className="text-red-600 text-sm mt-1">{erros.validade}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={dadosCartao.cvv}
                        onChange={(e) => setDadosCartao(prev => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, '')
                        }))}
                        placeholder="123"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0047CC] focus:border-transparent ${
                          erros.cvv ? 'border-red-300' : 'border-gray-300'
                        }`}
                        maxLength={4}
                      />
                      {erros.cvv && (
                        <p className="text-red-600 text-sm mt-1">{erros.cvv}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PIX */}
              {formaPagamento === 'pix' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-gray-50 p-8 rounded-lg mb-4">
                    <QrCodeIcon className="h-32 w-32 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Use o app do seu banco para escanear o código QR
                    </p>
                    <div className="bg-white p-4 rounded border text-xs break-all font-mono text-gray-500">
                      {pixCode}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 text-sm font-medium">
                      ⚡ Pagamento instantâneo via PIX
                    </p>
                    <p className="text-blue-600 text-sm">
                      Após o pagamento, seu agendamento será confirmado automaticamente
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Boleto */}
              {formaPagamento === 'boleto' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="bg-gray-50 p-8 rounded-lg mb-4">
                    <BanknotesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Boleto Bancário</h4>
                    <p className="text-gray-600 mb-4">
                      O boleto será gerado após a confirmação e enviado por email
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm font-medium">
                      ⚠️ Prazo de pagamento: até 3 dias úteis
                    </p>
                    <p className="text-yellow-600 text-sm">
                      Seu agendamento será confirmado após a compensação do boleto
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Botão de Pagamento */}
              <div className="mt-8">
                <button
                  onClick={processarPagamento}
                  disabled={processandoPagamento}
                  className="w-full bg-[#0047CC] hover:bg-[#0055EB] text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {processandoPagamento ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      {formaPagamento === 'cartao' && `Pagar R$ ${valorFinal.toFixed(2)}`}
                      {formaPagamento === 'pix' && 'Confirmar Pagamento PIX'}
                      {formaPagamento === 'boleto' && 'Gerar Boleto'}
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center mt-4">
                  <ShieldCheckIcon className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">Pagamento 100% seguro e protegido</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
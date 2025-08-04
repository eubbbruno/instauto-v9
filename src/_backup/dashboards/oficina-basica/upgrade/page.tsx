"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckIcon, 
  XMarkIcon, 
  CreditCardIcon,
  ChartBarIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToastHelpers } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { success, error: showError } = useToastHelpers();
  const router = useRouter();

  const plans = {
    monthly: {
      price: 'R$ 49,90',
      period: '/mês',
      savings: null
    },
    yearly: {
      price: 'R$ 39,90',
      period: '/mês',
      savings: 'Economize 20%'
    }
  };

  const features = {
    free: [
      { name: 'Até 50 clientes', included: true },
      { name: 'Até 10 agendamentos/mês', included: true },
      { name: 'Suporte básico', included: true },
      { name: 'Relatórios básicos', included: true },
      { name: 'Agenda simples', included: true },
      { name: 'WhatsApp integrado', included: false },
      { name: 'Relatórios avançados', included: false },
      { name: 'Gestão financeira', included: false },
      { name: 'API integração', included: false },
      { name: 'Suporte prioritário', included: false },
      { name: 'Backup automático', included: false },
      { name: 'Multi-usuários', included: false }
    ],
    pro: [
      { name: 'Clientes ilimitados', included: true },
      { name: 'Agendamentos ilimitados', included: true },
      { name: 'Suporte prioritário 24/7', included: true },
      { name: 'Relatórios avançados', included: true },
      { name: 'Agenda inteligente', included: true },
      { name: 'WhatsApp integrado', included: true },
      { name: 'Gestão financeira completa', included: true },
      { name: 'API para integração', included: true },
      { name: 'Backup automático diário', included: true },
      { name: 'Multi-usuários (até 5)', included: true },
      { name: 'Análise de performance', included: true },
      { name: 'Personalização avançada', included: true }
    ]
  };

  const handleUpgrade = async () => {
    setLoading(true);
    
    try {
      // Simulando processo de pagamento
      console.log('🎯 Iniciando upgrade para PRO:', {
        userId: user?.id,
        plan: selectedPlan,
        price: plans[selectedPlan].price
      });

             // Aqui seria a integração com MercadoPago/Stripe
       // const paymentData = {
       //   userId: user?.id,
       //   plan: selectedPlan,
       //   amount: selectedPlan === 'monthly' ? 4990 : 3990, // em centavos
       //   description: `Instauto PRO - Plano ${selectedPlan === 'monthly' ? 'Mensal' : 'Anual'}`,
       //   redirectUrl: `${window.location.origin}/dashboard?upgrade=success`
       // };

      // Simulação de pagamento bem-sucedido após 2 segundos
      setTimeout(() => {
        success('Pagamento realizado com sucesso!', 'Bem-vindo ao Instauto PRO! 🎉');
        
        // Redirecionar para dashboard PRO
        setTimeout(() => {
          router.push('/dashboard?upgraded=true');
        }, 1500);
      }, 2000);

         } catch (err) {
       console.error('Erro no upgrade:', err);
       showError('Erro no pagamento', 'Tente novamente ou entre em contato conosco');
       setLoading(false);
     }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-amber-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <SparklesIcon className="h-16 w-16 mx-auto mb-6 text-amber-300" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforme sua Oficina com o
              <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                {" "}Instauto PRO
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              Desbloqueie todo o potencial da sua oficina com ferramentas profissionais
            </p>
            <div className="flex items-center justify-center gap-2 text-amber-200">
              <StarIcon className="h-5 w-5" />
              <span className="font-medium">Mais de 1.000 oficinas confiam no Instauto PRO</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Billing Toggle */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Escolha seu plano</h2>
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedPlan === 'monthly' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors relative ${
                selectedPlan === 'yearly' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Anual
              {plans.yearly.savings && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-xs px-2 py-1 rounded-full font-bold">
                  -20%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* FREE Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border-2 border-gray-200 rounded-2xl p-8 relative"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano FREE</h3>
              <p className="text-gray-600 mb-6">Ideal para começar</p>
              <div className="text-4xl font-bold text-green-600">Grátis</div>
              <p className="text-gray-500">Para sempre</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              {features.free.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  {feature.included ? (
                    <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <div className="text-green-600 font-medium bg-green-50 py-2 px-4 rounded-lg">
                Seu plano atual
              </div>
            </div>
          </motion.div>

          {/* PRO Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-green-600 to-amber-600 text-white rounded-2xl p-8 relative shadow-2xl transform scale-105"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-amber-400 text-amber-900 px-6 py-2 rounded-full font-bold text-sm">
                🏆 MAIS POPULAR
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Plano PRO</h3>
              <p className="text-green-100 mb-6">Para oficinas profissionais</p>
              <div className="text-4xl font-bold">{plans[selectedPlan].price}</div>
              <p className="text-green-100">{plans[selectedPlan].period}</p>
              {plans[selectedPlan].savings && (
                <p className="text-amber-300 font-medium mt-2">{plans[selectedPlan].savings}</p>
              )}
            </div>
            
            <ul className="space-y-4 mb-8">
              {features.pro.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckIcon className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white">{feature.name}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full bg-white text-green-600 py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  Processando...
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-5 w-5" />
                  Fazer Upgrade Agora
                  <ArrowRightIcon className="h-5 w-5" />
                </>
              )}
            </button>

            <p className="text-center text-green-100 text-sm mt-4">
              🔒 Pagamento 100% seguro • Cancele quando quiser
            </p>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que escolher o Instauto PRO?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6"
            >
              <ChartBarIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Relatórios Avançados</h4>
              <p className="text-gray-600">
                Análises detalhadas de performance, faturamento e crescimento da sua oficina
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6"
            >
              <PhoneIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">WhatsApp Integrado</h4>
              <p className="text-gray-600">
                Comunique-se diretamente com seus clientes via WhatsApp de forma automatizada
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6"
            >
              <ShieldCheckIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-2">Suporte Prioritário</h4>
              <p className="text-gray-600">
                Atendimento 24/7 com nossa equipe especializada para resolver qualquer questão
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Posso cancelar a qualquer momento?</h4>
              <p className="text-gray-600">
                Sim! Você pode cancelar seu plano PRO a qualquer momento. Não há fidelidade ou multas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Como funciona o período de teste?</h4>
              <p className="text-gray-600">
                Oferecemos 7 dias grátis para você testar todas as funcionalidades PRO sem compromisso.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">Meus dados ficam seguros?</h4>
              <p className="text-gray-600">
                Absolutamente! Usamos criptografia de ponta e fazemos backup automático de todos os seus dados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
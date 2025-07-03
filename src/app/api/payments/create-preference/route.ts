import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configurar cliente MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payer, planType, workshopId } = body;

    // Base URL com fallback para desenvolvimento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Planos seguindo o padrao das paginas de captacao
    const plans = {
      free: {
        title: 'Plano Gratuito - Instauto Oficinas',
        price: 0,
        description: 'Receber e responder orcamentos + Acesso via celular'
      },
      pro: {
        title: 'Plano Profissional - Instauto Oficinas',
        price: 149,
        description: 'ERP + CRM completo + Ordens de Servico + Estoque + Relatorios + Suporte IA'
      }
    };

    const selectedPlan = plans[planType as keyof typeof plans] || plans.free;

    // Se for plano gratuito, nao criar preferencia de pagamento
    if (planType === 'free' || selectedPlan.price === 0) {
      return NextResponse.json({
        id: 'free_plan',
        redirect_url: '/dashboard?plan=free'
      });
    }

    const preferenceData = {
      items: [
        {
          id: planType,
          title: selectedPlan.title,
          description: selectedPlan.description,
          quantity: 1,
          unit_price: selectedPlan.price,
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: payer.name || 'Usuario Teste',
        email: payer.email || 'teste@exemplo.com',
        phone: {
          area_code: payer.phone?.area_code || '11',
          number: payer.phone?.number?.toString() || '999999999'
        },
        identification: {
          type: payer.identification?.type || 'CPF',
          number: payer.identification?.number || '00000000000'
        }
      },
      back_urls: {
        success: `${baseUrl}/dashboard?plan=${planType}&status=success`,
        failure: `${baseUrl}/oficinas/planos?status=error`,
        pending: `${baseUrl}/oficinas/planos?status=pending`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
        default_installments: 1
      },
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'INSTAUTO',
      external_reference: `workshop_${workshopId}_plan_${planType}_${Date.now()}`
    };

    console.log('Criando preferencia com dados:', JSON.stringify(preferenceData, null, 2));

    const result = await preference.create({ body: preferenceData });
    
    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });

  } catch (error) {
    console.error('Erro ao criar preferencia:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar pagamento', 
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 
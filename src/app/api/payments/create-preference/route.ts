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
    const { payer, planType, workshopId, paymentMethods } = body;

    // Base URL com fallback para desenvolvimento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Planos seguindo o padrão das páginas de captação
    const plans = {
      free: {
        title: 'Plano Gratuito - Instauto Oficinas',
        price: 0,
        description: 'Receber e responder orçamentos + Acesso via celular'
      },
      pro: {
        title: 'Plano Profissional - Instauto Oficinas',
        price: 149,
        description: 'ERP + CRM completo + Ordens de Serviço + Estoque + Relatórios + Suporte IA'
      }
    };

    const selectedPlan = plans[planType as keyof typeof plans] || plans.free;

    // Se for plano gratuito, não criar preferência de pagamento
    if (planType === 'free' || selectedPlan.price === 0) {
      return NextResponse.json({
        id: 'free_plan',
        redirect_url: '/dashboard?plan=free'
      });
    }

    // Configurações de pagamento aprimoradas
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
        name: payer.name || 'Usuário Teste',
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
      
      // Métodos de pagamento aprimorados
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12,
        default_installments: 1,
        default_payment_method_id: null
      },
      
      // PIX como opção prioritária
      payment_methods_configuration: {
        pix: {
          expires_in: 1800 // PIX expira em 30 minutos
        }
      },
      
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: 'INSTAUTO',
      external_reference: `workshop_${workshopId}_plan_${planType}_${Date.now()}`,
      
      // Metadados para análise
      metadata: {
        workshop_id: workshopId,
        plan_type: planType,
        created_at: new Date().toISOString(),
        source: 'oficinas_page'
      },
      
      // Expiração da preferência (24 horas)
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('Criando preferência aprimorada:', JSON.stringify(preferenceData, null, 2));

    const result = await preference.create({ body: preferenceData });
    
    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      qr_code: result.qr_code, // QR Code para PIX
      qr_code_base64: result.qr_code_base64
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar pagamento', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        code: 'PAYMENT_CREATION_ERROR'
      },
      { status: 500 }
    );
  }
} 
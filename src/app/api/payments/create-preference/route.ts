import { NextRequest, NextResponse } from 'next/server';
import { preference } from '@/lib/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, payer, external_reference } = body;

    const preferenceData = {
      items: [
        {
          id: items.id,
          title: items.title,
          quantity: 1,
          unit_price: items.price,
          currency_id: 'BRL'
        }
      ],
      payer: {
        name: payer.name,
        email: payer.email,
        phone: {
          area_code: payer.phone.area_code,
          number: payer.phone.number
        }
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/sucesso`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/erro`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pagamento/pendente`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/mercadopago`,
      statement_descriptor: 'INSTAUTO',
      external_reference: external_reference
    };

    const result = await preference.create({ body: preferenceData });
    
    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point
    });

  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
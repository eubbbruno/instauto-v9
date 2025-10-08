import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoService } from '@/lib/mercadopago-server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      planType, 
      paymentMethod, 
      amount, 
      userEmail, 
      userName, 
      externalReference 
    } = body

    // Validar dados obrigatórios
    if (!planType || !paymentMethod || !amount || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Preparar dados do pagador
    const [firstName, ...lastNameParts] = userName.split(' ')
    const lastName = lastNameParts.join(' ') || 'Usuario'

    const payer = {
      name: firstName,
      surname: lastName,
      email: userEmail,
      identification: {
        type: 'CPF',
        number: '11111111111' // Em produção, coletar CPF real
      }
    }

    // Preparar item do pagamento
    const items = [{
      id: `plan_${planType}`,
      title: `Plano ${planType.toUpperCase()} - InstaAuto`,
      description: planType === 'pro' 
        ? 'Plano PRO com recursos avançados para oficinas'
        : 'Plano FREE básico para oficinas',
      quantity: 1,
      unit_price: amount,
      currency_id: 'BRL'
    }]

    if (paymentMethod === 'pix') {
      // Para PIX, criar pagamento direto
      const pixPayment = await mercadoPagoService.createPixPayment({
        transaction_amount: amount,
        description: `Plano ${planType.toUpperCase()} - InstaAuto`,
        payer,
        external_reference: externalReference
      })

      // Salvar transação no banco
      await saveTransaction({
        external_reference: externalReference,
        user_email: userEmail,
        plan_type: planType,
        amount,
        payment_method: paymentMethod,
        status: 'pending',
        mercadopago_id: pixPayment.id?.toString()
      })

      return NextResponse.json({
        id: pixPayment.id,
        status: pixPayment.status,
        qr_code_base64: pixPayment.point_of_interaction?.transaction_data?.qr_code_base64,
        qr_code: pixPayment.point_of_interaction?.transaction_data?.qr_code,
        external_reference: externalReference
      })
    } else {
      // Para outros métodos, criar preferência
      const preferenceData = {
        items,
        payer,
        external_reference: externalReference,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso?ref=${externalReference}`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/erro?ref=${externalReference}`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/pendente?ref=${externalReference}`
        },
        auto_return: 'approved' as const,
        payment_methods: {
          excluded_payment_types: paymentMethod === 'credit' 
            ? [{ id: 'ticket' }, { id: 'bank_transfer' }]
            : [{ id: 'credit_card' }, { id: 'debit_card' }],
          installments: paymentMethod === 'credit' ? 12 : 1
        }
      }

      const preference = await mercadoPagoService.createPreference(preferenceData)

      // Salvar transação no banco
      await saveTransaction({
        external_reference: externalReference,
        user_email: userEmail,
        plan_type: planType,
        amount,
        payment_method: paymentMethod,
        status: 'pending',
        preference_id: preference.id
      })

      return NextResponse.json({
        id: preference.id,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
        external_reference: externalReference
      })
    }
  } catch (error) {
    console.error('Erro ao criar preferência de pagamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para salvar transação no Supabase
async function saveTransaction(data: {
  external_reference: string
  user_email: string
  plan_type: string
  amount: number
  payment_method: string
  status: string
  mercadopago_id?: string
  preference_id?: string
}) {
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .insert({
        external_reference: data.external_reference,
        user_email: data.user_email,
        plan_type: data.plan_type,
        amount: data.amount,
        payment_method: data.payment_method,
        status: data.status,
        mercadopago_id: data.mercadopago_id,
        preference_id: data.preference_id,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Erro ao salvar transação:', error)
    }
  } catch (error) {
    console.error('Erro ao salvar transação no Supabase:', error)
  }
}
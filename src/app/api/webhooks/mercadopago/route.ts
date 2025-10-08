import { NextRequest, NextResponse } from 'next/server'
import { mercadoPagoService } from '@/lib/mercadopago-server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook MercadoPago recebido:', body)

    // Processar webhook
    const result = await mercadoPagoService.processWebhook(body)
    
    if (result.processed && body.type === 'payment') {
      // Atualizar status no banco de dados
      await updatePaymentStatus(body.data.id, result.status, result.external_reference)
      
      // Se aprovado, ativar plano do usuário
      if (result.status === 'approved') {
        await activateUserPlan(result.external_reference)
      }
    }

    return NextResponse.json({ received: true, processed: result.processed })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    )
  }
}

// Função para atualizar status do pagamento
async function updatePaymentStatus(paymentId: string, status: string, externalReference: string) {
  try {
    const { error } = await supabase
      .from('payment_transactions')
      .update({
        status,
        updated_at: new Date().toISOString(),
        mercadopago_payment_id: paymentId
      })
      .eq('external_reference', externalReference)

    if (error) {
      console.error('Erro ao atualizar status do pagamento:', error)
    }
  } catch (error) {
    console.error('Erro ao atualizar status no Supabase:', error)
  }
}

// Função para ativar plano do usuário
async function activateUserPlan(externalReference: string) {
  try {
    // Buscar transação
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('external_reference', externalReference)
      .single()

    if (transactionError || !transaction) {
      console.error('Transação não encontrada:', externalReference)
      return
    }

    // Buscar usuário pelo email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', transaction.user_email)
      .single()

    if (profileError || !profile) {
      console.error('Usuário não encontrado:', transaction.user_email)
      return
    }

    // Atualizar plano do usuário
    if (transaction.plan_type === 'pro') {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan_type: 'pro',
          plan_activated_at: new Date().toISOString(),
          plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        })
        .eq('id', profile.id)

      if (updateError) {
        console.error('Erro ao ativar plano PRO:', updateError)
      } else {
        console.log('Plano PRO ativado para:', transaction.user_email)
        
        // Enviar email de confirmação (implementar depois)
        await sendActivationEmail(transaction.user_email, 'pro')
      }
    }
  } catch (error) {
    console.error('Erro ao ativar plano do usuário:', error)
  }
}

// Função para enviar email de ativação (placeholder)
async function sendActivationEmail(email: string, planType: string) {
  // TODO: Implementar envio de email
  console.log(`Email de ativação enviado para ${email} - Plano ${planType}`)
}
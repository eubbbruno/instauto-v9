import { NextRequest, NextResponse } from 'next/server';
import { payment } from '@/lib/mercadopago';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action, data, date_created, user_id } = body;

    console.log('Webhook MercadoPago recebido:', { type, action, data });

    const supabase = createServerClient();

    if (!supabase) {
      console.error('Supabase não configurado');
      return NextResponse.json(
        { error: 'Erro de configuração do banco de dados' },
        { status: 500 }
      );
    }

    // Processar diferentes tipos de notificação
    switch (type) {
      case 'payment':
        await handlePaymentNotification(data.id, supabase);
        break;
        
      case 'plan':
        await handlePlanNotification(data.id, supabase);
        break;
        
      case 'subscription':
        await handleSubscriptionNotification(data.id, supabase);
        break;
        
      case 'invoice':
        await handleInvoiceNotification(data.id, supabase);
        break;
        
      default:
        console.log(`Tipo de webhook não processado: ${type}`);
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Erro no webhook MercadoPago:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function handlePaymentNotification(paymentId: string, supabase: any) {
  try {
    // Buscar detalhes do pagamento no MercadoPago
    const paymentInfo = await payment.get({ id: paymentId });
    
    console.log(`Processando pagamento ${paymentId} - Status: ${paymentInfo.status}`);

    // Salvar/Atualizar pagamento no banco
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('external_id', paymentId)
      .single();

    const paymentData = {
      external_id: paymentId,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      amount: paymentInfo.transaction_amount,
      payment_method: paymentInfo.payment_method_id,
      payment_type: paymentInfo.payment_type_id,
      external_reference: paymentInfo.external_reference,
      payer_email: paymentInfo.payer?.email,
      description: paymentInfo.description,
      currency: paymentInfo.currency_id,
      date_approved: paymentInfo.date_approved,
      date_created: paymentInfo.date_created,
      updated_at: new Date().toISOString(),
      metadata: {
        notification_id: paymentInfo.id,
        merchant_order_id: paymentInfo.order?.id,
        platform: paymentInfo.platform_id
      }
    };

    if (existingPayment) {
      // Atualizar pagamento existente
      await supabase
        .from('payments')
        .update(paymentData)
        .eq('external_id', paymentId);
    } else {
      // Criar novo registro de pagamento
      await supabase
        .from('payments')
        .insert({
          ...paymentData,
          created_at: new Date().toISOString()
        });
    }

    // Processar ações baseadas no status
    switch (paymentInfo.status) {
      case 'approved':
        await handleApprovedPayment(paymentInfo, supabase);
        break;
        
      case 'pending':
        await handlePendingPayment(paymentInfo, supabase);
        break;
        
      case 'cancelled':
      case 'rejected':
        await handleFailedPayment(paymentInfo, supabase);
        break;
        
      case 'refunded':
        await handleRefundedPayment(paymentInfo, supabase);
        break;
    }

  } catch (error) {
    console.error(`Erro ao processar pagamento ${paymentId}:`, error);
    throw error;
  }
}

async function handleApprovedPayment(paymentInfo: any, supabase: any) {
  try {
    const externalRef = paymentInfo.external_reference;
    
    if (externalRef?.includes('workshop_') && externalRef?.includes('_plan_')) {
      // Pagamento de plano de oficina
      const [, workshopId, , planType] = externalRef.split('_');
      
      // Ativar plano da oficina
      await supabase
        .from('workshops')
        .update({
          plan_type: planType,
          plan_status: 'active',
          plan_activated_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', workshopId);

      // Criar notificação para oficina
      await createNotification(supabase, {
        user_id: workshopId,
        type: 'payment_approved',
        title: 'Pagamento Aprovado! 🎉',
        message: `Seu plano ${planType} foi ativado com sucesso. Aproveite todos os recursos!`,
        metadata: {
          payment_id: paymentInfo.id,
          plan_type: planType,
          amount: paymentInfo.transaction_amount
        }
      });

      console.log(`Plano ${planType} ativado para oficina ${workshopId}`);
    } else {
      // Pagamento de agendamento
      await supabase
        .from('appointments')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', externalRef);

      console.log(`Agendamento ${externalRef} confirmado`);
    }

  } catch (error) {
    console.error('Erro ao processar pagamento aprovado:', error);
  }
}

async function handlePendingPayment(paymentInfo: any, supabase: any) {
  const externalRef = paymentInfo.external_reference;
  
  // Criar notificação de pagamento pendente
  const message = paymentInfo.payment_method_id === 'bolbradesco' 
    ? 'Aguardando confirmação do boleto bancário'
    : 'Pagamento pendente de confirmação';

  await createNotification(supabase, {
    user_id: externalRef?.split('_')[1] || 'system',
    type: 'payment_pending',
    title: 'Pagamento Pendente ⏳',
    message,
    metadata: {
      payment_id: paymentInfo.id,
      payment_method: paymentInfo.payment_method_id
    }
  });
}

async function handleFailedPayment(paymentInfo: any, supabase: any) {
  const externalRef = paymentInfo.external_reference;
  
  await createNotification(supabase, {
    user_id: externalRef?.split('_')[1] || 'system',
    type: 'payment_failed',
    title: 'Falha no Pagamento ❌',
    message: 'Houve um problema com seu pagamento. Tente novamente ou entre em contato conosco.',
    metadata: {
      payment_id: paymentInfo.id,
      status_detail: paymentInfo.status_detail
    }
  });
}

async function handleRefundedPayment(paymentInfo: any, supabase: any) {
  const externalRef = paymentInfo.external_reference;
  
  await createNotification(supabase, {
    user_id: externalRef?.split('_')[1] || 'system',
    type: 'payment_refunded',
    title: 'Estorno Processado 💰',
    message: `Estorno de R$ ${paymentInfo.transaction_amount.toFixed(2)} processado com sucesso.`,
    metadata: {
      payment_id: paymentInfo.id,
      refund_amount: paymentInfo.transaction_amount
    }
  });
}

async function createNotification(supabase: any, notification: {
  user_id: string;
  type: string;
  title: string;
  message: string;
  metadata?: any;
}) {
  try {
    await supabase
      .from('notifications')
      .insert({
        ...notification,
        read: false,
        created_at: new Date().toISOString()
      });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
  }
}

async function handlePlanNotification(planId: string, supabase: any) {
  console.log(`Processando notificação de plano: ${planId}`);
}

async function handleSubscriptionNotification(subscriptionId: string, supabase: any) {
  console.log(`Processando notificação de assinatura: ${subscriptionId}`);
}

async function handleInvoiceNotification(invoiceId: string, supabase: any) {
  console.log(`Processando notificação de fatura: ${invoiceId}`);
} 
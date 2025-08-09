import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { supabase } from '@/lib/supabase';

// Configurar cliente MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const payment = new Payment(client);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📝 [WEBHOOK MERCADOPAGO] Recebido:', body);

    // Verificar se é notificação de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      
      // Buscar detalhes do pagamento
      const paymentData = await payment.get({ id: paymentId });
      
      console.log('💳 [PAGAMENTO] Dados:', {
        id: paymentData.id,
        status: paymentData.status,
        status_detail: paymentData.status_detail,
        external_reference: paymentData.external_reference,
        transaction_amount: paymentData.transaction_amount
      });

      // Se pagamento foi aprovado
      if (paymentData.status === 'approved') {
        await processApprovedPayment(paymentData);
      }
    }

    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('❌ [WEBHOOK] Erro ao processar:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 500 }
    );
  }
}

async function processApprovedPayment(paymentData: any) {
  try {
    console.log('✅ [PAGAMENTO APROVADO] Processando...');
    
    // Extrair informações da external_reference
    // Formato: workshop_${workshopId}_plan_${planType}_${timestamp}
    const externalRef = paymentData.external_reference;
    if (!externalRef) {
      console.error('❌ External reference não encontrada');
      return;
    }

    const parts = externalRef.split('_');
    if (parts.length < 4) {
      console.error('❌ External reference inválida:', externalRef);
      return;
    }

    const workshopId = parts[1];
    const planType = parts[3];

    console.log('📊 [UPGRADE] Atualizando oficina:', { workshopId, planType });

    // Atualizar plano da oficina
    const { error: updateError } = await supabase
      .from('workshops')
      .update({ 
        plan_type: planType,
        updated_at: new Date().toISOString()
      })
      .eq('profile_id', workshopId);

    if (updateError) {
      console.error('❌ Erro ao atualizar oficina:', updateError);
      return;
    }

    // Registrar pagamento no histórico
    const { error: historyError } = await supabase
      .from('payment_history')
      .insert({
        user_id: workshopId,
        payment_id: paymentData.id,
        amount: paymentData.transaction_amount,
        currency: paymentData.currency_id,
        status: paymentData.status,
        plan_type: planType,
        external_reference: externalRef,
        payment_method: paymentData.payment_method_id,
        paid_at: new Date(paymentData.date_approved).toISOString(),
        created_at: new Date().toISOString()
      });

    if (historyError) {
      console.error('❌ Erro ao salvar histórico:', historyError);
    }

    console.log('🎉 [UPGRADE COMPLETO] Oficina atualizada para plano:', planType);

  } catch (error) {
    console.error('❌ [PROCESS PAYMENT] Erro:', error);
  }
}

// Para desenvolvimento local, aceitar GET também
export async function GET() {
  return NextResponse.json({ 
    message: 'Webhook MercadoPago funcionando',
    timestamp: new Date().toISOString()
  });
}

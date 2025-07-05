import { NextRequest, NextResponse } from 'next/server';
import { createRefund } from '@/lib/mercadopago';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, amount, reason, workshopId } = body;

    // Validações
    if (!paymentId) {
      return NextResponse.json(
        { error: 'ID do pagamento é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`Iniciando estorno para pagamento ${paymentId}...`);

    // Criar estorno no MercadoPago
    const refund = await createRefund(paymentId, amount);

    // Salvar no banco de dados
    const supabase = createClient();
    
    const { data: refundRecord, error: dbError } = await supabase
      .from('refunds')
      .insert({
        payment_id: paymentId,
        external_refund_id: refund.id,
        amount: refund.amount || amount,
        status: refund.status,
        reason: reason || 'Estorno solicitado pelo sistema',
        workshop_id: workshopId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar estorno no banco:', dbError);
      // Continua mesmo com erro no banco, pois o estorno já foi processado
    }

    // Atualizar status do pagamento original
    await supabase
      .from('payments')
      .update({
        status: 'refunded',
        refund_id: refund.id,
        updated_at: new Date().toISOString()
      })
      .eq('external_id', paymentId);

    console.log(`Estorno ${refund.id} criado com sucesso!`);

    return NextResponse.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        created_date: refund.date_created
      }
    });

  } catch (error) {
    console.error('Erro ao processar estorno:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar estorno', 
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 
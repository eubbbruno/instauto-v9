import { NextRequest, NextResponse } from 'next/server';
import { diagnosticarVeiculo, DiagnosticoRequest } from '@/lib/openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sintomas, veiculo, contexto, userId } = body;

    // Validações básicas
    if (!sintomas || sintomas.trim().length < 10) {
      return NextResponse.json(
        { error: 'Descrição dos sintomas deve ter pelo menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (!veiculo || !veiculo.marca || !veiculo.modelo || !veiculo.ano) {
      return NextResponse.json(
        { error: 'Informações do veículo são obrigatórias' },
        { status: 400 }
      );
    }

    // Preparar request para IA
    const diagnosticoRequest: DiagnosticoRequest = {
      sintomas: sintomas.trim(),
      veiculo: {
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: parseInt(veiculo.ano),
        kilometragem: veiculo.kilometragem ? parseInt(veiculo.kilometragem) : undefined
      },
      contexto: contexto?.trim()
    };

    console.log('Iniciando diagnóstico IA para:', diagnosticoRequest);

    // Chamar IA para diagnóstico
    const diagnostico = await diagnosticarVeiculo(diagnosticoRequest);

    // Salvar no banco para histórico
    const supabase = createClient();
    
    const { data: diagnosticoSalvo, error: dbError } = await supabase
      .from('diagnosticos_ia')
      .insert({
        user_id: userId,
        sintomas,
        veiculo_info: veiculo,
        contexto,
        resultado: diagnostico,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar diagnóstico:', dbError);
      // Continua mesmo com erro no banco
    }

    // Criar notificação para o usuário
    if (userId) {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'diagnostic_completed',
          title: 'Diagnóstico IA Concluído 🔧',
          message: `Encontramos ${diagnostico.problemasPossiveis.length} possível(is) problema(s) no seu veículo.`,
          read: false,
          metadata: {
            diagnostic_id: diagnosticoSalvo?.id,
            vehicle: `${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}`,
            problems_count: diagnostico.problemasPossiveis.length
          },
          created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
      success: true,
      diagnostico,
      diagnosticoId: diagnosticoSalvo?.id
    });

  } catch (error) {
    console.error('Erro na API de diagnóstico:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar diagnóstico',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

// Endpoint para buscar histórico de diagnósticos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    const { data: diagnosticos, error } = await supabase
      .from('diagnosticos_ia')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      diagnosticos: diagnosticos || []
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar histórico de diagnósticos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
} 
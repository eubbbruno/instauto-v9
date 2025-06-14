import { NextRequest, NextResponse } from 'next/server';

// Mock de dados dos agendamentos (mesmo do route.ts principal)
const mockAgendamentos = [
  {
    id: '1',
    motoristaId: '1',
    oficinaId: '1',
    veiculo: {
      id: '1',
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2020,
      placa: 'ABC-1234'
    },
    servico: 'Troca de freios',
    descricaoProblema: 'Freios fazendo barulho estranho',
    dataAgendamento: '2024-12-20T10:00:00Z',
    status: 'agendado',
    valorEstimado: 250.00,
    valorFinal: null,
    observacoes: '',
    criadoEm: '2024-12-15T14:30:00Z',
    atualizadoEm: '2024-12-15T14:30:00Z'
  },
  {
    id: '2',
    motoristaId: '1',
    oficinaId: '2',
    veiculo: {
      id: '2',
      marca: 'Honda',
      modelo: 'Civic',
      ano: 2019,
      placa: 'XYZ-5678'
    },
    servico: 'Revisão completa',
    descricaoProblema: 'Revisão periódica de 10.000 km',
    dataAgendamento: '2024-12-18T14:00:00Z',
    status: 'concluido',
    valorEstimado: 450.00,
    valorFinal: 420.00,
    observacoes: 'Serviço realizado conforme especificação.',
    criadoEm: '2024-12-10T09:20:00Z',
    atualizadoEm: '2024-12-18T16:30:00Z'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    const agendamento = mockAgendamentos.find(a => a.id === id);
    
    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    // TODO: Verificar se o usuário tem permissão para ver este agendamento

    return NextResponse.json({
      success: true,
      data: agendamento
    });

  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await request.json();
    
    const agendamento = mockAgendamentos.find(a => a.id === id);
    
    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    // TODO: Verificar se o usuário tem permissão para editar este agendamento
    // TODO: Validar transições de status permitidas

    const statusPermitidos = ['agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado'];
    
    if (data.status && !statusPermitidos.includes(data.status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    // Simular atualização
    const agendamentoAtualizado = {
      ...agendamento,
      ...data,
      id, // Garantir que o ID não seja alterado
      atualizadoEm: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Agendamento atualizado com sucesso',
      data: agendamentoAtualizado
    });

  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    const { id } = params;
    
    const agendamento = mockAgendamentos.find(a => a.id === id);
    
    if (!agendamento) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    // TODO: Verificar se o usuário tem permissão para cancelar este agendamento
    // TODO: Verificar se o agendamento pode ser cancelado (status)

    if (agendamento.status === 'concluido') {
      return NextResponse.json(
        { error: 'Não é possível cancelar um agendamento já concluído' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agendamento cancelado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
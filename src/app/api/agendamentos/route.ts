import { NextRequest, NextResponse } from 'next/server';

// Mock de dados dos agendamentos
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
    status: 'agendado', // agendado, confirmado, em_andamento, concluido, cancelado
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
    observacoes: 'Serviço realizado conforme especificação. Filtro de ar estava muito sujo.',
    criadoEm: '2024-12-10T09:20:00Z',
    atualizadoEm: '2024-12-18T16:30:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    // TODO: Extrair user ID do token JWT real
    const userId = token.split('_')[2]; // Mock

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const oficinaId = searchParams.get('oficinaId');
    const limite = parseInt(searchParams.get('limite') || '10');
    const pagina = parseInt(searchParams.get('pagina') || '1');

    let agendamentos = [...mockAgendamentos];

    // Filtrar por usuário (dependendo se é motorista ou oficina)
    // TODO: Implementar lógica baseada no tipo de usuário
    agendamentos = agendamentos.filter(a => a.motoristaId === userId);

    // Filtros
    if (status) {
      agendamentos = agendamentos.filter(a => a.status === status);
    }

    if (oficinaId) {
      agendamentos = agendamentos.filter(a => a.oficinaId === oficinaId);
    }

    // Ordenar por data de criação (mais recente primeiro)
    agendamentos.sort((a, b) => 
      new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()
    );

    // Paginação
    const total = agendamentos.length;
    const inicio = (pagina - 1) * limite;
    const fim = inicio + limite;
    agendamentos = agendamentos.slice(inicio, fim);

    return NextResponse.json({
      success: true,
      data: agendamentos,
      meta: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    // TODO: Extrair user ID do token JWT real
    const userId = token.split('_')[2]; // Mock

    const data = await request.json();
    const {
      oficinaId,
      veiculoId,
      servico,
      descricaoProblema,
      dataAgendamento,
      observacoes
    } = data;

    // Validações básicas
    if (!oficinaId || !veiculoId || !servico || !dataAgendamento) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // Validar se a data do agendamento é futura
    const dataAgenda = new Date(dataAgendamento);
    if (dataAgenda <= new Date()) {
      return NextResponse.json(
        { error: 'Data do agendamento deve ser futura' },
        { status: 400 }
      );
    }

    // TODO: Verificar se a oficina existe
    // TODO: Verificar se o veículo pertence ao usuário
    // TODO: Verificar disponibilidade da oficina na data/hora

    const novoAgendamento = {
      id: `${Date.now()}`,
      motoristaId: userId,
      oficinaId,
      veiculo: {
        id: veiculoId,
        marca: 'Toyota', // Mock - buscar dados reais do veículo
        modelo: 'Corolla',
        ano: 2020,
        placa: 'ABC-1234'
      },
      servico,
      descricaoProblema,
      dataAgendamento,
      status: 'agendado',
      valorEstimado: null,
      valorFinal: null,
      observacoes: observacoes || '',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: novoAgendamento
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
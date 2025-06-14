import { NextRequest, NextResponse } from 'next/server';

// Mock de dados das oficinas
const mockOficinas = [
  {
    id: '1',
    nome: 'Auto Center Silva',
    cnpj: '12.345.678/0001-99',
    telefone: '(11) 3333-1111',
    email: 'contato@autosilva.com',
    endereco: 'Rua das Oficinas, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    coordenadas: { lat: -23.5505, lng: -46.6333 },
    servicos: ['Freios', 'Suspensão', 'Motor', 'Elétrica'],
    avaliacoes: {
      media: 4.5,
      total: 127
    },
    horarioFuncionamento: {
      segunda: '08:00-18:00',
      terca: '08:00-18:00',
      quarta: '08:00-18:00',
      quinta: '08:00-18:00',
      sexta: '08:00-18:00',
      sabado: '08:00-12:00',
      domingo: 'Fechado'
    },
    ativa: true,
    criadaEm: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    nome: 'Mecânica do João',
    cnpj: '98.765.432/0001-11',
    telefone: '(11) 3333-2222',
    email: 'joao@mecanica.com',
    endereco: 'Av. Principal, 456',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-568',
    coordenadas: { lat: -23.5515, lng: -46.6343 },
    servicos: ['Motor', 'Transmissão', 'Ar Condicionado'],
    avaliacoes: {
      media: 4.2,
      total: 89
    },
    horarioFuncionamento: {
      segunda: '07:30-17:30',
      terca: '07:30-17:30',
      quarta: '07:30-17:30',
      quinta: '07:30-17:30',
      sexta: '07:30-17:30',
      sabado: '07:30-12:00',
      domingo: 'Fechado'
    },
    ativa: true,
    criadaEm: '2024-01-15T14:30:00Z'
  },
  {
    id: '3',
    nome: 'Oficina Express',
    cnpj: '11.222.333/0001-44',
    telefone: '(11) 3333-3333',
    email: 'contato@express.com',
    endereco: 'Rua Rápida, 789',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-569',
    coordenadas: { lat: -23.5525, lng: -46.6353 },
    servicos: ['Freios', 'Pneus', 'Alinhamento', 'Balanceamento'],
    avaliacoes: {
      media: 4.8,
      total: 203
    },
    horarioFuncionamento: {
      segunda: '08:00-19:00',
      terca: '08:00-19:00',
      quarta: '08:00-19:00',
      quinta: '08:00-19:00',
      sexta: '08:00-19:00',
      sabado: '08:00-16:00',
      domingo: '09:00-13:00'
    },
    ativa: true,
    criadaEm: '2024-01-20T09:15:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cidade = searchParams.get('cidade');
    const servico = searchParams.get('servico');
    const avaliacaoMin = parseFloat(searchParams.get('avaliacao') || '0');
    const limite = parseInt(searchParams.get('limite') || '10');
    const pagina = parseInt(searchParams.get('pagina') || '1');

    let oficinas = [...mockOficinas];

    // Filtros
    if (cidade) {
      oficinas = oficinas.filter(o => 
        o.cidade.toLowerCase().includes(cidade.toLowerCase())
      );
    }

    if (servico) {
      oficinas = oficinas.filter(o => 
        o.servicos.some(s => 
          s.toLowerCase().includes(servico.toLowerCase())
        )
      );
    }

    if (avaliacaoMin > 0) {
      oficinas = oficinas.filter(o => o.avaliacoes.media >= avaliacaoMin);
    }

    // Paginação
    const total = oficinas.length;
    const inicio = (pagina - 1) * limite;
    const fim = inicio + limite;
    oficinas = oficinas.slice(inicio, fim);

    return NextResponse.json({
      success: true,
      data: oficinas,
      meta: {
        total,
        pagina,
        limite,
        totalPaginas: Math.ceil(total / limite)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar oficinas:', error);
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

    const data = await request.json();
    const {
      nome,
      cnpj,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep,
      servicos,
      horarioFuncionamento
    } = data;

    // Validações básicas
    if (!nome || !cnpj || !telefone || !email || !endereco) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não preenchidos' },
        { status: 400 }
      );
    }

    // TODO: Integrar com backend Express
    const novaOficina = {
      id: `${Date.now()}`,
      nome,
      cnpj,
      telefone,
      email,
      endereco,
      cidade,
      estado,
      cep,
      coordenadas: { lat: -23.5505, lng: -46.6333 }, // Mock
      servicos: servicos || [],
      avaliacoes: {
        media: 0,
        total: 0
      },
      horarioFuncionamento: horarioFuncionamento || {},
      ativa: true,
      criadaEm: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Oficina cadastrada com sucesso',
      data: novaOficina
    }, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar oficina:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
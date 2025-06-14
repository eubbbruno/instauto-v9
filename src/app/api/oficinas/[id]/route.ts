import { NextRequest, NextResponse } from 'next/server';

// Mock de dados das oficinas (mesmo do route.ts principal)
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
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const oficina = mockOficinas.find(o => o.id === id);
    
    if (!oficina) {
      return NextResponse.json(
        { error: 'Oficina não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: oficina
    });

  } catch (error) {
    console.error('Erro ao buscar oficina:', error);
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
    
    const oficina = mockOficinas.find(o => o.id === id);
    
    if (!oficina) {
      return NextResponse.json(
        { error: 'Oficina não encontrada' },
        { status: 404 }
      );
    }

    // TODO: Verificar se o usuário tem permissão para editar esta oficina

    // Simular atualização
    const oficinaAtualizada = {
      ...oficina,
      ...data,
      id, // Garantir que o ID não seja alterado
      atualizadaEm: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Oficina atualizada com sucesso',
      data: oficinaAtualizada
    });

  } catch (error) {
    console.error('Erro ao atualizar oficina:', error);
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
    
    const oficina = mockOficinas.find(o => o.id === id);
    
    if (!oficina) {
      return NextResponse.json(
        { error: 'Oficina não encontrada' },
        { status: 404 }
      );
    }

    // TODO: Verificar se o usuário tem permissão para deletar esta oficina
    // TODO: Integrar com backend Express

    return NextResponse.json({
      success: true,
      message: 'Oficina removida com sucesso'
    });

  } catch (error) {
    console.error('Erro ao remover oficina:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
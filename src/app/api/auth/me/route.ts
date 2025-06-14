import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token de autenticação não encontrado' },
        { status: 401 }
      );
    }

    // TODO: Integrar com backend Express para validar token JWT
    // Por enquanto, simulando validação do token
    
    if (!token.startsWith('mock_token_')) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Extrair ID do usuário do token mock
    const userId = token.split('_')[2];
    
    // Mock de dados do usuário baseado no ID
    const mockUsers: Record<string, any> = {
      '1': {
        id: '1',
        email: 'motorista@test.com',
        nome: 'João Silva',
        tipo: 'motorista',
        telefone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        criadoEm: '2024-01-15T10:30:00Z'
      },
      '2': {
        id: '2',
        email: 'oficina@test.com',
        nome: 'Oficina Central',
        tipo: 'oficina',
        telefone: '(11) 3333-3333',
        cnpj: '12.345.678/0001-99',
        endereco: 'Rua das Oficinas, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        servicos: ['Freios', 'Suspensão', 'Motor'],
        criadoEm: '2024-01-10T14:20:00Z'
      }
    };

    const user = mockUsers[userId];
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
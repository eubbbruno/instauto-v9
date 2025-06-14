import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, senha, tipo } = await request.json();

    // Validação básica
    if (!email || !senha || !tipo) {
      return NextResponse.json(
        { error: 'Email, senha e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar tipo de usuário
    if (!['motorista', 'oficina'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de usuário inválido' },
        { status: 400 }
      );
    }

    // TODO: Integrar com backend Express
    // Por enquanto, simulando autenticação
    const mockUsers = {
      'motorista@test.com': {
        id: '1',
        email: 'motorista@test.com',
        nome: 'João Silva',
        tipo: 'motorista',
        senha: '123456'
      },
      'oficina@test.com': {
        id: '2',
        email: 'oficina@test.com',
        nome: 'Oficina Central',
        tipo: 'oficina',
        senha: '123456'
      }
    };

    const user = mockUsers[email as keyof typeof mockUsers];
    
    if (!user || user.senha !== senha || user.tipo !== tipo) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Simular JWT token
    const token = `mock_token_${user.id}_${Date.now()}`;

    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        tipo: user.tipo
      },
      token
    });

    // Definir cookie httpOnly para o token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, senha } = body;
    
    // Aceitar tanto "password" quanto "senha"
    const userPassword = password || senha;

    // Validação básica
    if (!email || !userPassword) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Credenciais de teste atualizadas conforme o site
    const mockUsers = {
      'joao@email.com': {
        id: '1',
        email: 'joao@email.com',
        nome: 'João Silva',
        tipo: 'motorista',
        senha: '123456'
      },
      'carlos@autocenter.com': {
        id: '2',
        email: 'carlos@autocenter.com',
        nome: 'Carlos Silva - Auto Center Silva',
        tipo: 'oficina',
        senha: '123456'
      }
    };

    const user = mockUsers[email as keyof typeof mockUsers];
    
    if (!user || user.senha !== userPassword) {
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
      usuario: {
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
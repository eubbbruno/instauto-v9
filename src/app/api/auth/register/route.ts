import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, senha, nome, tipo, telefone } = data;

    // Validação básica
    if (!email || !senha || !nome || !tipo) {
      return NextResponse.json(
        { error: 'Email, senha, nome e tipo são obrigatórios' },
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

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Validar senha (mínimo 6 caracteres)
    if (senha.length < 6) {
      return NextResponse.json(
        { error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // TODO: Integrar com backend Express
    // Por enquanto, simulando cadastro bem-sucedido
    
    // Verificar se usuário já existe (mock)
    const existingEmails = ['motorista@test.com', 'oficina@test.com'];
    if (existingEmails.includes(email)) {
      return NextResponse.json(
        { error: 'Email já cadastrado' },
        { status: 409 }
      );
    }

    const newUser = {
      id: `${Date.now()}`,
      email,
      nome,
      tipo,
      telefone: telefone || null,
      criadoEm: new Date().toISOString(),
      ...(tipo === 'oficina' && {
        cnpj: data.cnpj,
        endereco: data.endereco,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
        servicos: data.servicos || []
      }),
      ...(tipo === 'motorista' && {
        cpf: data.cpf,
        dataNascimento: data.dataNascimento
      })
    };

    // Simular JWT token
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    const response = NextResponse.json({
      success: true,
      message: 'Cadastro realizado com sucesso',
      user: {
        id: newUser.id,
        email: newUser.email,
        nome: newUser.nome,
        tipo: newUser.tipo
      },
      token
    }, { status: 201 });

    // Definir cookie httpOnly para o token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 
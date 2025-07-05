import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { 
      tipo, 
      veiculo, 
      sintomas, 
      quilometragem, 
      ultimaManutencao,
      orcamento,
      localizacao 
    } = await request.json();

    let prompt = '';
    let systemMessage = '';

    switch (tipo) {
      case 'diagnostico':
        systemMessage = `Você é um especialista automotivo com 20+ anos de experiência. Analise sintomas de veículos e forneça diagnósticos precisos com estimativas de custo realistas para o mercado brasileiro.`;
        prompt = `
DIAGNÓSTICO AUTOMOTIVO COMPLETO

Veículo: ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}
Motor: ${veiculo.motor || 'Não informado'}
Quilometragem: ${quilometragem || 'Não informada'}
Sintomas relatados: ${sintomas}
${ultimaManutencao ? `Última manutenção: ${ultimaManutencao}` : ''}

Forneça um diagnóstico estruturado incluindo:

1. **POSSÍVEIS CAUSAS** (3-5 mais prováveis)
2. **GRAVIDADE** (Baixa/Média/Alta/Crítica)
3. **CUSTOS ESTIMADOS** (peças + mão de obra)
4. **URGÊNCIA** (pode esperar/alguns dias/imediato)
5. **RECOMENDAÇÕES** específicas
6. **PREVENÇÃO** para evitar problemas futuros

Use valores reais do mercado brasileiro 2024.
`;
        break;

      case 'manutencao_preventiva':
        systemMessage = `Você é um consultor especializado em manutenção preventiva automotiva. Crie planos personalizados baseados no veículo, uso e condições brasileiras.`;
        prompt = `
PLANO DE MANUTENÇÃO PREVENTIVA

Veículo: ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}
Motor: ${veiculo.motor || 'Não informado'}
Quilometragem atual: ${quilometragem || 'Não informada'}
Uso: ${veiculo.uso || 'Urbano/rodoviário misto'}
Localização: ${localizacao || 'Brasil'}

Crie um plano estruturado:

1. **MANUTENÇÃO IMEDIATA** (próximos 1000km)
2. **CURTO PRAZO** (próximos 5000km)
3. **MÉDIO PRAZO** (próximos 10000km)
4. **LONGO PRAZO** (próximos 20000km)

Para cada item inclua:
- Serviço/peça específica
- Quilometragem ou tempo recomendado
- Custo estimado
- Importância (crítica/alta/média)
- Consequências se não for feita

Considere clima tropical brasileiro e condições de trânsito urbano.
`;
        break;

      case 'comparacao_precos':
        systemMessage = `Você é um especialista em precificação automotiva no Brasil. Compare preços de serviços e peças entre diferentes tipos de estabelecimentos.`;
        prompt = `
COMPARAÇÃO DE PREÇOS - SERVIÇOS AUTOMOTIVOS

Serviço solicitado: ${sintomas}
Veículo: ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}
Localização: ${localizacao || 'São Paulo, SP'}
Orçamento disponível: ${orcamento ? `R$ ${orcamento}` : 'Não informado'}

Compare preços entre:

1. **CONCESSIONÁRIA AUTORIZADA**
   - Preço médio: R$ XXX
   - Vantagens: garantia, peças originais, especialização
   - Desvantagens: preço elevado

2. **OFICINA ESPECIALIZADA**
   - Preço médio: R$ XXX
   - Vantagens: especialização na marca, preço intermediário
   - Desvantagens: menos garantia que concessionária

3. **OFICINA GERAL CONFIÁVEL**
   - Preço médio: R$ XXX
   - Vantagens: preço acessível, flexibilidade
   - Desvantagens: menos especialização

4. **REDE DE OFICINAS**
   - Preço médio: R$ XXX
   - Vantagens: padronização, várias unidades
   - Desvantagens: menos personalização

**RECOMENDAÇÃO FINAL:** Melhor custo-benefício considerando qualidade, preço e garantia.

Inclua dicas para negociar e quando vale pagar mais.
`;
        break;

      case 'recomendacao_pecas':
        systemMessage = `Você é um especialista em autopeças no Brasil. Recomende as melhores opções considerando qualidade, preço e disponibilidade.`;
        prompt = `
RECOMENDAÇÃO DE PEÇAS AUTOMOTIVAS

Veículo: ${veiculo.marca} ${veiculo.modelo} ${veiculo.ano}
Peça necessária: ${sintomas}
Orçamento: ${orcamento ? `R$ ${orcamento}` : 'Flexível'}

Analise as opções:

1. **PEÇAS ORIGINAIS**
   - Marcas/fornecedores
   - Preço médio
   - Onde encontrar
   - Prós e contras

2. **PEÇAS GENUÍNAS**
   - Alternativas de qualidade similar
   - Diferença de preço
   - Garantia oferecida

3. **PEÇAS AFTERMARKET PREMIUM**
   - Marcas recomendadas
   - Relação custo-benefício
   - Disponibilidade no Brasil

4. **PEÇAS ECONÔMICAS**
   - Quando considerar
   - Riscos e limitações
   - Melhores marcas nesta categoria

**INSTALAÇÃO:**
- Complexidade do serviço
- Pode fazer em casa? (DIY)
- Ferramentas necessárias
- Quando procurar profissional

**COMPATIBILIDADE:** Verificações importantes antes da compra.

Foque em opções disponíveis no mercado brasileiro.
`;
        break;

      default:
        return NextResponse.json({ error: 'Tipo de análise inválido' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const resposta = completion.choices[0]?.message?.content;

    if (!resposta) {
      throw new Error('Nenhuma resposta gerada pela IA');
    }

    // Estruturar a resposta baseada no tipo
    const responseData: Record<string, unknown> = {
      tipo,
      resposta,
      veiculo,
      timestamp: new Date().toISOString(),
    };

    switch (tipo) {
      case 'diagnostico':
        responseData.sintomas = sintomas;
        responseData.quilometragem = quilometragem;
        break;
      case 'manutencao_preventiva':
        responseData.quilometragem = quilometragem;
        responseData.ultimaManutencao = ultimaManutencao;
        break;
      case 'comparacao_precos':
        responseData.servico = sintomas;
        responseData.orcamento = orcamento;
        responseData.localizacao = localizacao;
        break;
      case 'recomendacao_pecas':
        responseData.peca = sintomas;
        responseData.orcamento = orcamento;
        break;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error: unknown) {
    console.error('Erro na API de diagnóstico expandida:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}

// GET para listar tipos disponíveis
export async function GET() {
  return NextResponse.json({
    tipos_disponveis: [
      {
        id: 'diagnostico',
        nome: 'Diagnóstico de Problemas',
        descricao: 'Analisa sintomas e identifica possíveis causas'
      },
      {
        id: 'manutencao_preventiva',
        nome: 'Manutenção Preventiva',
        descricao: 'Cria plano personalizado de manutenção'
      },
      {
        id: 'comparacao_precos',
        nome: 'Comparação de Preços',
        descricao: 'Compara preços entre diferentes tipos de oficinas'
      },
      {
        id: 'recomendacao_pecas',
        nome: 'Recomendação de Peças',
        descricao: 'Sugere as melhores opções de peças por custo-benefício'
      }
    ]
  });
} 
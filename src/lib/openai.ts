import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface DiagnosticoRequest {
  sintomas: string;
  veiculo: {
    marca: string;
    modelo: string;
    ano: number;
    kilometragem?: number;
  };
  contexto?: string;
}

export interface DiagnosticoResponse {
  problemasPossiveis: Array<{
    nome: string;
    probabilidade: 'alta' | 'media' | 'baixa';
    descricao: string;
    urgencia: 'critica' | 'alta' | 'media' | 'baixa';
    custoEstimado: {
      min: number;
      max: number;
    };
  }>;
  recomendacoes: string[];
  proximosPassos: string[];
  avisoLegal: string;
}

export async function diagnosticarVeiculo(request: DiagnosticoRequest): Promise<DiagnosticoResponse> {
  try {
    const prompt = criarPromptDiagnostico(request);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Você é um especialista em diagnóstico automotivo com 20 anos de experiência. 
          Sua função é analisar sintomas descritos pelo usuário e fornecer possíveis diagnósticos.
          
          IMPORTANTE:
          - Sempre mencione que é necessária inspeção presencial
          - Forneça estimativas de custo em reais (R$)
          - Classifique urgência e probabilidade
          - Seja específico e técnico, mas compreensível
          - Sempre inclua aviso legal sobre necessidade de inspeção profissional
          
          Responda SEMPRE em JSON válido no formato especificado.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('Resposta vazia da IA');
    }

    // Parse da resposta JSON
    const diagnostico = JSON.parse(responseContent) as DiagnosticoResponse;
    
    // Validar e sanitizar resposta
    return validarDiagnostico(diagnostico);
    
  } catch (error) {
    console.error('Erro no diagnóstico IA:', error);
    throw new Error('Erro ao processar diagnóstico. Tente novamente.');
  }
}

function criarPromptDiagnostico(request: DiagnosticoRequest): string {
  return `
Analise os seguintes sintomas automotivos e forneça um diagnóstico:

SINTOMAS: ${request.sintomas}

VEÍCULO:
- Marca: ${request.veiculo.marca}
- Modelo: ${request.veiculo.modelo}
- Ano: ${request.veiculo.ano}
- Quilometragem: ${request.veiculo.kilometragem || 'Não informado'}

CONTEXTO ADICIONAL: ${request.contexto || 'Nenhum'}

Responda em JSON com o seguinte formato:
{
  "problemasPossiveis": [
    {
      "nome": "Nome do problema",
      "probabilidade": "alta|media|baixa",
      "descricao": "Descrição técnica do problema",
      "urgencia": "critica|alta|media|baixa",
      "custoEstimado": {
        "min": 100,
        "max": 500
      }
    }
  ],
  "recomendacoes": [
    "Recomendação 1",
    "Recomendação 2"
  ],
  "proximosPassos": [
    "Passo 1",
    "Passo 2"
  ],
  "avisoLegal": "Este diagnóstico é preliminar. É essencial realizar inspeção presencial com um mecânico qualificado para confirmação e reparo seguro."
}

Considere problemas específicos para a marca/modelo/ano do veículo mencionado.
`;
}

function validarDiagnostico(diagnostico: any): DiagnosticoResponse {
  // Validações básicas
  if (!diagnostico.problemasPossiveis || !Array.isArray(diagnostico.problemasPossiveis)) {
    throw new Error('Formato de resposta inválido');
  }

  // Garantir que há pelo menos um problema possível
  if (diagnostico.problemasPossiveis.length === 0) {
    diagnostico.problemasPossiveis = [{
      nome: "Diagnóstico Indeterminado",
      probabilidade: "media",
      descricao: "Os sintomas descritos requerem inspeção presencial para diagnóstico preciso.",
      urgencia: "media",
      custoEstimado: { min: 50, max: 200 }
    }];
  }

  // Garantir aviso legal
  if (!diagnostico.avisoLegal) {
    diagnostico.avisoLegal = "Este diagnóstico é preliminar e baseado apenas nos sintomas descritos. É essencial realizar inspeção presencial com um mecânico qualificado para confirmação precisa e reparo seguro.";
  }

  // Garantir arrays
  diagnostico.recomendacoes = diagnostico.recomendacoes || [];
  diagnostico.proximosPassos = diagnostico.proximosPassos || [];

  return diagnostico;
}

// Função para sugerir oficinas baseado no diagnóstico
export async function sugerirOficinas(diagnostico: DiagnosticoResponse, localizacao?: string) {
  // Esta função pode ser expandida para integrar com o banco de oficinas
  // Por agora, retorna sugestões genéricas
  
  const especialidades = diagnostico.problemasPossiveis.map(p => {
    if (p.nome.toLowerCase().includes('motor')) return 'motor';
    if (p.nome.toLowerCase().includes('freio')) return 'freios';
    if (p.nome.toLowerCase().includes('suspensao')) return 'suspensao';
    if (p.nome.toLowerCase().includes('transmissao')) return 'transmissao';
    return 'geral';
  });

  return {
    especialidadesRecomendadas: [...new Set(especialidades)],
    mensagem: 'Procure oficinas especializadas nas áreas identificadas no diagnóstico.'
  };
} 
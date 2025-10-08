import OpenAI from 'openai'

// Configuração do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface DiagnosticInput {
  symptoms: string[]
  vehicleInfo: {
    make: string
    model: string
    year: number
    mileage?: number
    fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid'
  }
  additionalInfo?: string
  urgencyLevel?: 'low' | 'medium' | 'high'
}

export interface DiagnosticResult {
  diagnosis: string
  confidence: number
  possibleCauses: string[]
  recommendedActions: string[]
  estimatedCost: {
    min: number
    max: number
    currency: string
  }
  urgency: 'low' | 'medium' | 'high'
  preventiveTips: string[]
  relatedServices: string[]
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: string
}

class AIService {
  private systemPrompt = `
Você é um especialista em diagnóstico automotivo da InstaAuto, uma plataforma que conecta motoristas a oficinas mecânicas no Brasil. 

Suas responsabilidades:
1. Analisar sintomas relatados pelos motoristas
2. Fornecer diagnósticos precisos e confiáveis
3. Sugerir ações recomendadas
4. Estimar custos em reais (BRL)
5. Classificar urgência do problema
6. Dar dicas preventivas

Diretrizes importantes:
- Sempre responda em português brasileiro
- Seja preciso mas acessível ao público leigo
- Considere o contexto brasileiro (clima, combustíveis, marcas populares)
- Priorize segurança do motorista
- Sugira sempre procurar um profissional para confirmação
- Use valores em reais (R$) para estimativas de custo
- Considere peças e mão de obra do mercado brasileiro

Formato de resposta:
- Diagnóstico principal
- Nível de confiança (0-100%)
- Possíveis causas (lista)
- Ações recomendadas (lista)
- Estimativa de custo (mín-máx em R$)
- Nível de urgência (baixo/médio/alto)
- Dicas preventivas
- Serviços relacionados
`

  // Diagnóstico inteligente
  async diagnoseVehicle(input: DiagnosticInput): Promise<DiagnosticResult> {
    try {
      const prompt = this.buildDiagnosticPrompt(input)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })

      const response = completion.choices[0]?.message?.content
      if (!response) {
        throw new Error('Resposta vazia da IA')
      }

      return this.parseAIResponse(response)
    } catch (error) {
      console.error('Erro no diagnóstico IA:', error)
      throw new Error('Erro ao processar diagnóstico')
    }
  }

  // Chat interativo com IA
  async chatWithAI(messages: ChatMessage[]): Promise<string> {
    try {
      const chatMessages = [
        { role: "system" as const, content: this.systemPrompt },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: chatMessages,
        temperature: 0.4,
        max_tokens: 800
      })

      return completion.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'
    } catch (error) {
      console.error('Erro no chat IA:', error)
      throw new Error('Erro na conversa com IA')
    }
  }

  // Análise de imagem (para fotos de problemas)
  async analyzeVehicleImage(imageBase64: string, description?: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analise esta imagem de um problema automotivo. ${description ? `Contexto: ${description}` : ''} 
                       Forneça um diagnóstico detalhado em português brasileiro, incluindo possíveis causas e recomendações.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })

      return completion.choices[0]?.message?.content || 'Não foi possível analisar a imagem.'
    } catch (error) {
      console.error('Erro na análise de imagem:', error)
      throw new Error('Erro ao analisar imagem')
    }
  }

  // Sugestões de manutenção preventiva
  async getMaintenanceSuggestions(vehicleInfo: DiagnosticInput['vehicleInfo']): Promise<string[]> {
    try {
      const prompt = `
        Baseado nas informações do veículo:
        - Marca: ${vehicleInfo.make}
        - Modelo: ${vehicleInfo.model}
        - Ano: ${vehicleInfo.year}
        - Quilometragem: ${vehicleInfo.mileage || 'Não informada'}
        - Combustível: ${vehicleInfo.fuelType || 'Não informado'}
        
        Forneça 5-7 sugestões de manutenção preventiva específicas para este veículo,
        considerando o mercado brasileiro. Liste apenas as sugestões, uma por linha.
      `

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })

      const response = completion.choices[0]?.message?.content || ''
      return response.split('\n').filter(line => line.trim().length > 0)
    } catch (error) {
      console.error('Erro nas sugestões de manutenção:', error)
      return [
        'Troque o óleo do motor a cada 10.000 km ou 6 meses',
        'Verifique os pneus mensalmente (pressão e desgaste)',
        'Substitua o filtro de ar a cada 15.000 km',
        'Faça revisão do sistema de freios a cada 20.000 km',
        'Verifique o sistema de arrefecimento regularmente'
      ]
    }
  }

  // Construir prompt para diagnóstico
  private buildDiagnosticPrompt(input: DiagnosticInput): string {
    return `
DIAGNÓSTICO SOLICITADO:

Sintomas relatados:
${input.symptoms.map(symptom => `- ${symptom}`).join('\n')}

Informações do veículo:
- Marca: ${input.vehicleInfo.make}
- Modelo: ${input.vehicleInfo.model}
- Ano: ${input.vehicleInfo.year}
- Quilometragem: ${input.vehicleInfo.mileage || 'Não informada'}
- Combustível: ${input.vehicleInfo.fuelType || 'Não informado'}

${input.additionalInfo ? `Informações adicionais: ${input.additionalInfo}` : ''}

${input.urgencyLevel ? `Nível de urgência percebido: ${input.urgencyLevel}` : ''}

Por favor, forneça um diagnóstico completo seguindo o formato especificado no sistema.
    `
  }

  // Parsear resposta da IA
  private parseAIResponse(response: string): DiagnosticResult {
    // Esta é uma implementação simplificada
    // Em produção, você usaria regex ou parsing mais sofisticado
    
    const lines = response.split('\n').filter(line => line.trim())
    
    return {
      diagnosis: this.extractSection(response, 'diagnóstico') || 'Diagnóstico não disponível',
      confidence: this.extractConfidence(response) || 75,
      possibleCauses: this.extractList(response, 'causas') || ['Causa não identificada'],
      recommendedActions: this.extractList(response, 'ações') || ['Procure um mecânico'],
      estimatedCost: this.extractCost(response) || { min: 100, max: 500, currency: 'BRL' },
      urgency: this.extractUrgency(response) || 'medium',
      preventiveTips: this.extractList(response, 'dicas') || ['Mantenha manutenção em dia'],
      relatedServices: this.extractList(response, 'serviços') || ['Diagnóstico completo']
    }
  }

  private extractSection(text: string, section: string): string | null {
    const regex = new RegExp(`${section}[:\\s]*([^\\n]+)`, 'i')
    const match = text.match(regex)
    return match ? match[1].trim() : null
  }

  private extractConfidence(text: string): number | null {
    const regex = /(\d+)%/
    const match = text.match(regex)
    return match ? parseInt(match[1]) : null
  }

  private extractList(text: string, section: string): string[] | null {
    const regex = new RegExp(`${section}[:\\s]*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i')
    const match = text.match(regex)
    if (match) {
      return match[1]
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0)
    }
    return null
  }

  private extractCost(text: string): { min: number, max: number, currency: string } | null {
    const regex = /R\$\s*(\d+)(?:\s*-\s*R\$\s*(\d+))?/
    const match = text.match(regex)
    if (match) {
      const min = parseInt(match[1])
      const max = match[2] ? parseInt(match[2]) : min * 2
      return { min, max, currency: 'BRL' }
    }
    return null
  }

  private extractUrgency(text: string): 'low' | 'medium' | 'high' | null {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('alta') || lowerText.includes('urgente')) return 'high'
    if (lowerText.includes('baixa') || lowerText.includes('não urgente')) return 'low'
    return 'medium'
  }
}

// Instância singleton
export const aiService = new AIService()

// Hook para usar IA
export const useAI = () => {
  return aiService
}

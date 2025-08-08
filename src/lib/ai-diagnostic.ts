'use client'

export interface DiagnosticInput {
  photos?: File[]
  videos?: File[]
  audioDescription?: Blob
  textDescription: string
  vehicleInfo: {
    make: string
    model: string
    year: number
    mileage?: number
    fuelType?: 'gasoline' | 'diesel' | 'flex' | 'electric' | 'hybrid'
  }
  symptoms: {
    category: 'engine' | 'transmission' | 'brakes' | 'electrical' | 'suspension' | 'other'
    severity: 'low' | 'medium' | 'high' | 'critical'
    frequency: 'once' | 'sometimes' | 'often' | 'always'
    conditions: string[]
  }
  location?: {
    lat: number
    lng: number
  }
}

export interface DiagnosticResult {
  id: string
  confidence: number
  primaryDiagnosis: {
    issue: string
    description: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    urgency: 'can_wait' | 'schedule_soon' | 'urgent' | 'emergency'
    estimatedCost: {
      min: number
      max: number
      currency: 'BRL'
    }
  }
  possibleCauses: Array<{
    cause: string
    probability: number
    description: string
  }>
  recommendedActions: Array<{
    action: string
    priority: 'low' | 'medium' | 'high'
    timeframe: string
    description: string
  }>
  suggestedServices: Array<{
    service: string
    description: string
    estimatedDuration: string
    parts?: Array<{
      name: string
      estimatedCost: number
    }>
  }>
  nearbyOfficinas?: Array<{
    id: string
    name: string
    specialization: string[]
    rating: number
    distance: number
    estimatedCost: number
  }>
  preventiveMaintenance: Array<{
    service: string
    nextDue: string
    description: string
  }>
  safetyWarnings?: Array<{
    warning: string
    severity: 'info' | 'warning' | 'danger'
    action: string
  }>
  generatedAt: string
  expiresAt: string
}

export interface AIAnalysisRequest {
  input: DiagnosticInput
  userId: string
  vehicleId?: string
}

class AIDiagnosticManager {
  private apiEndpoint = '/api/ai/diagnostic'
  private maxFileSize = 50 * 1024 * 1024 // 50MB
  private supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp']
  private supportedVideoTypes = ['video/mp4', 'video/webm', 'video/mov']

  async analyzeProblem(input: DiagnosticInput, userId: string): Promise<DiagnosticResult | null> {
    try {
      console.log('🤖 Starting AI diagnostic analysis...')
      
      // Validate input
      const validation = this.validateInput(input)
      if (!validation.isValid) {
        throw new Error(`Invalid input: ${validation.errors.join(', ')}`)
      }

      // Prepare form data for file uploads
      const formData = new FormData()
      
      // Add photos
      if (input.photos) {
        input.photos.forEach((photo, index) => {
          formData.append(`photo_${index}`, photo)
        })
      }

      // Add videos
      if (input.videos) {
        input.videos.forEach((video, index) => {
          formData.append(`video_${index}`, video)
        })
      }

      // Add audio description
      if (input.audioDescription) {
        formData.append('audio_description', input.audioDescription)
      }

      // Add other data as JSON
      formData.append('diagnostic_data', JSON.stringify({
        textDescription: input.textDescription,
        vehicleInfo: input.vehicleInfo,
        symptoms: input.symptoms,
        location: input.location,
        userId
      }))

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Diagnostic analysis failed')
      }

      const result = await response.json()
      console.log('✅ AI diagnostic completed:', result.id)
      
      return result
    } catch (error) {
      console.error('❌ AI diagnostic error:', error)
      return null
    }
  }

  async getQuickSuggestions(description: string, vehicleInfo: DiagnosticInput['vehicleInfo']): Promise<string[]> {
    try {
      const response = await fetch('/api/ai/quick-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description,
          vehicleInfo
        })
      })

      if (!response.ok) return []

      const result = await response.json()
      return result.suggestions || []
    } catch (error) {
      console.error('❌ Quick suggestions error:', error)
      return []
    }
  }

  async analyzeImage(imageFile: File): Promise<string[]> {
    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('/api/ai/image-analysis', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) return []

      const result = await response.json()
      return result.insights || []
    } catch (error) {
      console.error('❌ Image analysis error:', error)
      return []
    }
  }

  async analyzeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)

      const response = await fetch('/api/ai/audio-analysis', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) return ''

      const result = await response.json()
      return result.transcription || ''
    } catch (error) {
      console.error('❌ Audio analysis error:', error)
      return ''
    }
  }

  private validateInput(input: DiagnosticInput): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check text description
    if (!input.textDescription || input.textDescription.trim().length < 10) {
      errors.push('Descrição do problema deve ter pelo menos 10 caracteres')
    }

    // Check vehicle info
    if (!input.vehicleInfo.make || !input.vehicleInfo.model) {
      errors.push('Marca e modelo do veículo são obrigatórios')
    }

    if (input.vehicleInfo.year < 1950 || input.vehicleInfo.year > new Date().getFullYear() + 1) {
      errors.push('Ano do veículo inválido')
    }

    // Check files
    if (input.photos) {
      for (const photo of input.photos) {
        if (!this.supportedImageTypes.includes(photo.type)) {
          errors.push(`Formato de imagem não suportado: ${photo.type}`)
        }
        if (photo.size > this.maxFileSize) {
          errors.push(`Imagem muito grande: ${photo.name}`)
        }
      }
    }

    if (input.videos) {
      for (const video of input.videos) {
        if (!this.supportedVideoTypes.includes(video.type)) {
          errors.push(`Formato de vídeo não suportado: ${video.type}`)
        }
        if (video.size > this.maxFileSize) {
          errors.push(`Vídeo muito grande: ${video.name}`)
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Utility methods
  static formatCost(cost: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(cost)
  }

  static getSeverityColor(severity: string): string {
    switch (severity) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-orange-600'
      case 'critical':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  static getUrgencyText(urgency: string): string {
    switch (urgency) {
      case 'can_wait':
        return 'Pode aguardar'
      case 'schedule_soon':
        return 'Agendar em breve'
      case 'urgent':
        return 'Urgente'
      case 'emergency':
        return 'Emergência'
      default:
        return 'Indefinido'
    }
  }

  static getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case 'can_wait':
        return 'text-green-600'
      case 'schedule_soon':
        return 'text-yellow-600'
      case 'urgent':
        return 'text-orange-600'
      case 'emergency':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  // Mock diagnostic for demo purposes
  static generateMockDiagnostic(input: DiagnosticInput): DiagnosticResult {
    const mockResults: Partial<DiagnosticResult>[] = [
      {
        primaryDiagnosis: {
          issue: 'Pastilhas de freio desgastadas',
          description: 'As pastilhas de freio estão com desgaste excessivo, causando ruídos e reduzindo a eficiência da frenagem.',
          severity: 'high',
          urgency: 'urgent',
          estimatedCost: { min: 200, max: 400, currency: 'BRL' }
        },
        confidence: 85
      },
      {
        primaryDiagnosis: {
          issue: 'Problema no sistema de ignição',
          description: 'Falha no sistema de ignição causando dificuldade para ligar e marcha lenta irregular.',
          severity: 'medium',
          urgency: 'schedule_soon',
          estimatedCost: { min: 150, max: 350, currency: 'BRL' }
        },
        confidence: 78
      },
      {
        primaryDiagnosis: {
          issue: 'Vazamento de óleo do motor',
          description: 'Detectado vazamento de óleo que pode causar danos graves ao motor se não tratado.',
          severity: 'high',
          urgency: 'urgent',
          estimatedCost: { min: 300, max: 800, currency: 'BRL' }
        },
        confidence: 92
      }
    ]

    const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]

    return {
      id: `diag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      confidence: randomResult.confidence || 80,
      primaryDiagnosis: randomResult.primaryDiagnosis!,
      possibleCauses: [
        {
          cause: 'Desgaste natural',
          probability: 70,
          description: 'Desgaste normal devido ao uso e tempo'
        },
        {
          cause: 'Manutenção inadequada',
          probability: 25,
          description: 'Falta de manutenção preventiva regular'
        },
        {
          cause: 'Uso inadequado',
          probability: 5,
          description: 'Uso do veículo em condições adversas'
        }
      ],
      recommendedActions: [
        {
          action: 'Agendar reparo imediatamente',
          priority: 'high',
          timeframe: 'Esta semana',
          description: 'É importante resolver este problema rapidamente para evitar danos maiores'
        },
        {
          action: 'Evitar uso intenso do veículo',
          priority: 'medium',
          timeframe: 'Até o reparo',
          description: 'Use o veículo apenas para necessidades essenciais'
        }
      ],
      suggestedServices: [
        {
          service: 'Substituição de pastilhas',
          description: 'Troca completa das pastilhas de freio dianteiras e traseiras',
          estimatedDuration: '2-3 horas',
          parts: [
            { name: 'Pastilhas dianteiras', estimatedCost: 120 },
            { name: 'Pastilhas traseiras', estimatedCost: 80 }
          ]
        }
      ],
      preventiveMaintenance: [
        {
          service: 'Troca de óleo',
          nextDue: '2024-03-15',
          description: 'Próxima troca de óleo recomendada'
        },
        {
          service: 'Revisão geral',
          nextDue: '2024-06-15',
          description: 'Revisão completa do veículo'
        }
      ],
      safetyWarnings: [
        {
          warning: 'Não ignore ruídos nos freios',
          severity: 'warning',
          action: 'Procure uma oficina imediatamente se ouvir ruídos estranhos ao frear'
        }
      ],
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }
  }
}

// Singleton instance
export const aiDiagnosticManager = new AIDiagnosticManager()

// React hook
export function useAIDiagnostic() {
  return {
    analyzeProblem: aiDiagnosticManager.analyzeProblem.bind(aiDiagnosticManager),
    getQuickSuggestions: aiDiagnosticManager.getQuickSuggestions.bind(aiDiagnosticManager),
    analyzeImage: aiDiagnosticManager.analyzeImage.bind(aiDiagnosticManager),
    analyzeAudio: aiDiagnosticManager.analyzeAudio.bind(aiDiagnosticManager),
    generateMockDiagnostic: AIDiagnosticManager.generateMockDiagnostic
  }
}

// Common vehicle problems database
export const COMMON_PROBLEMS = {
  engine: [
    'Motor não liga',
    'Motor engasga',
    'Marcha lenta irregular',
    'Perda de potência',
    'Superaquecimento',
    'Vazamento de óleo',
    'Ruído no motor',
    'Fumaça no escapamento'
  ],
  transmission: [
    'Dificuldade para engatar marchas',
    'Transmissão patinando',
    'Ruído na transmissão',
    'Vazamento de fluido',
    'Marcha não entra',
    'Trepidação ao acelerar'
  ],
  brakes: [
    'Ruído ao frear',
    'Pedal de freio mole',
    'Vibração no pedal',
    'Freio puxando para um lado',
    'Luz do freio acesa',
    'Pastilhas desgastadas'
  ],
  electrical: [
    'Bateria descarregando',
    'Luzes não funcionam',
    'Alternador com problema',
    'Fusível queimado',
    'Sistema elétrico instável',
    'Ar condicionado não liga'
  ],
  suspension: [
    'Carro balançando muito',
    'Ruído na suspensão',
    'Desgaste irregular dos pneus',
    'Dificuldade na direção',
    'Amortecedores vazando'
  ]
}

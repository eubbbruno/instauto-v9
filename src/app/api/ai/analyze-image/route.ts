import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, description } = body

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem é obrigatória' },
        { status: 400 }
      )
    }

    // Analisar imagem com IA
    const analysis = await aiService.analyzeVehicleImage(image, description)

    return NextResponse.json({
      analysis
    })
  } catch (error) {
    console.error('Erro na análise de imagem:', error)
    return NextResponse.json(
      { error: 'Erro ao analisar imagem' },
      { status: 500 }
    )
  }
}

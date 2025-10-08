import { NextRequest, NextResponse } from 'next/server'
import { aiService } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, vehicleInfo } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensagens são obrigatórias' },
        { status: 400 }
      )
    }

    // Chat com IA
    const response = await aiService.chatWithAI(messages)

    // Se temos informações do veículo e sintomas suficientes, fazer diagnóstico
    let diagnosis = null
    if (vehicleInfo && messages.length >= 3) {
      try {
        const symptoms = messages
          .filter(msg => msg.role === 'user')
          .map(msg => msg.content)

        diagnosis = await aiService.diagnoseVehicle({
          symptoms,
          vehicleInfo
        })
      } catch (error) {
        console.error('Erro no diagnóstico:', error)
      }
    }

    return NextResponse.json({
      response,
      diagnosis
    })
  } catch (error) {
    console.error('Erro na API de chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

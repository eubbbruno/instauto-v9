import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Função para enviar notificação via FCM (implementação simplificada)
async function sendFCMNotification(token: string, title: string, body: string, data?: any) {
  // Por enquanto, apenas log - implementar FCM depois
  console.log('Enviando notificação:', { token, title, body, data })
  return { success: true, messageId: 'mock-id' }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, title, body: messageBody, data, image } = body

    if (!to || !title || !messageBody) {
      return NextResponse.json(
        { error: 'Destinatário, título e corpo são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar token do usuário
    const { data: tokenData, error: tokenError } = await supabase
      .from('notification_tokens')
      .select('token')
      .eq('user_id', to)
      .eq('platform', 'web')
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token não encontrado para o usuário' },
        { status: 404 }
      )
    }

    // Enviar notificação
    const response = await sendFCMNotification(
      tokenData.token,
      title,
      messageBody,
      data
    )

    return NextResponse.json({
      success: true,
      messageId: response
    })
  } catch (error) {
    console.error('Erro ao enviar notificação:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar notificação' },
      { status: 500 }
    )
  }
}

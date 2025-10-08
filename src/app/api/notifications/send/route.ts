import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import admin from 'firebase-admin'

// Inicializar Firebase Admin (apenas no servidor)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
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

    // Preparar mensagem
    const message = {
      token: tokenData.token,
      notification: {
        title,
        body: messageBody,
        icon: '/images/logo-of.svg',
        image: image || undefined
      },
      data: data || {},
      webpush: {
        fcmOptions: {
          link: data?.url || '/'
        }
      }
    }

    // Enviar notificação
    const response = await admin.messaging().send(message)

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

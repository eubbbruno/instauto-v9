import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscription, userAgent, timestamp } = body

    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extrair dados da subscription
    const subscriptionData = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh || '',
      auth: subscription.keys?.auth || '',
      user_agent: userAgent,
      created_at: new Date(timestamp).toISOString()
    }

    // Salvar subscription no banco
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert(subscriptionData)
      .select()

    if (error) {
      console.error('❌ Erro ao salvar subscription:', error)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    console.log('✅ Push subscription salva:', data[0]?.id)

    return NextResponse.json({ 
      success: true, 
      subscriptionId: data[0]?.id 
    })

  } catch (error) {
    console.error('❌ Erro na API de subscribe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Push Subscribe API funcionando',
    vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY 
  })
}

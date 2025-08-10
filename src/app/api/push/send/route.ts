import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import webpush from 'web-push'

// Configurar VAPID keys apenas se disponíveis
if (process.env.NEXT_PUBLIC_VAPID_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@instauto.com.br',
    process.env.NEXT_PUBLIC_VAPID_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId, 
      userType, 
      notification, 
      targetAll = false 
    } = body

    // Verificar se VAPID está configurado
    if (!process.env.NEXT_PUBLIC_VAPID_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ 
        error: 'Push notifications not configured',
        message: 'VAPID keys not found' 
      }, { status: 503 })
    }

    // Verificar autorização (apenas sistema interno pode enviar)
    const authHeader = request.headers.get('authorization')
    const internalToken = process.env.INTERNAL_API_TOKEN
    
    if (!authHeader || authHeader !== `Bearer ${internalToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let subscriptions = []

    if (targetAll) {
      // Buscar todas as subscriptions ativas
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('active', true)

      if (error) {
        throw error
      }
      subscriptions = data
    } else {
      // Buscar subscriptions específicas do usuário
      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)

      if (error) {
        throw error
      }
      subscriptions = data
    }

    if (subscriptions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No active subscriptions found',
        sent: 0 
      })
    }

    // Enviar notificações
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        }

        try {
          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(notification)
          )
          return { success: true, subscriptionId: sub.id }
        } catch (error: any) {
          console.error('❌ Erro ao enviar para subscription:', sub.id, error.message)
          
          // Se a subscription é inválida, marcar como inativa
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabase
              .from('push_subscriptions')
              .update({ active: false })
              .eq('id', sub.id)
          }
          
          return { success: false, subscriptionId: sub.id, error: error.message }
        }
      })
    )

    // Contar sucessos e falhas
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    const failed = results.length - successful

    console.log(`📤 Push notifications: ${successful} enviadas, ${failed} falharam`)

    // Salvar log da notificação
    await supabase
      .from('notification_logs')
      .insert({
        user_id: userId,
        user_type: userType,
        notification_data: notification,
        sent_count: successful,
        failed_count: failed,
        created_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed,
      total: subscriptions.length
    })

  } catch (error) {
    console.error('❌ Erro na API de send push:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Push Send API funcionando',
    vapidConfigured: !!(process.env.NEXT_PUBLIC_VAPID_KEY && process.env.VAPID_PRIVATE_KEY)
  })
}

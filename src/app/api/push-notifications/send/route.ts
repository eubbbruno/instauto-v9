import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import webpush from 'web-push'

// Configurar VAPID
webpush.setVapidDetails(
  'mailto:admin@instauto.com.br',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  tag?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  requireInteraction?: boolean
  url?: string
}

export async function POST(request: NextRequest) {
  try {
    const { 
      user_ids, 
      title, 
      body, 
      icon, 
      badge, 
      image, 
      tag, 
      data, 
      actions, 
      requireInteraction,
      url 
    } = await request.json()

    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return NextResponse.json(
        { error: 'user_ids deve ser um array não vazio' },
        { status: 400 }
      )
    }

    if (!title || !body) {
      return NextResponse.json(
        { error: 'title e body são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar subscriptions ativas dos usuários
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', user_ids)
      .eq('is_active', true)

    if (error) {
      console.error('❌ Erro ao buscar subscriptions:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar subscriptions' },
        { status: 500 }
      )
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma subscription ativa encontrada',
        sent: 0,
        failed: 0
      })
    }

    // Preparar payload da notificação
    const notificationPayload: PushNotificationPayload = {
      title,
      body,
      icon: icon || '/images/logo-of.svg',
      badge: badge || '/images/logo-of.svg',
      image,
      tag,
      data: {
        ...data,
        url: url || '/',
        timestamp: Date.now()
      },
      actions,
      requireInteraction: requireInteraction || false
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Enviar notificações
    for (const subscription of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        }

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(notificationPayload),
          {
            TTL: 60 * 60 * 24, // 24 horas
            urgency: 'normal'
          }
        )

        results.sent++
        console.log(`✅ Notificação enviada para ${subscription.user_id}`)

      } catch (error: any) {
        results.failed++
        console.error(`❌ Erro ao enviar para ${subscription.user_id}:`, error)
        
        // Se subscription expirou, desativar
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .update({ is_active: false })
            .eq('id', subscription.id)
          
          console.log(`🗑️ Subscription expirada removida: ${subscription.id}`)
        }

        results.errors.push(`${subscription.user_id}: ${error.message}`)
      }
    }

    // Salvar log da notificação
    await supabase
      .from('notification_logs')
      .insert({
        title,
        body,
        target_users: user_ids,
        sent_count: results.sent,
        failed_count: results.failed,
        payload: notificationPayload
      })

    console.log(`📊 Notificação concluída: ${results.sent} enviadas, ${results.failed} falharam`)

    return NextResponse.json({
      success: true,
      message: 'Notificações processadas',
      sent: results.sent,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined
    })

  } catch (error) {
    console.error('❌ Erro na API send:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { user_id, endpoint, p256dh, auth, user_agent } = await request.json()

    if (!user_id || !endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { error: 'Dados obrigatórios em falta' },
        { status: 400 }
      )
    }

    // Verificar se já existe subscription para este usuário
    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('user_id', user_id)
      .eq('endpoint', endpoint)
      .single()

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        message: 'Subscription já existe' 
      })
    }

    // Criar nova subscription
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert({
        user_id,
        endpoint,
        p256dh,
        auth,
        user_agent,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao salvar subscription:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    console.log('✅ Push subscription salva:', data.id)

    return NextResponse.json({
      success: true,
      subscription_id: data.id,
      message: 'Subscription criada com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro na API subscribe:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json()

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    // Desativar subscriptions do usuário
    const { error } = await supabase
      .from('push_subscriptions')
      .update({ is_active: false })
      .eq('user_id', user_id)

    if (error) {
      console.error('❌ Erro ao desativar subscriptions:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }

    console.log('✅ Subscriptions desativadas para usuário:', user_id)

    return NextResponse.json({
      success: true,
      message: 'Subscriptions desativadas com sucesso'
    })

  } catch (error) {
    console.error('❌ Erro na API unsubscribe:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

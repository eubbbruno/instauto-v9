import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subscription } = body

    // Verificar se o usuário está autenticado
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Remover subscription do banco
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', subscription.endpoint)

    if (error) {
      console.error('❌ Erro ao remover subscription:', error)
      return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 })
    }

    console.log('✅ Push subscription removida:', subscription.endpoint)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Erro na API de unsubscribe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Push Unsubscribe API funcionando' 
  })
}

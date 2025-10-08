import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, userId, userType, platform } = body

    if (!token || !userId || !userType) {
      return NextResponse.json(
        { error: 'Token, userId e userType são obrigatórios' },
        { status: 400 }
      )
    }

    // Salvar ou atualizar token no banco
    const { error } = await supabase
      .from('notification_tokens')
      .upsert({
        user_id: userId,
        token,
        user_type: userType,
        platform: platform || 'web',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,platform'
      })

    if (error) {
      console.error('Erro ao salvar token:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar token' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro na API de salvar token:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

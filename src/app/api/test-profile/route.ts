import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Cliente admin com service_role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    console.log('🔍 Testando profile para userId:', userId)
    
    // Teste 1: Buscar profile com admin
    const { data: profileAdmin, error: errorAdmin } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    console.log('👑 Admin query result:', { profileAdmin, errorAdmin })
    
    // Teste 2: Verificar políticas RLS
    const { data: policies, error: policiesError } = await supabaseAdmin
      .rpc('exec_sql', { 
        sql_query: `
          SELECT policyname, permissive, roles, cmd, qual, with_check 
          FROM pg_policies 
          WHERE tablename = 'profiles' 
          ORDER BY policyname;
        ` 
      })
    
    console.log('📋 Políticas RLS:', { policies, policiesError })
    
    return NextResponse.json({
      success: true,
      tests: {
        profileAdmin: {
          data: profileAdmin,
          error: errorAdmin?.message
        },
        policies: {
          data: policies,
          error: policiesError?.message
        }
      }
    })

  } catch (error: any) {
    console.error('❌ Erro no teste profile:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

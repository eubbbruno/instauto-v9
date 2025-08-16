import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Cliente admin com service_role key (servidor-side)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action !== 'fix-rls') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const results = []

    // 1. Desabilitar RLS
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;' 
      })
      results.push({ step: 'Desabilitando RLS profiles', success: true })
    } catch (error: any) {
      results.push({ step: 'Desabilitando RLS profiles', success: false, error: error.message })
    }

    // 2. Remover políticas antigas
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
          DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
          DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
          DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
        ` 
      })
      results.push({ step: 'Removendo políticas antigas', success: true })
    } catch (error: any) {
      results.push({ step: 'Removendo políticas antigas', success: false, error: error.message })
    }

    // 3. Criar políticas simples
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          CREATE POLICY "profiles_select_policy" ON profiles
            FOR SELECT USING (auth.uid() = id);
        ` 
      })
      results.push({ step: 'Criando política SELECT', success: true })
    } catch (error: any) {
      results.push({ step: 'Criando política SELECT', success: false, error: error.message })
    }

    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          CREATE POLICY "profiles_insert_policy" ON profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
        ` 
      })
      results.push({ step: 'Criando política INSERT', success: true })
    } catch (error: any) {
      results.push({ step: 'Criando política INSERT', success: false, error: error.message })
    }

    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          CREATE POLICY "profiles_update_policy" ON profiles
            FOR UPDATE USING (auth.uid() = id);
        ` 
      })
      results.push({ step: 'Criando política UPDATE', success: true })
    } catch (error: any) {
      results.push({ step: 'Criando política UPDATE', success: false, error: error.message })
    }

    // 4. Reabilitar RLS
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;' 
      })
      results.push({ step: 'Reabilitando RLS', success: true })
    } catch (error: any) {
      results.push({ step: 'Reabilitando RLS', success: false, error: error.message })
    }

    // 5. Criar/atualizar profile admin
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          INSERT INTO profiles (
            id, email, name, type, created_at, updated_at
          ) VALUES (
            '4c7a55d9-b3e9-40f9-8755-df07fa7eb689',
            'admin@instauto.com.br',
            'Administrador',
            'admin',
            NOW(),
            NOW()
          ) ON CONFLICT (id) DO UPDATE SET
            email = EXCLUDED.email,
            name = EXCLUDED.name,
            type = EXCLUDED.type,
            updated_at = NOW();
        ` 
      })
      results.push({ step: 'Criando/atualizando profile admin', success: true })
    } catch (error: any) {
      results.push({ step: 'Criando/atualizando profile admin', success: false, error: error.message })
    }

    // 6. Testar consulta
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, name, type')
        .eq('id', '4c7a55d9-b3e9-40f9-8755-df07fa7eb689')
        .single()

      if (error) throw error
      
      results.push({ 
        step: 'Testando consulta profile admin', 
        success: true, 
        data 
      })
    } catch (error: any) {
      results.push({ step: 'Testando consulta profile admin', success: false, error: error.message })
    }

    return NextResponse.json({ success: true, results })

  } catch (error: any) {
    console.error('Erro no debug RLS:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

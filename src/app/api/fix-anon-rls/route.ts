import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Cliente admin com service_role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action !== 'fix-anon-rls') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const results = []

    // 1. Remover políticas atuais
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
          DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
          DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
          DROP POLICY IF EXISTS "profiles_authenticated_select" ON profiles;
          DROP POLICY IF EXISTS "profiles_authenticated_insert" ON profiles;
          DROP POLICY IF EXISTS "profiles_authenticated_update" ON profiles;
          DROP POLICY IF EXISTS "profiles_anon_public_select" ON profiles;
        ` 
      })
      results.push({ step: 'Removendo políticas antigas', success: true })
    } catch (error: any) {
      results.push({ step: 'Removendo políticas antigas', success: false, error: error.message })
    }

    // 2. Criar políticas mais permissivas
    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          -- Política para SELECT: usuário autenticado pode ver seu próprio profile
          CREATE POLICY "profiles_authenticated_select" ON profiles
            FOR SELECT 
            TO authenticated
            USING (auth.uid() = id);
        ` 
      })
      results.push({ step: 'Criando política SELECT authenticated', success: true })
    } catch (error: any) {
      results.push({ step: 'Criando política SELECT authenticated', success: false, error: error.message })
    }

    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          -- Política para INSERT: usuário autenticado pode criar seu próprio profile
          CREATE POLICY "profiles_authenticated_insert" ON profiles
            FOR INSERT 
            TO authenticated
            WITH CHECK (auth.uid() = id);
        ` 
      })
      results.push({ step: 'Criando política INSERT authenticated', success: true })
    } catch (error: any) {
      results.push({ step: 'Criando política INSERT authenticated', success: false, error: error.message })
    }

    try {
      await supabaseAdmin.rpc('exec_sql', { 
        sql_query: `
          -- Política para UPDATE: usuário autenticado pode atualizar seu próprio profile
          CREATE POLICY "profiles_authenticated_update" ON profiles
            FOR UPDATE 
            TO authenticated
            USING (auth.uid() = id)
            WITH CHECK (auth.uid() = id);
        ` 
      })
      results.push({ step: 'Criando política UPDATE authenticated', success: true })
    } catch (error: any) {
      results.push({ step: 'Criando política UPDATE authenticated', success: false, error: error.message })
    }

    // 3. Testar consulta com authenticated
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('id, email, name, type')
        .eq('id', '4c7a55d9-b3e9-40f9-8755-df07fa7eb689')
        .single()

      results.push({ 
        step: 'Testando consulta profile (service_role)', 
        success: !error, 
        error: error?.message,
        data: data
      })
    } catch (error: any) {
      results.push({ step: 'Testando consulta profile (service_role)', success: false, error: error.message })
    }

    return NextResponse.json({ success: true, results })

  } catch (error: any) {
    console.error('Erro no fix anon RLS:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

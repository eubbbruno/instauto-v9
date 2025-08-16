'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Cliente admin com service_role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // TEMPORÁRIO: Vamos usar o service key para debug
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0cGVqZXJteGdqd2txamNkdndpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI2MjkxMCwiZXhwIjoyMDQ4ODM4OTEwfQ.FJKTnlAo4zLsNFv0cB8kFHF6bNYqrNhk78bALBUCiGU'
)

export default function DebugRLS() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const executeSQL = async (sql: string, description: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
        sql_query: sql 
      })
      
      if (error) {
        console.error(`❌ ${description}:`, error)
        setResults(prev => [...prev, {
          description,
          success: false,
          error: error.message,
          data: null
        }])
      } else {
        console.log(`✅ ${description}:`, data)
        setResults(prev => [...prev, {
          description,
          success: true,
          error: null,
          data
        }])
      }
    } catch (err: any) {
      console.error(`❌ ${description}:`, err)
      setResults(prev => [...prev, {
        description,
        success: false,
        error: err.message,
        data: null
      }])
    } finally {
      setLoading(false)
    }
  }

  const fixRLS = async () => {
    setResults([])
    
    // 1. Desabilitar RLS
    await executeSQL(
      `ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;`,
      'Desabilitando RLS profiles'
    )
    
    // 2. Remover políticas
    await executeSQL(
      `DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
       DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
       DROP POLICY IF EXISTS "profiles_update_own" ON profiles;`,
      'Removendo políticas antigas'
    )
    
    // 3. Criar políticas simples
    await executeSQL(
      `CREATE POLICY "profiles_select_policy" ON profiles
         FOR SELECT USING (auth.uid() = id);`,
      'Criando política SELECT'
    )
    
    await executeSQL(
      `CREATE POLICY "profiles_insert_policy" ON profiles
         FOR INSERT WITH CHECK (auth.uid() = id);`,
      'Criando política INSERT'
    )
    
    await executeSQL(
      `CREATE POLICY "profiles_update_policy" ON profiles
         FOR UPDATE USING (auth.uid() = id);`,
      'Criando política UPDATE'
    )
    
    // 4. Reabilitar RLS
    await executeSQL(
      `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`,
      'Reabilitando RLS'
    )
    
    // 5. Verificar se admin existe
    await executeSQL(
      `INSERT INTO profiles (
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
         updated_at = NOW();`,
      'Criando/atualizando profile admin'
    )
    
    // 6. Testar consulta
    await executeSQL(
      `SELECT id, email, name, type FROM profiles 
       WHERE id = '4c7a55d9-b3e9-40f9-8755-df07fa7eb689';`,
      'Testando consulta profile admin'
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 Debug RLS - Correção Automática</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Executar Correção RLS</h2>
          <button
            onClick={fixRLS}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '⏳ Executando...' : '🚀 Corrigir RLS Agora'}
          </button>
        </div>

        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className={`font-semibold ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? '✅' : '❌'} {result.description}
              </h3>
              
              {result.error && (
                <p className="text-red-600 mt-2 font-mono text-sm">
                  {result.error}
                </p>
              )}
              
              {result.data && (
                <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

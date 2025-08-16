#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🔍 Verificando ambiente do InstaAuto...')
console.log('')

// ============================================================================
// VERIFICAR ARQUIVOS DE CONFIGURAÇÃO
// ============================================================================
console.log('📁 Verificando arquivos de configuração...')

const envPath = join(rootDir, '.env.local')
if (!existsSync(envPath)) {
    console.error('❌ Arquivo .env.local não encontrado!')
    console.error('   Copie .env.example para .env.local e configure as variáveis')
    process.exit(1)
}
console.log('✅ .env.local encontrado')

// ============================================================================
// CARREGAR VARIÁVEIS DE AMBIENTE
// ============================================================================
dotenv.config({ path: envPath })

console.log('')
console.log('🔑 Verificando variáveis de ambiente...')

const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_KEY'
]

let hasAllVars = true
for (const varName of requiredVars) {
    if (!process.env[varName]) {
        console.error(`❌ ${varName} não configurada`)
        hasAllVars = false
    } else {
        const value = process.env[varName]
        const maskedValue = value.length > 20 ? 
            `${value.substring(0, 10)}...${value.substring(value.length - 10)}` : 
            value
        console.log(`✅ ${varName}: ${maskedValue}`)
    }
}

if (!hasAllVars) {
    console.error('')
    console.error('❌ Configure todas as variáveis no .env.local')
    console.error('   Você pode encontrá-las no Supabase Dashboard > Settings > API')
    process.exit(1)
}

// ============================================================================
// TESTAR CONEXÃO COM SUPABASE
// ============================================================================
console.log('')
console.log('🌐 Testando conexão com Supabase...')

try {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    // Teste simples de conectividade
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = tabela não existe (ok neste ponto)
        console.error('❌ Erro de conexão com Supabase:', error.message)
        process.exit(1)
    }
    
    console.log('✅ Conexão com Supabase OK')
    
} catch (error) {
    console.error('❌ Erro ao conectar com Supabase:', error.message)
    console.error('   Verifique se as variáveis estão corretas')
    process.exit(1)
}

// ============================================================================
// VERIFICAR SERVICE KEY
// ============================================================================
console.log('')
console.log('🔐 Testando service key (para operações admin)...')

try {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    )
    
    // Testar se consegue listar usuários (operação admin)
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1 })
    
    if (error) {
        console.error('❌ Service key inválida:', error.message)
        console.error('   Verifique se SUPABASE_SERVICE_KEY está correta')
        process.exit(1)
    }
    
    console.log('✅ Service key válida')
    console.log(`   Usuários existentes: ${data.users.length > 0 ? data.users.length : 'nenhum'}`)
    
} catch (error) {
    console.error('❌ Erro ao testar service key:', error.message)
    process.exit(1)
}

// ============================================================================
// VERIFICAR DEPENDÊNCIAS
// ============================================================================
console.log('')
console.log('📦 Verificando dependências Node.js...')

try {
    const packageJson = await import(join(rootDir, 'package.json'), { assert: { type: 'json' } })
    console.log(`✅ Projeto: ${packageJson.default.name}`)
    console.log(`✅ Versão: ${packageJson.default.version}`)
} catch (error) {
    console.error('❌ Erro ao ler package.json:', error.message)
}

// Verificar se node_modules existe
if (!existsSync(join(rootDir, 'node_modules'))) {
    console.error('❌ node_modules não encontrado')
    console.error('   Execute: npm install')
    process.exit(1)
}
console.log('✅ node_modules OK')

// ============================================================================
// RESUMO FINAL
// ============================================================================
console.log('')
console.log('🎉 AMBIENTE VERIFICADO COM SUCESSO!')
console.log('')
console.log('📋 Próximos passos:')
console.log('   1. Execute: npm run setup:db (schema SQL)')
console.log('   2. Execute: npm run setup:admin')
console.log('   3. Execute: npm run setup:verify')
console.log('')
console.log('🚀 Ou execute tudo de uma vez: npm run setup')
console.log('')

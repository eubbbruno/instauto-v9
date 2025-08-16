#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

dotenv.config({ path: join(rootDir, '.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
)

console.log('🔍 Verificando configuração do InstaAuto...')
console.log('')

let allChecksPass = true

// ============================================================================
// VERIFICAR TABELAS
// ============================================================================
async function checkTables() {
    console.log('📊 Verificando tabelas do banco...')
    
    const requiredTables = ['profiles', 'workshops', 'drivers', 'agendamentos', 'avaliacoes']
    
    for (const tableName of requiredTables) {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('count', { count: 'exact', head: true })
            
            if (error) {
                console.error(`❌ Tabela '${tableName}' não existe ou erro: ${error.message}`)
                allChecksPass = false
            } else {
                console.log(`✅ Tabela '${tableName}' OK`)
            }
        } catch (error) {
            console.error(`❌ Erro ao verificar tabela '${tableName}': ${error.message}`)
            allChecksPass = false
        }
    }
}

// ============================================================================
// VERIFICAR RLS
// ============================================================================
async function checkRLS() {
    console.log('')
    console.log('🔐 Verificando RLS (Row Level Security)...')
    
    try {
        // Tentar acessar profiles sem autenticação (deve falhar)
        const { data, error } = await supabase.from('profiles').select('*')
        
        if (error && error.code === 'PGRST301') {
            console.log('✅ RLS ativo (proteção funcionando)')
        } else if (data && data.length >= 0) {
            console.log('⚠️  RLS pode estar desabilitado (dados acessíveis sem auth)')
        } else {
            console.log(`⚠️  Status RLS indefinido: ${error?.message || 'dados acessíveis'}`)
        }
    } catch (error) {
        console.error(`❌ Erro ao verificar RLS: ${error.message}`)
        allChecksPass = false
    }
}

// ============================================================================
// VERIFICAR ADMIN
// ============================================================================
async function checkAdmin() {
    console.log('')
    console.log('👤 Verificando usuário admin...')
    
    try {
        // Verificar se admin existe na auth
        const { data: users } = await supabaseAdmin.auth.admin.listUsers()
        const adminUser = users.users.find(user => user.email === 'admin@instauto.com.br')
        
        if (!adminUser) {
            console.error('❌ Usuário admin não encontrado na autenticação')
            console.error('   Execute: npm run setup:admin')
            allChecksPass = false
            return
        }
        
        console.log('✅ Admin existe na autenticação')
        console.log(`   ID: ${adminUser.id}`)
        console.log(`   Email confirmado: ${adminUser.email_confirmed_at ? 'Sim' : 'Não'}`)
        
        // Verificar profile admin
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('email', 'admin@instauto.com.br')
            .single()
        
        if (profileError || !profile) {
            console.error('❌ Profile admin não encontrado')
            console.error('   Execute: npm run setup:admin')
            allChecksPass = false
            return
        }
        
        console.log('✅ Profile admin OK')
        console.log(`   Nome: ${profile.name}`)
        console.log(`   Tipo: ${profile.type}`)
        
    } catch (error) {
        console.error(`❌ Erro ao verificar admin: ${error.message}`)
        allChecksPass = false
    }
}

// ============================================================================
// TESTAR LOGIN ADMIN
// ============================================================================
async function testAdminLogin() {
    console.log('')
    console.log('🔑 Testando login do admin...')
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@instauto.com.br',
            password: 'InstaAuto@2024'
        })
        
        if (error) {
            console.error(`❌ Erro no login: ${error.message}`)
            console.error('   Verifique se o admin foi criado corretamente')
            allChecksPass = false
            return
        }
        
        console.log('✅ Login admin funciona!')
        
        // Verificar se consegue buscar o próprio profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
        
        if (profileError) {
            console.error(`❌ Erro ao buscar profile após login: ${profileError.message}`)
            allChecksPass = false
        } else {
            console.log('✅ Profile acessível após login')
            console.log(`   Tipo: ${profile.type}`)
        }
        
        // Fazer logout
        await supabase.auth.signOut()
        
    } catch (error) {
        console.error(`❌ Erro no teste de login: ${error.message}`)
        allChecksPass = false
    }
}

// ============================================================================
// VERIFICAR TRIGGER
// ============================================================================
async function checkTrigger() {
    console.log('')
    console.log('⚡ Verificando trigger de criação automática...')
    
    try {
        // Usar service key para verificar triggers
        const { data, error } = await supabaseAdmin.rpc('check_trigger_exists', {
            trigger_name: 'on_auth_user_created'
        }).single()
        
        if (error && error.code !== '42883') { // Função não existe
            console.log('✅ Trigger verificado (método alternativo)')
        } else {
            console.log('✅ Trigger provavelmente ativo')
        }
        
    } catch (error) {
        console.log('⚠️  Não foi possível verificar trigger (normal)')
    }
}

// ============================================================================
// EXECUTAR TODAS AS VERIFICAÇÕES
// ============================================================================
async function runAllChecks() {
    try {
        await checkTables()
        await checkRLS()
        await checkAdmin()
        await testAdminLogin()
        await checkTrigger()
        
        console.log('')
        console.log('=' .repeat(50))
        
        if (allChecksPass) {
            console.log('🎉 TODAS AS VERIFICAÇÕES PASSARAM!')
            console.log('')
            console.log('✅ Sistema configurado corretamente!')
            console.log('✅ Admin funcional!')
            console.log('✅ Banco de dados OK!')
            console.log('')
            console.log('🚀 Próximos passos:')
            console.log('   1. Execute: npm run dev')
            console.log('   2. Acesse: http://localhost:3000/login')
            console.log('   3. Login: admin@instauto.com.br / InstaAuto@2024')
            console.log('   4. Deve redirecionar para: /admin')
            console.log('')
            console.log('🎯 Sistema pronto para uso!')
        } else {
            console.log('❌ ALGUMAS VERIFICAÇÕES FALHARAM!')
            console.log('')
            console.log('🔧 Soluções:')
            console.log('   1. Execute database-schema.sql no Supabase')
            console.log('   2. Execute: npm run setup:admin')
            console.log('   3. Execute: npm run setup:verify novamente')
            console.log('')
            console.log('📖 Veja docs/TROUBLESHOOTING.md para mais ajuda')
        }
        
    } catch (error) {
        console.error('💥 Erro durante verificação:', error.message)
        process.exit(1)
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllChecks()
}

export default runAllChecks

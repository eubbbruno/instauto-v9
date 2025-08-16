#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

dotenv.config({ path: join(rootDir, '.env.local') })

// Verificar variáveis de ambiente
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas!')
    console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_KEY no .env.local')
    process.exit(1)
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY // Service key para operações admin
)

async function createAdmin() {
    console.log('🚀 Iniciando criação do usuário admin...')
    console.log('📧 Email: admin@instauto.com.br')
    console.log('🔑 Senha: InstaAuto@2024')
    console.log('')
    
    try {
        // 1. Verificar se admin já existe
        console.log('🔍 Verificando se admin já existe...')
        const { data: existingUser } = await supabase.auth.admin.listUsers()
        const adminExists = existingUser.users.find(user => user.email === 'admin@instauto.com.br')
        
        if (adminExists) {
            console.log('⚠️  Admin já existe, deletando para recriar...')
            await supabase.auth.admin.deleteUser(adminExists.id)
            
            // Deletar profile também
            await supabase
                .from('profiles')
                .delete()
                .eq('email', 'admin@instauto.com.br')
        }
        
        // 2. Criar usuário auth
        console.log('👤 Criando usuário na autenticação...')
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: 'admin@instauto.com.br',
            password: 'InstaAuto@2024',
            email_confirm: true,
            user_metadata: { 
                user_type: 'admin',
                name: 'Administrador InstaAuto'
            }
        })
        
        if (authError) {
            console.error('❌ Erro ao criar usuário auth:', authError.message)
            process.exit(1)
        }
        
        console.log('✅ Usuário auth criado com sucesso!')
        console.log(`   ID: ${authData.user.id}`)
        
        // 3. Aguardar um pouco para o trigger processar
        console.log('⏳ Aguardando trigger processar...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 4. Verificar se profile foi criado pelo trigger
        console.log('🔍 Verificando se profile foi criado...')
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single()
        
        if (profileError || !profile) {
            console.log('⚠️  Profile não criado pelo trigger, criando manualmente...')
            
            // Criar profile manualmente
            const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    email: 'admin@instauto.com.br',
                    name: 'Administrador InstaAuto',
                    type: 'admin'
                })
            
            if (insertError) {
                console.error('❌ Erro ao criar profile:', insertError.message)
                process.exit(1)
            }
        }
        
        console.log('✅ Profile criado com sucesso!')
        
        // 5. Verificação final
        console.log('🔍 Verificação final...')
        const { data: finalProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'admin@instauto.com.br')
            .single()
        
        if (finalProfile) {
            console.log('✅ Verificação OK!')
            console.log(`   Profile ID: ${finalProfile.id}`)
            console.log(`   Email: ${finalProfile.email}`)
            console.log(`   Nome: ${finalProfile.name}`)
            console.log(`   Tipo: ${finalProfile.type}`)
            console.log('')
            console.log('🎉 ADMIN CRIADO COM SUCESSO!')
            console.log('')
            console.log('📋 CREDENCIAIS PARA LOGIN:')
            console.log('   Email: admin@instauto.com.br')
            console.log('   Senha: InstaAuto@2024')
            console.log('   URL: http://localhost:3000/login')
            console.log('')
            console.log('🔄 Próximo passo: npm run setup:verify')
        } else {
            console.error('❌ Erro: Profile não encontrado após criação!')
            process.exit(1)
        }
        
    } catch (error) {
        console.error('💥 Erro inesperado:', error.message)
        process.exit(1)
    }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    createAdmin()
}

export default createAdmin

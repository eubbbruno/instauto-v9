# 🚀 SETUP COMPLETO - SUPABASE + INSTAUTO V7

Este guia detalha como configurar completamente o Supabase para o projeto Instauto V7.

## 📋 **PRÉ-REQUISITOS**

- Conta no [Supabase](https://supabase.com)
- Conta no [GitHub](https://github.com)
- Projeto clonado localmente

## 🔧 **PASSO 1: CRIAR PROJETO NO SUPABASE**

1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Escolha sua organização
4. Configure o projeto:
   - **Name**: `instauto-v7-production`
   - **Database Password**: Gere uma senha forte
   - **Region**: `South America (São Paulo)` para melhor performance
5. Clique em **"Create new project"**
6. Aguarde a criação (pode levar alguns minutos)

## 🔑 **PASSO 2: OBTER CHAVES DE API**

1. No dashboard do projeto, vá em **Settings → API**
2. Copie as seguintes informações:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public**: Chave pública
   - **service_role**: Chave secreta (para operações server-side)

## 📄 **PASSO 3: CONFIGURAR VARIÁVEIS DE AMBIENTE**

1. Na raiz do projeto, copie o arquivo `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite o arquivo `.env.local` e preencha:
   ```env
   # SUPABASE CONFIGURATION
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## 🗄️ **PASSO 4: EXECUTAR SCRIPTS SQL**

### 4.1 Script Principal
1. No dashboard do Supabase, vá em **SQL Editor**
2. Crie uma nova query
3. Copie o conteúdo completo do arquivo `supabase-schema-verification.sql`
4. Execute o script (clique em **Run**)

### 4.2 Verificar Tabelas
Execute esta query para verificar se as tabelas foram criadas:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Você deve ver as seguintes tabelas:
- `profiles`
- `drivers`
- `workshops`
- `vehicles`
- `appointments`
- `service_orders`
- `conversations`
- `messages`
- `reviews`
- `payments`

## 🔐 **PASSO 5: CONFIGURAR OAUTH (OPCIONAL)**

### 5.1 Google OAuth
1. Vá em **Authentication → Providers → Google**
2. Ative o provider
3. Configure:
   - **Client ID**: Obtido no Google Cloud Console
   - **Client Secret**: Obtido no Google Cloud Console
   - **Redirect URL**: `https://your-project-id.supabase.co/auth/v1/callback`

### 5.2 Facebook OAuth
1. Vá em **Authentication → Providers → Facebook**
2. Ative o provider
3. Configure:
   - **App ID**: Obtido no Facebook Developers
   - **App Secret**: Obtido no Facebook Developers

### 5.3 Configurar Redirect URLs
Em **Authentication → URL Configuration**, adicione:
- **Site URL**: `http://localhost:3000` (desenvolvimento)
- **Redirect URLs**: 
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.vercel.app/auth/callback` (produção)

## 🛡️ **PASSO 6: CONFIGURAR RLS (ROW LEVEL SECURITY)**

As políticas básicas já foram criadas no script. Para adicionar mais políticas:

```sql
-- Exemplo: Motoristas só veem seus próprios veículos
CREATE POLICY "Drivers can view own vehicles" ON vehicles 
FOR SELECT USING (
  driver_id IN (
    SELECT id FROM drivers WHERE profile_id = auth.uid()
  )
);
```

## 🚀 **PASSO 7: TESTAR LOCALMENTE**

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o projeto:
   ```bash
   npm run dev
   ```

3. Acesse [http://localhost:3000/auth](http://localhost:3000/auth)

4. Teste o cadastro:
   - Crie uma conta de motorista
   - Crie uma conta de oficina
   - Teste login social se configurado

## 📊 **PASSO 8: MONITORAMENTO**

### 8.1 Verificar Logs
- **Dashboard → Logs → Auth**: Logs de autenticação
- **Dashboard → Logs → Database**: Logs do banco

### 8.2 Verificar Usuários
- **Authentication → Users**: Lista de usuários cadastrados

### 8.3 Verificar Dados
- **Table Editor**: Visualizar dados das tabelas

## 🔄 **PASSO 9: REAL-TIME (OPCIONAL)**

Para habilitar real-time em mensagens:

1. Vá em **Database → Replication**
2. Adicione as tabelas:
   - `messages`
   - `conversations`
   - `appointments`

## 🌐 **PASSO 10: DEPLOY VERCEL**

### 10.1 Configurar Variáveis no Vercel
1. No dashboard da Vercel, vá em **Settings → Environment Variables**
2. Adicione as mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 10.2 Atualizar URLs
1. No Supabase, vá em **Authentication → URL Configuration**
2. Adicione a URL de produção:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/auth/callback`

## ✅ **VERIFICAÇÃO FINAL**

Execute estes testes para garantir que tudo está funcionando:

### ✅ Autenticação
- [ ] Cadastro com email/senha
- [ ] Login com email/senha
- [ ] Login social (se configurado)
- [ ] Logout
- [ ] Redirecionamento correto por tipo de usuário

### ✅ Banco de Dados
- [ ] Criação de perfil automaticamente
- [ ] Inserção de dados funcionando
- [ ] RLS protegendo dados
- [ ] Triggers funcionando

### ✅ Real-time (se habilitado)
- [ ] Mensagens em tempo real
- [ ] Notificações funcionando

## 🆘 **TROUBLESHOOTING**

### Erro: "Supabase não configurado"
- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Failed to fetch"
- Verifique a URL do projeto
- Verifique se o projeto está ativo no Supabase

### Erro: "Invalid API key"
- Verifique se copiou a chave correta
- Regenere as chaves se necessário

### Erro: "Row Level Security"
- Verifique se executou o script SQL completo
- Revise as políticas de segurança

## 📞 **SUPORTE**

Se encontrar problemas:

1. Verifique os logs no Supabase Dashboard
2. Verifique o console do navegador
3. Teste cada passo individualmente
4. Consulte a [documentação oficial do Supabase](https://supabase.com/docs)

---

**🎉 Configuração completa! Seu Instauto V7 está pronto para uso com Supabase!** 
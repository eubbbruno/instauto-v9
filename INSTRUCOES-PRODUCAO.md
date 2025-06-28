# 🚀 INSTRUÇÕES PARA TESTE EM PRODUÇÃO

## ✅ **STATUS ATUAL:**
- ✅ Erro de hydration corrigido no layout
- ✅ Script SQL criado para corrigir função `handle_new_user`
- ✅ Projeto atualizado no GitHub: `eubbbruno/instauto-v9`
- ✅ Vercel deve fazer auto-deploy

## 🔧 **CONFIGURAÇÃO SUPABASE:**
- **Site URL:** `https://www.instauto.com.br` ✅
- **Redirect URLs:** 
  - `http://localhost:3000/auth/callback`
  - `https://www.instauto.com.br/auth/callback` ✅

## 📋 **PRÓXIMOS PASSOS:**

### **PASSO 1: Executar Script SQL**
1. Acesse: `https://supabase.com/dashboard/project/rtpejermxgjwkqjcdvwi`
2. SQL Editor → New Query
3. Execute o script do arquivo `fix-handle-new-user.sql`

### **PASSO 2: Verificar Deploy**
1. Aguarde o deploy automático do Vercel
2. Acesse: `https://www.instauto.com.br`
3. Teste: `https://www.instauto.com.br/auth`

### **PASSO 3: Testar Login Social**
1. Clique em "Entrar com Google"
2. Clique em "Entrar com Facebook"
3. Verificar se não há mais erro "Database error saving new user"

### **PASSO 4: Verificar Redirecionamento**
- **Motorista:** deve ir para `/motorista`
- **Oficina Free:** deve ir para `/oficina-basica`
- **Oficina Pro:** deve ir para `/dashboard`

## 🔍 **SE DER ERRO:**
- Verifique o console do navegador
- Envie screenshot da página de erro
- Confirme se executou o script SQL no Supabase

## 🎯 **CORREÇÕES APLICADAS:**
1. **Hydration Error:** Resolvido com `suppressHydrationWarning`
2. **Function Error:** Script SQL robusto com tratamento de erro
3. **URL Config:** Configuração para produção

## 🌐 **LINKS IMPORTANTES:**
- **Site:** https://www.instauto.com.br
- **Auth:** https://www.instauto.com.br/auth  
- **GitHub:** https://github.com/eubbbruno/instauto-v9
- **Supabase:** https://supabase.com/dashboard/project/rtpejermxgjwkqjcdvwi 
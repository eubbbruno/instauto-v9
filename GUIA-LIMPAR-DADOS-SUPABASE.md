# 🗑️ GUIA: Como Limpar Todos os Dados do Supabase Para Teste

## ⚠️ **ATENÇÃO:** 
Este processo vai **DELETAR TODOS** os usuários e dados do seu projeto Supabase. Use apenas em ambiente de desenvolvimento/teste!

---

## 📋 **PASSO A PASSO:**

### **1️⃣ Acesse o Supabase Dashboard**
1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione seu projeto do Instauto

### **2️⃣ Abra o SQL Editor**
1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New query"** (nova consulta)

### **3️⃣ Execute o Script de Limpeza**

**🛡️ OPÇÃO 1 - Script Seguro (RECOMENDADO):**
1. Copie todo o conteúdo do arquivo `limpar-dados-teste-seguro.sql`
2. Cole no SQL Editor
3. Clique em **"Run"** (Executar) ou pressione `Ctrl+Enter`
4. Este script verifica quais tabelas existem antes de tentar deletar

**⚡ OPÇÃO 2 - Script Simples:**
1. Copie o conteúdo de `limpar-dados-simples.sql`
2. Execute uma linha por vez
3. Descomente apenas as tabelas que existem no seu banco

### **4️⃣ Confirme os Resultados**
Você deve ver uma tabela assim:
```
tabela        | total
--------------|------
profiles      |   0
drivers       |   0  
workshops     |   0
agendamentos  |   0
auth.users    |   0
```

Se todos os totais estão em **0 (zero)**, a limpeza foi bem-sucedida! ✅

---

## 🔄 **OPÇÃO ALTERNATIVA - Limpeza Manual:**

Se o script não funcionar completamente, você pode limpar manualmente:

### **A) Deletar usuários na aba Authentication:**
1. Vá em **"Authentication"** → **"Users"**
2. Selecione todos os usuários
3. Clique em **"Delete users"**

### **B) Limpar tabelas na aba Table Editor:**
1. Vá em **"Table Editor"**
2. Para cada tabela (agendamentos, drivers, workshops, profiles):
   - Clique na tabela
   - Selecione todas as linhas  
   - Clique em **"Delete"**

---

## 🧪 **SEQUÊNCIA DE TESTE RECOMENDADA:**

Após limpar os dados, teste nesta ordem:

### **Teste 1 - Motorista:**
1. Acesse `/auth/motorista`
2. Cadastre com email/senha
3. Complete o perfil (CPF, telefone)
4. Verifique se redireciona para `/motorista` ✅

### **Teste 2 - Oficina Free:**
1. Acesse `/auth/oficina`
2. Cadastre com plano "Free"
3. Complete dados (CNPJ, telefone)
4. Verifique se redireciona para `/oficina-basica` ✅

### **Teste 3 - Oficina Pro:**
1. Acesse `/auth/oficina`
2. Cadastre com plano "Pro"
3. Complete dados
4. Verifique se redireciona para `/dashboard` ✅

### **Teste 4 - OAuth Google:**
1. Acesse `/auth/motorista` ou `/auth/oficina`
2. Clique "Continuar com Google"
3. Complete perfil se necessário
4. Verifique redirecionamento correto ✅

### **Teste 5 - Login Existente:**
1. Tente fazer login com contas já criadas
2. Verifique redirecionamento baseado no tipo/plano ✅

---

## 🔍 **VERIFICAÇÃO NO SUPABASE:**

Após cada teste, você pode verificar os dados criados:

### **Tabela `profiles`:**
- Deve ter `type` = 'motorista' ou 'oficina'
- Deve ter nome, email, telefone

### **Tabela `drivers`:**
- Só para motoristas
- Deve ter `profile_id` e `cpf`

### **Tabela `workshops`:**
- Só para oficinas
- Deve ter `profile_id`, `business_name`, `cnpj`, `plan_type`

### **Authentication → Users:**
- Deve mostrar usuários criados
- Email deve corresponder aos profiles

---

## 🚨 **TROUBLESHOOTING:**

### **❌ Erro: "permission denied"**
**Solução:** Você precisa ser OWNER do projeto Supabase para deletar da tabela `auth.users`

### **❌ Usuários não são deletados**
**Solução:** Delete manualmente em Authentication → Users

### **❌ Dados ainda aparecem**
**Solução:** Execute a query de verificação novamente para confirmar

### **❌ OAuth não funciona**
**Solução:** Verifique se as URLs de callback estão configuradas:
- `http://localhost:3000/auth/callback`
- Sua URL de produção + `/auth/callback`

---

## ✅ **RESULTADO ESPERADO:**

Após a limpeza e novos testes:
- Sistema de autenticação funcionando ✅
- Redirecionamento correto por tipo ✅
- OAuth Google/Facebook funcionando ✅
- Dados salvos corretamente no Supabase ✅

**🎉 PROJETO PRONTO PARA PRODUÇÃO!** 
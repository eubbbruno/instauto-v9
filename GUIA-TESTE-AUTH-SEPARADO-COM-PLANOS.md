# 🧪 GUIA DE TESTE - SISTEMA AUTH SEPARADO COM PLANOS

## 🎯 **NOVA ARQUITETURA IMPLEMENTADA**

### **📱 PÁGINAS CRIADAS:**
- `/auth` → Seleção de área (motorista/oficina)
- `/auth/motorista` → Auth específica para motoristas  
- `/auth/oficina` → Auth específica para oficinas (com seleção de plano)

### **🔄 FLUXO DE REDIRECIONAMENTO:**
- **Motorista** → `/motorista`
- **Oficina FREE** → `/oficina-basica`
- **Oficina PRO** → `/dashboard`

---

## 🚀 **PREPARAÇÃO PRE-TESTE**

### **1. EXECUTAR SCRIPT SQL**
```sql
-- Execute no Supabase SQL Editor:
-- Copie e cole todo o conteúdo do arquivo: supabase-auth-separated-with-plans.sql
```

### **2. VERIFICAR CONFIGURAÇÕES**
- ✅ Variáveis de ambiente Supabase configuradas
- ✅ OAuth Google/Facebook configurado no Supabase
- ✅ URLs de redirecionamento atualizadas:
  - `http://localhost:3000/auth/callback`
  - `https://seudominio.com/auth/callback`

---

## 🧪 **TESTES ESPECÍFICOS**

### **🚗 TESTE 1: CADASTRO MOTORISTA**

#### **1.1 Cadastro por Email**
1. Acesse `/auth`
2. Clique em "Continuar como Motorista"
3. Vá para aba "Cadastrar"
4. Preencha email e senha
5. Clique em "Criar Conta"

**✅ Resultado esperado:**
- Mensagem: "Conta criada com sucesso!"
- Redirecionamento para `/motorista`
- Profile criado no banco com `type = 'motorista'`
- Registro criado na tabela `drivers`

#### **1.2 Login por Email**
1. Acesse `/auth/motorista`
2. Aba "Entrar"
3. Email e senha do teste anterior
4. Clique em "Entrar"

**✅ Resultado esperado:**
- Login bem-sucedido
- Redirecionamento para `/motorista`

#### **1.3 Login Google/Facebook**
1. Acesse `/auth/motorista`
2. Clique em "Google" ou "Facebook"
3. Complete OAuth

**✅ Resultado esperado:**
- Redirecionamento para `/auth/callback`
- Processamento do callback
- Redirecionamento final para `/motorista`

---

### **🔧 TESTE 2: CADASTRO OFICINA (PLANO GRÁTIS)**

#### **2.1 Seleção de Plano Grátis**
1. Acesse `/auth`
2. Clique em "Continuar como Oficina"
3. Certifique-se que "Plano Grátis" está selecionado (padrão)
4. Aba "Cadastrar"
5. Preencha email e senha
6. Clique em "Criar Conta"

**✅ Resultado esperado:**
- Mensagem: "Conta criada com sucesso!"
- Redirecionamento para `/oficina-basica`
- Profile criado com `type = 'oficina'`
- Workshop criado com `plan_type = 'free'`

#### **2.2 Login Oficina Grátis**
1. Acesse `/auth/oficina`
2. Login com credenciais do teste anterior

**✅ Resultado esperado:**
- Redirecionamento para `/oficina-basica`

---

### **⭐ TESTE 3: CADASTRO OFICINA (PLANO PRO)**

#### **3.1 Seleção de Plano Pro**
1. Acesse `/auth/oficina`
2. Clique no botão "Plano Pro" (deve ficar destacado)
3. Aba "Cadastrar"
4. Preencha email e senha diferentes
5. Clique em "Criar Conta"

**✅ Resultado esperado:**
- Mensagem: "Conta criada com sucesso!"
- Redirecionamento para `/dashboard`
- Workshop criado com `plan_type = 'pro'`

#### **3.2 Login Oficina Pro**
1. Acesse `/auth/oficina`
2. Login com credenciais do teste anterior

**✅ Resultado esperado:**
- Redirecionamento para `/dashboard`

---

### **🔄 TESTE 4: OAUTH COM PLANOS**

#### **4.1 Google OAuth - Oficina Pro**
1. Acesse `/auth/oficina`
2. Selecione "Plano Pro"
3. Clique em "Google"
4. Complete OAuth

**✅ Resultado esperado:**
- Callback processa `type=oficina` e `plan_type=pro`
- Redirecionamento para `/dashboard`

#### **4.2 Facebook OAuth - Oficina Grátis**
1. Acesse `/auth/oficina`
2. Mantenha "Plano Grátis" selecionado
3. Clique em "Facebook"
4. Complete OAuth

**✅ Resultado esperado:**
- Callback processa `type=oficina` e `plan_type=free`
- Redirecionamento para `/oficina-basica`

---

## 🔍 **VERIFICAÇÕES NO BANCO DE DADOS**

### **1. Verificar Profiles**
```sql
SELECT 
    id,
    email,
    name,
    type,
    created_at
FROM profiles
ORDER BY created_at DESC;
```

### **2. Verificar Drivers**
```sql
SELECT 
    d.id,
    p.email,
    p.name,
    d.created_at
FROM drivers d
JOIN profiles p ON p.id = d.profile_id
ORDER BY d.created_at DESC;
```

### **3. Verificar Workshops**
```sql
SELECT 
    w.id,
    p.email,
    p.name,
    w.plan_type,
    w.created_at
FROM workshops w
JOIN profiles p ON p.id = w.profile_id
ORDER BY w.created_at DESC;
```

### **4. Verificar Logs da Função**
```sql
-- No Supabase, vá para Logs > Database
-- Procure por logs que começam com [AUTH]
-- Deve mostrar o processo de criação dos profiles
```

---

## 🐛 **TROUBLESHOOTING**

### **❌ "Sistema temporariamente indisponível"**
- Verificar variáveis de ambiente do Supabase
- Verificar se `isSupabaseConfigured()` retorna `true`

### **❌ Erro "policy already exists"**
- Execute a parte de limpeza do script SQL
- Remova todas as políticas antigas manualmente

### **❌ Redirecionamento incorreto**
- Verificar logs do console do navegador
- Verificar se o callback está processando os parâmetros corretos
- Verificar se o workshop foi criado com o plano correto

### **❌ Profile não criado**
- Verificar logs do Supabase (Logs > Database)
- Verificar se a função `handle_new_user()` está ativa
- Verificar se o trigger está funcionando

### **❌ OAuth não funciona**
- Verificar configuração OAuth no Supabase
- Verificar URLs de redirecionamento
- Verificar se os parâmetros `type` e `plan_type` estão sendo enviados

---

## ✅ **CHECKLIST FINAL**

### **Funcionalidades Básicas:**
- [ ] Página `/auth` mostra seleção de área
- [ ] Página `/auth/motorista` funciona completamente
- [ ] Página `/auth/oficina` funciona completamente
- [ ] Seleção de plano na oficina funciona
- [ ] Cadastro por email funciona
- [ ] Login por email funciona
- [ ] OAuth Google funciona
- [ ] OAuth Facebook funciona

### **Redirecionamentos:**
- [ ] Motorista → `/motorista`
- [ ] Oficina FREE → `/oficina-basica`
- [ ] Oficina PRO → `/dashboard`
- [ ] Callback processa corretamente

### **Banco de Dados:**
- [ ] Profiles criados com tipo correto
- [ ] Drivers criados para motoristas
- [ ] Workshops criados com plano correto
- [ ] Políticas RLS funcionando
- [ ] Logs da função aparecem

### **UX/UI:**
- [ ] Design responsivo
- [ ] Mensagens de feedback claras
- [ ] Navegação intuitiva
- [ ] Links entre páginas funcionam

---

## 🎯 **PRÓXIMOS PASSOS APÓS TESTE**

1. **✅ Se tudo funcionou:**
   - Fazer commit das mudanças
   - Atualizar documentação
   - Testar em produção

2. **❌ Se há problemas:**
   - Identificar e corrigir bugs
   - Re-testar funcionalidades
   - Ajustar redirecionamentos se necessário

3. **🔄 Melhorias futuras:**
   - Implementar preenchimento de dados nas configurações
   - Adicionar validações extras
   - Otimizar performance se necessário

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. Verificar logs do console do navegador
2. Verificar logs do Supabase
3. Verificar se todos os scripts SQL foram executados
4. Testar em modo incógnito para eliminar cache
5. Verificar se as variáveis de ambiente estão corretas

**🎉 Boa sorte com os testes!** 
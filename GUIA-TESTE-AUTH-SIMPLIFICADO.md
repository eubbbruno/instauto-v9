# 🚀 GUIA DE TESTE: SISTEMA DE AUTH SIMPLIFICADO

## 📋 **CHECKLIST PRÉ-TESTE**

### ✅ **1. Aplicar Reset Completo no Supabase**
1. Acesse o **Supabase Dashboard** → SQL Editor
2. Execute o script `supabase-auth-clean-reset.sql`
3. Verifique se não há erros na execução
4. Confirme que todas as verificações finais retornam ✅ OK

### ✅ **2. Verificar Estrutura Limpa**
```sql
-- Execute no SQL Editor para verificar limpeza
SELECT 
    'POLÍTICAS' as tipo,
    policyname as nome
FROM pg_policies 
WHERE tablename IN ('profiles', 'drivers', 'workshops');

-- Deve retornar apenas as políticas básicas criadas pelo script
```

---

## 🎯 **NOVO FLUXO SIMPLIFICADO**

### **🔄 ANTES (Complexo)**
1. Cadastro → Escolher tipo → Preencher dados específicos → Completar perfil → Dashboard
2. OAuth → Callback → Verificar perfil → Completar dados → Dashboard
3. **PROBLEMAS:** Bugs no botão "Finalizar", lógica complexa, múltiplas páginas

### **✨ AGORA (Simples)**
1. **Cadastro/Login** → Apenas email/senha OU OAuth + escolher tipo
2. **Redirecionamento direto** → Dashboard baseado no tipo
3. **Dados pessoais** → Preenchidos depois nas configurações
4. **Zero bugs** → Sem telas intermediárias

---

## 🧪 **TESTES DE CADASTRO**

### **TESTE 1: Cadastro Motorista por Email** 🚗

#### **Passos:**
1. Acesse: `/auth`
2. Clique em **"Cadastrar"**
3. Selecione **"Motorista"** (lado esquerdo)
4. Preencha:
   - Email: `motorista.teste@gmail.com`
   - Senha: `123456`
   - Confirmar senha: `123456`
5. Clique **"✨ Criar Conta"**

#### **Resultado Esperado:**
- ✅ Mensagem: "✅ Conta criada com sucesso! Redirecionando..."
- ✅ Redirecionamento para: `/motorista`
- ✅ Dashboard do motorista carregado
- ✅ Perfil básico criado (apenas email, tipo, nome extraído do email)

---

### **TESTE 2: Cadastro Oficina por Email** 🔧

#### **Passos:**
1. Acesse: `/auth`
2. Clique em **"Cadastrar"**
3. Selecione **"Oficina"** (lado esquerdo)
4. Preencha:
   - Email: `oficina.teste@gmail.com`
   - Senha: `123456`
   - Confirmar senha: `123456`
5. Clique **"✨ Criar Conta"**

#### **Resultado Esperado:**
- ✅ Mensagem: "✅ Conta criada com sucesso! Redirecionando..."
- ✅ Redirecionamento para: `/oficina-basica` (plano FREE padrão)
- ✅ Dashboard básico da oficina carregado
- ✅ Workshop criado com `plan_type = 'free'`

---

### **TESTE 3: Login OAuth Google** 🌐

#### **Passos:**
1. Acesse: `/auth`
2. Selecione **"Motorista"** ou **"Oficina"**
3. Clique **"Google"**
4. Complete o fluxo OAuth no Google
5. Aguarde redirecionamento

#### **Resultado Esperado:**
- ✅ Callback: `/auth/callback` com código
- ✅ Mensagem: "✅ Login realizado com sucesso!"
- ✅ Redirecionamento correto baseado no tipo
- ✅ Perfil criado automaticamente via trigger

---

### **TESTE 4: Login com Email Existente** 🔑

#### **Passos:**
1. Acesse: `/auth`
2. Clique em **"Entrar"**
3. Use conta criada anteriormente:
   - Email: `motorista.teste@gmail.com`
   - Senha: `123456`
4. Clique **"🔑 Entrar"**

#### **Resultado Esperado:**
- ✅ Mensagem: "✅ Login realizado com sucesso!"
- ✅ Redirecionamento para dashboard correto
- ✅ Sessão mantida

---

## 🔍 **VERIFICAÇÕES NO BANCO**

### **Após cada teste, verificar:**

```sql
-- 1. Verificar profiles criados
SELECT 
    '👤 PROFILES' as tabela,
    email,
    name,
    type,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- 2. Verificar motoristas
SELECT 
    '🚗 DRIVERS' as tabela,
    d.id,
    p.email,
    d.cpf,
    d.created_at
FROM drivers d
JOIN profiles p ON d.profile_id = p.id
ORDER BY d.created_at DESC;

-- 3. Verificar oficinas
SELECT 
    '🔧 WORKSHOPS' as tabela,
    w.id,
    p.email,
    w.business_name,
    w.plan_type,
    w.created_at
FROM workshops w
JOIN profiles p ON w.profile_id = p.id
ORDER BY w.created_at DESC;

-- 4. Verificar logs da função (se houver problemas)
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%handle_new_user%' 
ORDER BY last_exec_time DESC;
```

---

## 🎯 **REDIRECIONAMENTOS CORRETOS**

### **Fluxo de Redirecionamento:**

| Tipo | Plano | Destino |
|------|-------|---------|
| **Motorista** | - | `/motorista` |
| **Oficina** | FREE | `/oficina-basica` |
| **Oficina** | PRO | `/dashboard` |

### **URLs Testadas:**
- ✅ `/auth` - Página principal de auth
- ✅ `/auth/callback` - Callback OAuth funcional
- ✅ `/motorista` - Dashboard motorista
- ✅ `/oficina-basica` - Dashboard oficina FREE
- ✅ `/dashboard` - Dashboard oficina PRO

---

## 🚨 **PROBLEMAS POSSÍVEIS E SOLUÇÕES**

### **Problema 1: "Política já existe"**
```bash
ERROR: 42710: policy "profiles_select_own" for table "profiles" already exists
```
**Solução:** Execute o script de reset que remove todas as políticas primeiro.

### **Problema 2: OAuth não funciona**
**Verificar:**
- URLs de callback no Supabase Auth Settings
- Domínios permitidos
- Configuração Google/Facebook OAuth

### **Problema 3: Redirecionamento errado**
**Verificar:**
- Tipo do usuário salvo corretamente
- Função `handle_new_user` executando sem erros
- Logs no console do navegador

### **Problema 4: Perfil não criado**
**Verificar:**
- Trigger `on_auth_user_created` ativo
- Função `handle_new_user` sem erros
- RLS policies permitindo INSERT

---

## ✅ **CHECKLIST FINAL**

### **Funcionalidades Testadas:**
- [ ] Cadastro motorista por email
- [ ] Cadastro oficina por email  
- [ ] Login por email
- [ ] OAuth Google (motorista)
- [ ] OAuth Google (oficina)
- [ ] OAuth Facebook (motorista)
- [ ] OAuth Facebook (oficina)
- [ ] Redirecionamentos corretos
- [ ] Perfis criados automaticamente
- [ ] Registros específicos (drivers/workshops)
- [ ] Validações de senha
- [ ] Mensagens de erro apropriadas

### **Banco de Dados:**
- [ ] Políticas RLS funcionando
- [ ] Trigger executando
- [ ] Função handle_new_user robusta
- [ ] Índices criados
- [ ] Estrutura limpa

### **UX/UI:**
- [ ] Design responsivo
- [ ] Mensagens claras
- [ ] Loading states
- [ ] Transições suaves
- [ ] Sem bugs de interface

---

## 🎉 **PRÓXIMOS PASSOS APÓS TESTES**

1. **✅ Sistema funcionando** → Implementar configurações nos dashboards
2. **❌ Problemas encontrados** → Corrigir e testar novamente
3. **🔧 Melhorias necessárias** → Ajustar e otimizar
4. **📱 Testes mobile** → Verificar responsividade
5. **🚀 Deploy produção** → Commit e push para Vercel

---

## 📞 **SUPORTE**

Se encontrar problemas:
1. **Verificar console do navegador** para erros JavaScript
2. **Verificar Network tab** para falhas de API
3. **Verificar logs do Supabase** para erros de banco
4. **Testar em modo anônimo** para descartar cache
5. **Verificar variáveis de ambiente** do Supabase 
# 🧪 GUIA DE TESTE: CADASTRO DE OFICINAS CORRIGIDO

## 📋 **CHECKLIST PRÉ-TESTE**

### ✅ **1. Aplicar Correções no Supabase**
1. Acesse o **Supabase Dashboard** → SQL Editor
2. Execute o script `fix-workshop-registration-complete.sql`
3. Verifique se não há erros na execução
4. Confirme que todas as verificações finais retornam ✅ OK

### ✅ **2. Verificar Estrutura do Banco**
```sql
-- Execute no SQL Editor para verificar estrutura
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'workshops' 
ORDER BY ordinal_position;
```

**Resultado esperado:**
- ✅ `plan_type` existe e aceita 'free'/'pro'
- ✅ `updated_at` existe
- ✅ `address` é nullable

---

## 🔧 **TESTES DE CADASTRO**

### **TESTE 1: Cadastro por Email** 🔥

#### **Passos:**
1. Acesse: `/auth/oficina`
2. Clique na aba **"Cadastrar"**
3. Preencha os dados:
   ```
   Email: teste-oficina-1@gmail.com
   Senha: 123456
   Confirmar Senha: 123456
   Nome da Oficina: Auto Center Teste 1
   Plano: FREE (padrão)
   ```
4. Clique em **"Criar Conta"**
5. **AGUARDE** a mensagem de confirmação
6. Complete o perfil:
   ```
   CNPJ: 12.345.678/0001-90
   Telefone: (11) 99999-9999
   Plano: FREE
   ```
7. Clique em **"Finalizar Cadastro"**

#### **Resultado Esperado:**
- ✅ Mensagem: "✅ Oficina cadastrada com sucesso!"
- ✅ Redirecionamento para: `/oficina-basica`
- ✅ Dashboard básico carregado

#### **Verificação no Banco:**
```sql
-- Verificar se foi criado corretamente
SELECT 
    p.email, p.name, p.type,
    w.business_name, w.plan_type, w.cnpj
FROM profiles p
JOIN workshops w ON w.profile_id = p.id
WHERE p.email = 'teste-oficina-1@gmail.com';
```

---

### **TESTE 2: OAuth Google** 🔥

#### **Passos:**
1. Acesse: `/auth/oficina`
2. **IMPORTANTE**: Preencha primeiro:
   ```
   Nome da Oficina: Auto Center Google Teste
   Plano: PRO
   ```
3. Clique em **"Entrar com Google"**
4. Complete o login no Google
5. **AGUARDE** redirecionamento automático
6. Complete os dados restantes:
   ```
   CNPJ: 98.765.432/0001-10
   Telefone: (11) 88888-8888
   ```
7. Clique em **"Finalizar Cadastro"**

#### **Resultado Esperado:**
- ✅ Redirecionamento para: `/dashboard` (plano PRO)
- ✅ Dashboard completo carregado
- ✅ Dados da oficina salvos corretamente

---

### **TESTE 3: OAuth Facebook** 🔥

#### **Passos:**
1. Acesse: `/auth/oficina`
2. **IMPORTANTE**: Preencha primeiro:
   ```
   Nome da Oficina: Oficina Facebook Teste
   Plano: FREE
   ```
3. Clique em **"Entrar com Facebook"**
4. Complete o login no Facebook
5. Complete o perfil se necessário

#### **Resultado Esperado:**
- ✅ Redirecionamento para: `/oficina-basica` (plano FREE)
- ✅ Dados salvos corretamente

---

## 🔍 **MONITORAMENTO DE LOGS**

### **No Supabase Dashboard:**
1. Vá em **Logs** → **Database**
2. Procure por mensagens que contenham:
   - `🚀 HANDLE_NEW_USER`
   - `✅ Profile criado`
   - `🏪 Workshop criado`
   - `❌ ERRO` (se houver problemas)

### **Logs Esperados (Sucesso):**
```
🚀 HANDLE_NEW_USER - Iniciando para usuário: [UUID]
📧 Email: teste-oficina-1@gmail.com
✅ Dados extraídos - Tipo: oficina, Nome: Auto Center Teste 1, Plano: free
✅ Profile criado com sucesso para teste-oficina-1@gmail.com
🏪 Workshop criado: Auto Center Teste 1 (plano: free)
🎉 handle_new_user CONCLUÍDO com sucesso para teste-oficina-1@gmail.com
```

---

## 🐛 **TROUBLESHOOTING**

### **Problema: "Profile já existe"**
**Solução:**
```sql
-- Deletar usuário para testar novamente
DELETE FROM auth.users WHERE email = 'teste-oficina-1@gmail.com';
```

### **Problema: "Erro ao criar workshop"**
**Verificar:**
1. Se a coluna `plan_type` existe na tabela `workshops`
2. Se as políticas RLS estão ativas
3. Se não há conflito de CNPJ

### **Problema: Redirecionamento errado**
**Verificar:**
1. Se o `plan_type` foi salvo corretamente
2. Se a lógica no `src/app/auth/callback/page.tsx` está funcionando

---

## ✅ **CHECKLIST DE VALIDAÇÃO FINAL**

### **Para cada teste realizado, verificar:**

#### **📊 Dados no Banco**
- [ ] Profile criado na tabela `profiles`
- [ ] Workshop criado na tabela `workshops`
- [ ] `plan_type` correto ('free' ou 'pro')
- [ ] `business_name` preenchido
- [ ] CNPJ e telefone salvos (se completou perfil)

#### **🔄 Redirecionamento**
- [ ] FREE → `/oficina-basica`
- [ ] PRO → `/dashboard`
- [ ] Página carrega sem erros

#### **🎨 Interface**
- [ ] Mensagens de feedback aparecem
- [ ] Loading states funcionam
- [ ] Validações impedem envio incompleto
- [ ] OAuth só funciona com nome da oficina preenchido

---

## 🎯 **CRITÉRIOS DE SUCESSO**

### **✅ TESTE PASSOU SE:**
1. **Cadastro completa sem erros**
2. **Redirecionamento funciona corretamente**
3. **Dados salvos no banco de forma consistente**
4. **Logs não mostram erros críticos**
5. **Interface responde adequadamente**

### **❌ TESTE FALHOU SE:**
1. Erro durante o cadastro
2. Redirecionamento para página errada
3. Dados não salvos ou inconsistentes
4. Logs mostram erros na função `handle_new_user`
5. Interface trava ou não responde

---

## 📞 **PRÓXIMOS PASSOS APÓS TESTE**

### **Se todos os testes passaram:**
✅ **Marcar como CONCLUÍDO**
✅ **Partir para próxima prioridade**: Headers/Footers institucionais

### **Se algum teste falhou:**
🔧 **Analisar logs específicos**
🔧 **Ajustar função ou frontend conforme necessário**
🔧 **Re-testar até 100% funcional**

---

**🎉 BOA SORTE COM OS TESTES!**

*Qualquer problema, verifique os logs do Supabase e compare com os resultados esperados acima.* 
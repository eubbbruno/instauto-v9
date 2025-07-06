# 🧹 GUIA DE LIMPEZA - SNIPPETS SQL EDITOR SUPABASE

## 🎯 **SITUAÇÃO ATUAL**
Você tem muitos snippets no SQL Editor do Supabase e precisa organizar. Vou te ajudar a identificar quais **DELETAR** e quais **MANTER**.

---

## ❌ **SNIPPETS PARA DELETAR** (Scripts Antigos/Problemáticos)

### **🗑️ Scripts de Configuração Antiga:**
- `database-setup.sql` - Schema antigo, substituído
- `supabase-setup.md` - Documentação antiga
- `fix-auth-profiles.sql` - Correções antigas que não funcionaram
- `corrigir-oauth-oficina.sql` - Tentativas antigas de correção
- `supabase-auth-social-setup.sql` - Setup OAuth antigo
- `fix-workshop-registration-complete.sql` - Correções específicas antigas
- `supabase-schema-verification.sql` - Verificação antiga

### **🗑️ Scripts de Limpeza Anteriores:**
- `supabase-auth-clean-reset.sql` - Reset antigo, substituído
- `ajustes-schema-seguro.sql` - Ajustes antigos
- `limpar-dados-simples.sql` - Limpeza específica antiga
- `limpar-dados-teste.sql` - Limpeza de teste antiga
- `limpar-dados-teste-seguro.sql` - Outra limpeza antiga

### **🗑️ Scripts de Auth Problemáticos:**
- `supabase-auth-separated-with-plans.sql` - Versão com erro da coluna `verified`
- Qualquer snippet que mencione colunas que não existem
- Scripts que deram erro ao executar

---

## ✅ **SNIPPETS PARA MANTER** (Scripts Úteis)

### **🔍 Script de Verificação:**
- **`verificar-estado-banco-atual.sql`** → Para verificar o estado atual do banco

### **🧹 Script de Limpeza Total:**
- **`limpeza-total-banco.sql`** → Script completo e funcional para recriar tudo

### **📊 Scripts de Dados/Seed:**
- `seed-data.sql` - Se contém dados de exemplo úteis
- Qualquer script que insira dados de teste válidos

### **🔧 Scripts de Configuração Específica:**
- Scripts relacionados ao MercadoPago (se funcionais)
- Scripts de chat realtime (se funcionais)
- Scripts de configurações específicas que funcionam

---

## 🎯 **ESTRATÉGIA DE LIMPEZA RECOMENDADA**

### **PASSO 1: Execute Primeiro**
1. **`verificar-estado-banco-atual.sql`** - Para ver o que você tem
2. Analise os resultados para entender o estado atual

### **PASSO 2: Limpeza Total**
1. **`limpeza-total-banco.sql`** - Para começar do zero
2. Este script resolve todos os problemas de incompatibilidade

### **PASSO 3: Deletar Snippets Antigos**
Depois que tudo funcionar, delete todos os snippets antigos listados acima.

---

## 🗂️ **ORGANIZAÇÃO FINAL DOS SNIPPETS**

### **📁 Manter apenas estes:**
```
✅ verificar-estado-banco-atual.sql
✅ limpeza-total-banco.sql  
✅ seed-data.sql (se útil)
✅ GUIA-TESTE-AUTH-SEPARADO-COM-PLANOS.md (referência)
```

### **🗑️ Deletar todos os outros:**
- Qualquer script com "fix", "corrigir", "ajustar" no nome
- Scripts antigos de setup/configuração
- Scripts que deram erro
- Duplicatas ou versões antigas

---

## ⚠️ **IMPORTANTE: ORDEM DE EXECUÇÃO**

1. **PRIMEIRO:** Execute `verificar-estado-banco-atual.sql`
2. **SEGUNDO:** Execute `limpeza-total-banco.sql` 
3. **TERCEIRO:** Teste o sistema de auth
4. **QUARTO:** Delete os snippets antigos

---

## 🎉 **RESULTADO FINAL**

Depois da limpeza você terá:
- ✅ Banco limpo e organizado
- ✅ Poucos snippets úteis
- ✅ Sistema de auth funcionando
- ✅ Estrutura clara e manutenível

---

## 📞 **PRÓXIMOS PASSOS**

1. **Execute primeiro:** `verificar-estado-banco-atual.sql`
2. **Me mande os resultados** para eu ver o estado atual
3. **Execute:** `limpeza-total-banco.sql`
4. **Teste o sistema** seguindo o guia
5. **Delete os snippets antigos**

**💡 Quer que eu te ajude a analisar os resultados do script de verificação?** 
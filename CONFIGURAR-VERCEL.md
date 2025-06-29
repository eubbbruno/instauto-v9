# 🚀 CONFIGURAR VARIÁVEIS DE AMBIENTE NO VERCEL

## 🚨 **PROBLEMA ATUAL:**
```
⚠️ Supabase não configurado. Configure as variáveis de ambiente.
Status do Sistema: ❌ Banco de dados: Desconectado
```

## 🔧 **SOLUÇÃO: CONFIGURAR NO VERCEL**

### **PASSO 1: ACESSAR VERCEL DASHBOARD**
1. Vá para: https://vercel.com/dashboard
2. Encontre o projeto: **instauto-v9** (ou similar)
3. Clique no projeto

### **PASSO 2: CONFIGURAR ENVIRONMENT VARIABLES**
1. Clique na aba **"Settings"**
2. No menu lateral, clique em **"Environment Variables"**
3. Adicione estas variáveis **UMA POR UMA:**

## 📋 **VARIÁVEIS OBRIGATÓRIAS:**

### **🔐 SUPABASE (COPIAR EXATAMENTE):**
```
NEXT_PUBLIC_SUPABASE_URL
https://rtpejermxgjwkqjcdvwi.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0cGVqZXJteGdqd2txamNkdndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjkwOTksImV4cCI6MjA2NTUwNTA5OX0.lWPBmqcQQFhXyyA2rM6FXuvHpTQe0m3lEhrueoH48S4
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0cGVqZXJteGdqd2txamNkdndpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTkyOTA5OSwiZXhwIjoyMDY1NTA1MDk5fQ.HGxYBTMSbkMFBw1OYfbVwf9zt9mnZurSRsFilh96Mkw
```

### **🌐 PRODUÇÃO:**
```
NODE_ENV
production
```

```
NEXT_PUBLIC_APP_URL
https://www.instauto.com.br
```

```
NEXT_PUBLIC_SITE_URL
https://www.instauto.com.br
```

```
NEXT_PUBLIC_BASE_URL
https://www.instauto.com.br
```

### **💳 MERCADO PAGO (OPCIONAL):**
```
MERCADOPAGO_ACCESS_TOKEN
APP_USR-4039750742210095-061416-bcdafaa04b162c3ad5350ee145a3b319-184177149
```

```
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
APP_USR-8d672d09-2260-4969-bd03-d69e3ca3802b
```

## 🎯 **COMO ADICIONAR CADA VARIÁVEL:**

1. **Name:** Cole o nome da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
2. **Value:** Cole o valor correspondente
3. **Environments:** Selecione **"Production"**, **"Preview"** e **"Development"**
4. Clique **"Save"**
5. **Repita para cada variável**

## 🚀 **PASSO 3: FAZER NOVO DEPLOY**

Após adicionar todas as variáveis:
1. Vá para aba **"Deployments"**
2. Clique em **"Redeploy"** na última versão
3. **OU** faça um novo commit no GitHub (força novo deploy)

## ⏱️ **PASSO 4: AGUARDAR E TESTAR**
1. Aguarde 2-3 minutos
2. Acesse: https://www.instauto.com.br
3. Deve aparecer: **✅ Banco de dados: Conectado**
4. Teste: https://www.instauto.com.br/auth

## 🔍 **VERIFICAÇÃO:**
- ✅ **Antes:** ❌ Banco de dados: Desconectado
- ✅ **Depois:** ✅ Banco de dados: Conectado
- ✅ **Login:** Funcionando sem erro "Database error"

## 📱 **DICA RÁPIDA:**
Se der trabalho adicionar uma por uma, você pode:
1. Fazer upload de um arquivo `.env`
2. Ou usar o Vercel CLI: `vercel env add`

## 🆘 **SE DER PROBLEMA:**
- Verifique se **copiou exatamente** (sem espaços extras)
- Confirme que selecionou **todos os environments**
- Aguarde o **redeploy completo** (2-3 min)
- Limpe cache do navegador (Ctrl+F5) 
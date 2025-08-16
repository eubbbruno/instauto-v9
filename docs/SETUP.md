# 🚀 Guia Completo de Setup - InstaAuto

## 📖 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Supabase](#configuração-supabase)
3. [Configuração Local](#configuração-local)
4. [Setup Automatizado](#setup-automatizado)
5. [Verificação](#verificação)
6. [Deploy Vercel](#deploy-vercel)

---

## 📋 Pré-requisitos

### Software Necessário
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Editor de código** (VS Code recomendado)

### Contas Necessárias
- **Supabase** - [Criar conta](https://supabase.com)
- **Vercel** (opcional) - [Criar conta](https://vercel.com)

---

## 🗄️ Configuração Supabase

### 1. Criar Projeto
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Escolha sua organização
4. Nome do projeto: `instauto-production` (ou similar)
5. Database Password: Crie uma senha forte
6. Região: `South America (São Paulo)` (para melhor latência)
7. Clique **"Create new project"**

### 2. Configurar Authentication
1. No dashboard, vá em **Authentication → Settings**
2. **Site URL:** `https://www.instauto.com.br`
3. **Redirect URLs:** 
   ```
   https://www.instauto.com.br/**
   http://localhost:3000/**
   ```

### 3. Obter Chaves de API
1. Vá em **Settings → API**
2. Copie os seguintes valores:
   - **URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (⚠️ **SECRETA!**)

---

## 💻 Configuração Local

### 1. Clone do Repositório
```bash
# Clone o projeto
git clone https://github.com/eubbbruno/instauto-v9.git
cd instauto-v9

# Instale dependências
npm install
```

### 2. Configuração de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo (use seu editor preferido)
nano .env.local
```

### 3. Configurar .env.local
```env
# Supabase (OBRIGATÓRIO)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_KEY=sua-chave-servico

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## ⚡ Setup Automatizado

### 1. Verificar Ambiente
```bash
npm run setup:check
```
**Deve mostrar:** ✅ para todas as verificações

### 2. Configurar Banco de Dados
1. Abra o **Supabase SQL Editor**
2. Copie e execute o conteúdo de: `setup/database-schema.sql`
3. Aguarde execução completa

### 3. Criar Admin
```bash
npm run setup:admin
```
**Deve mostrar:** 
- ✅ Usuário auth criado
- ✅ Profile criado
- 📋 Credenciais: admin@instauto.com.br / InstaAuto@2024

### 4. Verificar Setup
```bash
npm run setup:verify
```
**Deve mostrar:** ✅ para todas as verificações

---

## 🧪 Verificação

### 1. Iniciar Servidor
```bash
npm run dev
```

### 2. Testar Login Admin
1. Acesse: http://localhost:3000/login
2. Credenciais:
   - **Email:** admin@instauto.com.br
   - **Senha:** InstaAuto@2024
3. **Deve redirecionar para:** `/admin`

### 3. Verificar Dashboards
- **Admin:** http://localhost:3000/admin ✅
- **Motorista:** http://localhost:3000/motorista (deve bloquear)
- **Oficina Free:** http://localhost:3000/oficina-free (deve bloquear)
- **Oficina Pro:** http://localhost:3000/oficina-pro (deve bloquear)

---

## 🚀 Deploy Vercel

### 1. Conectar Repositório
1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. **"New Project"** → **"Import Git Repository"**
3. Selecione o repositório `instauto-v9`

### 2. Configurar Environment Variables
No dashboard do Vercel, **Settings → Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_KEY=sua-chave-servico
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NODE_ENV=production
```

**Marque para:** Production, Preview, Development

### 3. Deploy
1. Clique **"Deploy"**
2. Aguarde build (2-3 minutos)
3. Teste o site em produção

### 4. Configurar Domínio (Opcional)
1. **Settings → Domains**
2. Adicione: `www.instauto.com.br`
3. Configure DNS conforme instruções

---

## 🔧 Configurações Adicionais

### MercadoPago (Pagamentos)
```env
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-xxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxx
```

### Google Maps (Mapas)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXX
```

### Push Notifications
```env
NEXT_PUBLIC_VAPID_KEY=BXXXxxx
VAPID_PRIVATE_KEY=xxxXXX
```

---

## ✅ Checklist Final

### Desenvolvimento Local
- [ ] Node.js 18+ instalado
- [ ] Projeto clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] .env.local configurado
- [ ] `npm run setup:check` ✅
- [ ] database-schema.sql executado no Supabase
- [ ] `npm run setup:admin` ✅
- [ ] `npm run setup:verify` ✅
- [ ] `npm run dev` funciona
- [ ] Login admin funciona
- [ ] Dashboards protegidos

### Produção Vercel
- [ ] Repositório conectado
- [ ] Environment variables configuradas
- [ ] Deploy funcionando
- [ ] Login em produção funciona
- [ ] Performance OK
- [ ] Domínio configurado (se aplicável)

---

## 🆘 Problemas?

1. **Consulte:** [Troubleshooting](TROUBLESHOOTING.md)
2. **Execute:** `npm run setup:verify`
3. **Verifique:** Console do navegador (F12)
4. **Reset completo:** Se necessário

---

## 🎯 Próximos Passos

Após setup completo:

1. **Criar usuários demo:** `/admin/demo-users`
2. **Importar oficinas:** `/admin/seed`
3. **Configurar integrações:** MercadoPago, Google Maps
4. **Testar fluxos:** Motorista → Oficina
5. **Monitorar:** Logs e performance

**🚀 Sistema pronto para produção!**

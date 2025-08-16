# 🚀 Setup InstaAuto - Sistema Automatizado

## 📋 Pré-requisitos
- ✅ Node.js 18+
- ✅ Conta Supabase ativa
- ✅ Conta Vercel (opcional para deploy)

## ⚡ Setup Rápido (5 minutos)

### 1️⃣ Clone e Configure
```bash
# Clone o repositório
git clone https://github.com/eubbbruno/instauto-v9.git
cd instauto-v9

# Instale dependências
npm install

# Configure ambiente
cp .env.example .env.local
# Edite .env.local com suas variáveis do Supabase
```

### 2️⃣ Execute o Setup Automatizado
```bash
# Verificar ambiente
npm run setup:check

# Setup completo
npm run setup
```

### 3️⃣ Pronto! 🎉
- **Admin:** admin@instauto.com.br / InstaAuto@2024
- **URL:** http://localhost:3000/login

---

## 🔧 Setup Manual (se precisar)

### Passo 1: Configurar Supabase
1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Vá em **Settings > API**
3. Copie `URL` e `anon/public key` para `.env.local`
4. Copie `service_role key` para `.env.local`

### Passo 2: Executar Scripts SQL
```sql
-- No Supabase SQL Editor, execute nesta ordem:
1. setup/database-schema.sql
2. setup/seed-data.sql
```

### Passo 3: Criar Admin
```bash
npm run setup:admin
```

### Passo 4: Verificar
```bash
npm run setup:verify
```

---

## 👥 Usuários Padrão Criados

| Tipo | Email | Senha | Dashboard |
|------|-------|-------|-----------|
| **Admin** | admin@instauto.com.br | InstaAuto@2024 | `/admin` |
| **Motorista** | motorista@demo.com | demo123 | `/motorista` |
| **Oficina Free** | oficina.free@demo.com | demo123 | `/oficina-free` |
| **Oficina Pro** | oficina.pro@demo.com | demo123 | `/oficina-pro` |

---

## 🆘 Problemas?

### ❌ "Profile não encontrado"
```bash
npm run setup:reset
npm run setup
```

### ❌ "Invalid credentials"
```bash
npm run setup:admin
```

### ❌ Erro de tabelas
```bash
# Execute setup/database-schema.sql novamente no Supabase
```

### 📖 Mais ajuda
- [Troubleshooting](../docs/TROUBLESHOOTING.md)
- [Arquitetura](../docs/ARCHITECTURE.md)

---

## 🔄 Scripts Disponíveis

```bash
npm run setup          # Setup completo
npm run setup:check    # Verificar ambiente
npm run setup:admin    # Criar admin
npm run setup:verify   # Verificar configuração
npm run setup:reset    # Reset completo
```

---

## 🎯 Próximos Passos

1. ✅ **Testar login** em `/login`
2. ✅ **Acessar admin** em `/admin`
3. ✅ **Criar usuários** em `/admin/demo-users`
4. ✅ **Deploy** no Vercel

**🚀 Sistema pronto para produção!**

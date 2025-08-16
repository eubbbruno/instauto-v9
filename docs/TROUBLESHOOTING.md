# 🔧 Troubleshooting InstaAuto

## 🚨 Problemas Comuns e Soluções

### ❌ "Profile não encontrado"

**Sintomas:**
- Erro ao acessar dashboards
- Redirecionamento constante para login
- Console: "Profile não encontrado após 3 tentativas"

**Soluções:**
```bash
# 1. Verificar se usuário existe
npm run setup:verify

# 2. Recriar admin
npm run setup:admin

# 3. Verificar tabelas
# Execute setup/database-schema.sql no Supabase
```

### ❌ "Invalid login credentials"

**Sintomas:**
- Login sempre falha
- Mensagem "credenciais inválidas"

**Soluções:**
```bash
# 1. Resetar senha do admin
# No Supabase Dashboard > Authentication > Users
# Encontre admin@instauto.com.br e reset password

# 2. Recriar admin completamente
npm run setup:admin

# 3. Verificar email confirmado
# No Dashboard, certifique-se que "Email Confirmed" = true
```

### ❌ "Relation 'drivers' does not exist"

**Sintomas:**
- Erro SQL sobre tabelas inexistentes
- Setup falha

**Soluções:**
```sql
-- Execute no Supabase SQL Editor:
-- setup/database-schema.sql
```

### ❌ Admin redireciona para login

**Sintomas:**
- Login funciona, mas /admin volta para /login
- Erro: "Erro ao verificar permissões"

**Soluções:**
```bash
# 1. Verificar RLS
npm run setup:verify

# 2. Verificar tipo do profile
# No Supabase Dashboard > Table Editor > profiles
# Certifique-se que admin tem type = 'admin'
```

### ❌ RLS bloqueando acesso

**Sintomas:**
- Tabelas existem mas dados não aparecem
- Erros de permissão

**Soluções temporárias:**
```sql
-- TEMPORARIAMENTE desabilitar RLS para debug:
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE workshops DISABLE ROW LEVEL SECURITY;
ALTER TABLE drivers DISABLE ROW LEVEL SECURITY;

-- Testar se funciona, depois reabilitar:
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- etc...
```

### ❌ Variáveis de ambiente

**Sintomas:**
- "Supabase URL não configurada"
- Erro de conexão

**Soluções:**
```bash
# 1. Verificar .env.local existe
ls -la .env.local

# 2. Verificar conteúdo
npm run setup:check

# 3. Recriar se necessário
cp .env.example .env.local
# Edite com suas variáveis
```

---

## 🔍 Debugging Avançado

### Console do Navegador

1. Abra F12 > Console
2. Execute:
```javascript
// Testar login manual
const { data, error } = await window.supabase.auth.signInWithPassword({
  email: 'admin@instauto.com.br',
  password: 'InstaAuto@2024'
})
console.log('Login result:', { data, error })

// Se login OK, testar buscar profile
if (data?.user) {
  const { data: profile } = await window.supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()
  console.log('Profile:', profile)
}
```

### Logs do Servidor

```bash
# Executar em modo desenvolvimento com logs
npm run dev

# Verificar logs detalhados no terminal
# RouteProtection.tsx tem console.log detalhado
```

### Verificar Banco Diretamente

No Supabase SQL Editor:
```sql
-- Verificar usuários
SELECT * FROM auth.users WHERE email = 'admin@instauto.com.br';

-- Verificar profiles
SELECT * FROM profiles WHERE email = 'admin@instauto.com.br';

-- Verificar políticas RLS
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Verificar tabelas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

---

## 🆘 Reset Completo

Se nada funcionar, reset completo:

```bash
# 1. Backup .env.local
cp .env.local .env.backup

# 2. Limpar Supabase
# No Dashboard > SQL Editor, delete tudo:
DROP TABLE IF EXISTS avaliacoes CASCADE;
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS workshops CASCADE;
DROP TABLE IF EXISTS drivers CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

# No Dashboard > Authentication > Users, delete todos os usuários

# 3. Recriar tudo
npm run setup:check
# Execute setup/database-schema.sql
npm run setup:admin
npm run setup:verify
```

---

## 📞 Ainda Não Funciona?

1. **Verifique versões:**
   - Node.js >= 18
   - npm install atualizado

2. **Verifique logs:**
   - Console do navegador (F12)
   - Terminal do npm run dev
   - Supabase Dashboard > Logs

3. **Compare com working state:**
   - Verifique se todas as tabelas existem
   - Verifique se RLS está configurado
   - Verifique se admin tem type='admin'

4. **Último recurso:**
   - Criar novo projeto Supabase
   - Executar setup do zero

---

## 🚀 Verificação de Saúde

Execute sempre que suspeitar de problemas:

```bash
npm run setup:verify
```

Este comando verifica:
- ✅ Conexão Supabase
- ✅ Tabelas existem
- ✅ Admin existe e funciona
- ✅ Login funciona
- ✅ RLS configurado
- ✅ Profile acessível

**Se todos os ✅ aparecerem, o sistema está OK!**

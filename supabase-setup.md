# 🗄️ CONFIGURAÇÃO SUPABASE - INSTAUTO V9

## 📋 PASSO A PASSO

### 1. CRIAR PROJETO SUPABASE
```bash
# 1. Acesse: https://supabase.com
# 2. Clique em "Start your project"
# 3. Conecte com GitHub
# 4. Crie novo projeto: "instauto-v9"
# 5. Escolha região: South America (São Paulo)
# 6. Aguarde setup (2-3 minutos)
```

### 2. INSTALAR DEPENDÊNCIAS
```bash
npm install @supabase/supabase-js
npm install @supabase/auth-helpers-nextjs
npm install @supabase/auth-ui-react
npm install @supabase/auth-ui-shared
```

### 3. CONFIGURAR VARIÁVEIS DE AMBIENTE
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. ESTRUTURA DO BANCO DE DADOS

```sql
-- TABELA: profiles (extensão do auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('motorista', 'oficina')) NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: drivers (motoristas)
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cpf TEXT UNIQUE,
  birth_date DATE,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: workshops (oficinas)
CREATE TABLE workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  address JSONB NOT NULL,
  services TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  opening_hours JSONB,
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: vehicles (veículos)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  plate TEXT UNIQUE NOT NULL,
  color TEXT,
  fuel_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: appointments (agendamentos)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'finalizado', 'cancelado')) DEFAULT 'agendado',
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: service_orders (ordens de serviço)
CREATE TABLE service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('pendente', 'orcamento_enviado', 'aprovado', 'em_andamento', 'finalizado')) DEFAULT 'pendente',
  items JSONB DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: conversations (conversas)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: messages (mensagens)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: reviews (avaliações)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABELA: payments (pagamentos)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cartao', 'pix', 'boleto')) NOT NULL,
  status TEXT CHECK (status IN ('pendente', 'processando', 'aprovado', 'rejeitado')) DEFAULT 'pendente',
  external_id TEXT, -- ID do Mercado Pago/Stripe
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. ROW LEVEL SECURITY (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Drivers can view own data" ON drivers FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Drivers can update own data" ON drivers FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Workshops can view own data" ON workshops FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Workshops can update own data" ON workshops FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Anyone can view workshops" ON workshops FOR SELECT USING (true);

-- Continuar com outras políticas...
```

### 6. TRIGGERS E FUNÇÕES

```sql
-- Função para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'type');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

### 7. CONFIGURAÇÃO REAL-TIME

```sql
-- Habilitar real-time para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
```

## 🔧 PRÓXIMOS ARQUIVOS A CRIAR

1. `lib/supabase.ts` - Cliente Supabase
2. `lib/auth.ts` - Helpers de autenticação  
3. `hooks/useSupabase.ts` - Hook personalizado
4. `types/database.ts` - Tipos TypeScript
5. Migrar `AuthContext.tsx` para Supabase

## 📱 FUNCIONALIDADES QUE TEREMOS

✅ **Autenticação real** (email, Google, GitHub)
✅ **Database PostgreSQL** robusto
✅ **Real-time** para mensagens
✅ **Upload de arquivos** (avatars, fotos)
✅ **Row Level Security** (segurança)
✅ **API automática** (REST + GraphQL)
✅ **Webhooks** para integrações 
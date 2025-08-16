# 📋 ESTRUTURA DE PÁGINAS - INSTAUTO V7

## 🏠 PÁGINAS PRINCIPAIS (PÚBLICAS)

### **1. Home Page**
- **URL:** `/`
- **Descrição:** Landing page principal do InstaAuto
- **Conteúdo:** Hero, features, benefits, testimonials, CTA
- **CTA:** Botões para "Sou Motorista" e "Sou Oficina"

### **2. Página Motoristas**
- **URL:** `/motoristas`
- **Descrição:** Landing específica para motoristas
- **Conteúdo:** Benefits, como funciona, download app, depoimentos
- **CTA:** "Começar Agora" → `/login-simples`

### **3. Página Oficinas**
- **URL:** `/oficinas`
- **Descrição:** Landing específica para oficinas
- **Conteúdo:** Planos (Free/Pro), features, preços, comparativo
- **CTA:** "Começar Grátis" ou "Teste PRO" → `/login-simples`

### **4. Páginas Institucionais**
- **URLs:** `/termos`, `/privacidade`, `/cookies`, `/contato`
- **Status:** ✅ Prontas

---

## 🔐 PÁGINAS DE LOGIN

### **1. Login Simples (PRINCIPAL)**
- **URL:** `/login-simples`
- **Público:** Motoristas e Oficinas
- **Features:** 
  - ✅ Cadastro e Login
  - ✅ Escolha de tipo (Motorista/Oficina)
  - ✅ Planos (Free/Pro)
  - ✅ Toast notifications
  - ✅ Animações
- **Redirecionamento:**
  - Motorista → `/motorista`
  - Oficina Free → `/oficina-free`
  - Oficina Pro → `/oficina-pro`

### **2. Login Admin (SEPARADO)**
- **URL:** `/admin/login`
- **Público:** Apenas administradores
- **Features:**
  - ✅ Login exclusivo admin
  - ✅ Validação de permissões
- **Redirecionamento:** `/admin`

### **3. Login Tradicional (MANTER OU REMOVER?)**
- **URL:** `/login`
- **Status:** 🤔 **DECISÃO PENDENTE**
- **Opções:**
  - A) **Redirecionar** para `/login-simples`
  - B) **Manter** como backup
  - C) **Remover** completamente

---

## 🎯 DASHBOARDS (PRIVADOS)

### **1. Motorista**
- **URL:** `/motorista`
- **Features:** Buscar oficinas, agendamentos, garagem, histórico

### **2. Oficina Free**
- **URL:** `/oficina-free`
- **Features:** Básicas, limite de clientes, upgrade para PRO

### **3. Oficina Pro**
- **URL:** `/oficina-pro`  
- **Features:** Avançadas, ilimitado, trial 7 dias

### **4. Admin**
- **URL:** `/admin`
- **Features:** Gerenciar usuários, cupons, comissões, analytics

---

## 💰 SISTEMA DE CUPONS (NOVO)

### **Tabela Cupons**
```sql
CREATE TABLE cupons (
  id UUID PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  influencer_name TEXT NOT NULL,
  influencer_email TEXT,
  discount_percent INTEGER NOT NULL, -- Ex: 20 (20%)
  commission_percent INTEGER NOT NULL, -- Ex: 10 (10% para influencer)
  max_uses INTEGER, -- NULL = ilimitado
  current_uses INTEGER DEFAULT 0,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabela Uso de Cupons**
```sql
CREATE TABLE coupon_uses (
  id UUID PRIMARY KEY,
  coupon_id UUID REFERENCES cupons(id),
  user_id UUID REFERENCES profiles(id),
  workshop_id UUID REFERENCES workshops(id),
  original_price DECIMAL,
  discount_amount DECIMAL,
  commission_amount DECIMAL,
  used_at TIMESTAMP DEFAULT NOW()
);
```

### **Features Admin Cupons**
- ✅ Criar cupons
- ✅ Definir % desconto
- ✅ Definir % comissão
- ✅ Limite de usos
- ✅ Data validade
- ✅ Analytics de uso
- ✅ Relatório comissões

---

## 🚀 PRÓXIMOS PASSOS

1. **Decidir** sobre `/login` tradicional
2. **Implementar** sistema de cupons
3. **Conectar** home → oficinas → login
4. **Adicionar** campo cupom no signup PRO

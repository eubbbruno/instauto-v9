-- Script para criar usuários demo fixos para testes do InstaAuto
-- Execute este script no Supabase SQL Editor

-- IMPORTANTE: Este script assume que você criará os usuários manualmente no Supabase Dashboard primeiro
-- Depois substitua os UUIDs aqui pelos IDs reais gerados

-- ============================================================================
-- USUÁRIOS DEMO PARA CRIAR NO SUPABASE DASHBOARD
-- ============================================================================

/*
PASSO 1: Criar usuários no Supabase Dashboard → Authentication → Users

1. MOTORISTA DEMO:
   Email: motorista.demo@instauto.com.br
   Password: InstaAuto2025!
   Email Confirm: ✓ true

2. OFICINA FREE DEMO:
   Email: oficina.free@instauto.com.br
   Password: InstaAuto2025!
   Email Confirm: ✓ true

3. OFICINA PRO DEMO:
   Email: oficina.pro@instauto.com.br
   Password: InstaAuto2025!
   Email Confirm: ✓ true

4. ADMIN DEMO:
   Email: admin.demo@instauto.com.br
   Password: InstaAuto2025!
   Email Confirm: ✓ true

PASSO 2: Copiar os UUIDs gerados e substituir nos INSERTs abaixo
*/

-- ============================================================================
-- CONFIGURAR OS UUIDs DOS USUÁRIOS CRIADOS
-- ============================================================================

-- SUBSTITUA PELOS UUIDs REAIS DOS USUÁRIOS CRIADOS NO DASHBOARD
DO $$
DECLARE
    motorista_id UUID := '11111111-1111-1111-1111-111111111111'; -- SUBSTITUIR
    oficina_free_id UUID := '22222222-2222-2222-2222-222222222222'; -- SUBSTITUIR
    oficina_pro_id UUID := '33333333-3333-3333-3333-333333333333'; -- SUBSTITUIR
    admin_id UUID := '44444444-4444-4444-4444-444444444444'; -- SUBSTITUIR
BEGIN

-- ============================================================================
-- LIMPAR DADOS EXISTENTES DOS DEMOS (SEGURANÇA)
-- ============================================================================

DELETE FROM workshops WHERE email IN (
  'motorista.demo@instauto.com.br',
  'oficina.free@instauto.com.br', 
  'oficina.pro@instauto.com.br',
  'admin.demo@instauto.com.br'
);

DELETE FROM profiles WHERE email IN (
  'motorista.demo@instauto.com.br',
  'oficina.free@instauto.com.br', 
  'oficina.pro@instauto.com.br',
  'admin.demo@instauto.com.br'
);

-- ============================================================================
-- CRIAR PROFILES DOS USUÁRIOS DEMO
-- ============================================================================

-- 1. MOTORISTA DEMO
INSERT INTO profiles (
  id,
  email,
  full_name,
  type,
  created_at,
  updated_at
) VALUES (
  motorista_id,
  'motorista.demo@instauto.com.br',
  'João Silva - Motorista Demo',
  'motorista',
  NOW(),
  NOW()
);

-- 2. OFICINA FREE DEMO
INSERT INTO profiles (
  id,
  email,
  full_name,
  type,
  created_at,
  updated_at
) VALUES (
  oficina_free_id,
  'oficina.free@instauto.com.br',
  'Mecânica do José - FREE Demo',
  'workshop_owner',
  NOW(),
  NOW()
);

-- 3. OFICINA PRO DEMO
INSERT INTO profiles (
  id,
  email,
  full_name,
  type,
  created_at,
  updated_at
) VALUES (
  oficina_pro_id,
  'oficina.pro@instauto.com.br',
  'AutoCenter Premium - PRO Demo',
  'workshop_owner',
  NOW(),
  NOW()
);

-- 4. ADMIN DEMO
INSERT INTO profiles (
  id,
  email,
  full_name,
  type,
  created_at,
  updated_at
) VALUES (
  admin_id,
  'admin.demo@instauto.com.br',
  'Admin InstaAuto - Demo',
  'admin',
  NOW(),
  NOW()
);

-- ============================================================================
-- CRIAR WORKSHOPS PARA AS OFICINAS DEMO
-- ============================================================================

-- OFICINA FREE DEMO
INSERT INTO workshops (
  id,
  profile_id,
  business_name,
  address,
  phone,
  email,
  description,
  services,
  specialties,
  rating,
  total_reviews,
  verified,
  plan_type,
  is_trial,
  trial_ends_at,
  opening_hours,
  price_range,
  whatsapp,
  website,
  created_at,
  updated_at
) VALUES (
  oficina_free_id,
  oficina_free_id,
  'Mecânica do José - FREE Demo',
  '{
    "rua": "Rua das Flores, 123",
    "numero": "123",
    "bairro": "Vila Madalena",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "05014-000",
    "lat": -23.5505,
    "lng": -46.6333
  }'::jsonb,
  '(11) 98765-4321',
  'oficina.free@instauto.com.br',
  'Oficina familiar com mais de 15 anos de experiência. Atendimento personalizado e preços justos. Ideal para demonstração do plano FREE.',
  ARRAY['Mecânica Geral', 'Troca de Óleo', 'Sistema de Freios', 'Alinhamento e Balanceamento'],
  ARRAY['Volkswagen', 'Fiat', 'Ford'],
  4.3,
  87,
  true,
  'free',
  false,
  NULL,
  '{
    "segunda": "08:00 - 18:00",
    "terca": "08:00 - 18:00", 
    "quarta": "08:00 - 18:00",
    "quinta": "08:00 - 18:00",
    "sexta": "08:00 - 18:00",
    "sabado": "08:00 - 14:00",
    "domingo": "Fechado"
  }'::jsonb,
  '$',
  '(11) 98765-4321',
  NULL,
  NOW(),
  NOW()
);

-- OFICINA PRO DEMO (COM TRIAL ATIVO)
INSERT INTO workshops (
  id,
  profile_id,
  business_name,
  address,
  phone,
  email,
  description,
  services,
  specialties,
  rating,
  total_reviews,
  verified,
  plan_type,
  is_trial,
  trial_ends_at,
  opening_hours,
  price_range,
  whatsapp,
  website,
  created_at,
  updated_at
) VALUES (
  oficina_pro_id,
  oficina_pro_id,
  'AutoCenter Premium - PRO Demo',
  '{
    "rua": "Av. Paulista, 1500",
    "numero": "1500",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP", 
    "cep": "01310-100",
    "lat": -23.5614,
    "lng": -46.6558
  }'::jsonb,
  '(11) 91234-5678',
  'oficina.pro@instauto.com.br',
  'Centro automotivo premium com tecnologia de ponta. Especializado em veículos nacionais e importados. Demonstração completa dos recursos PRO.',
  ARRAY['Mecânica Geral', 'Diagnóstico Computadorizado', 'Injeção Eletrônica', 'Ar Condicionado', 'Sistema de Freios', 'Motor', 'Câmbio', 'Elétrica Automotiva'],
  ARRAY['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Honda', 'Toyota'],
  4.8,
  234,
  true,
  'pro',
  true,
  (NOW() + INTERVAL '5 days')::timestamp,
  '{
    "segunda": "07:00 - 19:00",
    "terca": "07:00 - 19:00",
    "quarta": "07:00 - 19:00", 
    "quinta": "07:00 - 19:00",
    "sexta": "07:00 - 19:00",
    "sabado": "08:00 - 16:00",
    "domingo": "09:00 - 14:00"
  }'::jsonb,
  '$$',
  '(11) 91234-5678',
  'https://autocenterpremium.com.br',
  NOW(),
  NOW()
);

END $$;

-- ============================================================================
-- CRIAR DADOS DE TESTE ADICIONAIS
-- ============================================================================

-- Inserir alguns agendamentos de exemplo para o motorista demo
-- (será implementado quando as tabelas estiverem prontas)

-- ============================================================================
-- VERIFICAÇÕES E RELATÓRIOS
-- ============================================================================

-- Verificar se os usuários foram criados corretamente
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.type,
  p.created_at,
  CASE 
    WHEN p.type = 'workshop_owner' THEN (
      SELECT w.business_name 
      FROM workshops w 
      WHERE w.profile_id = p.id
    )
    ELSE NULL
  END as workshop_name,
  CASE 
    WHEN p.type = 'workshop_owner' THEN (
      SELECT w.plan_type 
      FROM workshops w 
      WHERE w.profile_id = p.id
    )
    ELSE NULL
  END as plan_type
FROM profiles p
WHERE p.email LIKE '%.demo@instauto.com.br'
ORDER BY p.type, p.email;

-- Verificar workshops demo
SELECT 
  w.id,
  w.business_name,
  w.plan_type,
  w.is_trial,
  w.trial_ends_at,
  w.verified,
  w.rating,
  w.total_reviews,
  array_length(w.services, 1) as total_services,
  array_length(w.specialties, 1) as total_specialties
FROM workshops w
WHERE w.email LIKE '%.demo@instauto.com.br'
ORDER BY w.plan_type;

-- ============================================================================
-- INSTRUÇÕES DE USO
-- ============================================================================

/*
COMO USAR OS USUÁRIOS DEMO:

1. MOTORISTA DEMO:
   Login: motorista.demo@instauto.com.br / InstaAuto2025!
   Acesso: /motorista (dashboard completo)
   Recursos: Busca, favoritos, agendamentos, mensagens, etc.

2. OFICINA FREE DEMO:
   Login: oficina.free@instauto.com.br / InstaAuto2025!
   Acesso: /oficina-free (recursos básicos)
   Limitações: 3 conversas, relatórios básicos, etc.

3. OFICINA PRO DEMO:
   Login: oficina.pro@instauto.com.br / InstaAuto2025!
   Acesso: /oficina-pro (todos os recursos)
   Trial: 5 dias restantes para demonstração

4. ADMIN DEMO:
   Login: admin.demo@instauto.com.br / InstaAuto2025!
   Acesso: /admin (painel administrativo)
   Recursos: CRUD oficinas, seed dados, relatórios

SENHAS PADRÃO: InstaAuto2025!

RESETAR DADOS:
Para limpar e recriar os dados demo, execute este script novamente.
*/

-- Comentário final
COMMENT ON TABLE profiles IS 'Usuários demo criados para testes: motorista.demo, oficina.free, oficina.pro, admin.demo';

-- ============================================================================
-- SCRIPT ADICIONAL PARA CRIAR DADOS DE TESTE REALISTAS
-- ============================================================================

-- Inserir dados de teste para o motorista demo
DO $$
DECLARE
    motorista_id UUID := '11111111-1111-1111-1111-111111111111'; -- SUBSTITUIR PELO ID REAL
BEGIN

-- Quando as tabelas de veículos existirem, adicionar:
/*
INSERT INTO vehicles (owner_id, brand, model, year, plate, created_at) VALUES
(motorista_id, 'Volkswagen', 'Gol', 2020, 'ABC-1234', NOW()),
(motorista_id, 'Honda', 'Civic', 2018, 'XYZ-5678', NOW());
*/

-- Quando as tabelas de favoritos existirem, adicionar workshops favoritos
-- Quando as tabelas de agendamentos existirem, adicionar histórico

RAISE NOTICE 'Dados adicionais serão criados quando as tabelas estiverem disponíveis';

END $$;

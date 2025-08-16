-- 🌱 DADOS INICIAIS INSTAUTO
-- Execute APÓS database-schema.sql
-- Este arquivo cria dados de exemplo para testar o sistema

-- ============================================================================
-- OFICINAS DE EXEMPLO (SÃO PAULO)
-- ============================================================================

-- Nota: Primeiro crie os usuários no Supabase Dashboard, depois execute este SQL

-- Oficina 1 - Auto Center São Paulo (FREE)
INSERT INTO profiles (id, email, name, type) VALUES 
('11111111-1111-1111-1111-111111111111', 'oficina1@exemplo.com', 'Auto Center São Paulo', 'oficina')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workshops (
    profile_id, name, description, plan_type, 
    address_street, address_number, address_neighborhood, address_city, address_state,
    latitude, longitude, phone, is_active
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Auto Center São Paulo',
    'Oficina especializada em manutenção preventiva e corretiva de veículos nacionais e importados.',
    'free',
    'Rua Augusta', '1000', 'Consolação', 'São Paulo', 'SP',
    -23.5505, -46.6333,
    '(11) 3000-1000',
    true
) ON CONFLICT (profile_id) DO NOTHING;

-- Oficina 2 - Mecânica Premium (PRO)
INSERT INTO profiles (id, email, name, type) VALUES 
('22222222-2222-2222-2222-222222222222', 'oficina2@exemplo.com', 'Mecânica Premium', 'oficina')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workshops (
    profile_id, name, description, plan_type,
    address_street, address_number, address_neighborhood, address_city, address_state,
    latitude, longitude, phone, is_active, is_trial, trial_starts_at, trial_ends_at
) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Mecânica Premium',
    'Oficina premium com tecnologia avançada e atendimento diferenciado.',
    'pro',
    'Av. Paulista', '1500', 'Bela Vista', 'São Paulo', 'SP',
    -23.5613, -46.6561,
    '(11) 3000-2000',
    true,
    true,
    NOW(),
    NOW() + INTERVAL '7 days'
) ON CONFLICT (profile_id) DO NOTHING;

-- Oficina 3 - Garage Tech (FREE)
INSERT INTO profiles (id, email, name, type) VALUES 
('33333333-3333-3333-3333-333333333333', 'oficina3@exemplo.com', 'Garage Tech', 'oficina')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workshops (
    profile_id, name, description, plan_type,
    address_street, address_number, address_neighborhood, address_city, address_state,
    latitude, longitude, phone, is_active
) VALUES (
    '33333333-3333-3333-3333-333333333333',
    'Garage Tech',
    'Especializada em diagnóstico eletrônico e reparo de sistemas modernos.',
    'free',
    'Rua da Consolação', '500', 'Centro', 'São Paulo', 'SP',
    -23.5430, -46.6395,
    '(11) 3000-3000',
    true
) ON CONFLICT (profile_id) DO NOTHING;

-- ============================================================================
-- MOTORISTAS DE EXEMPLO
-- ============================================================================

-- Motorista 1
INSERT INTO profiles (id, email, name, type) VALUES 
('44444444-4444-4444-4444-444444444444', 'motorista1@exemplo.com', 'João Silva', 'motorista')
ON CONFLICT (id) DO NOTHING;

INSERT INTO drivers (
    profile_id, cpf, license_number
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '123.456.789-00',
    'SP123456789'
) ON CONFLICT (profile_id) DO NOTHING;

-- Motorista 2
INSERT INTO profiles (id, email, name, type) VALUES 
('55555555-5555-5555-5555-555555555555', 'motorista2@exemplo.com', 'Maria Santos', 'motorista')
ON CONFLICT (id) DO NOTHING;

INSERT INTO drivers (
    profile_id, cpf, license_number
) VALUES (
    '55555555-5555-5555-5555-555555555555',
    '987.654.321-00',
    'SP987654321'
) ON CONFLICT (profile_id) DO NOTHING;

-- ============================================================================
-- AGENDAMENTOS DE EXEMPLO
-- ============================================================================

-- Agendamento 1: João na Auto Center São Paulo
INSERT INTO agendamentos (
    driver_id, workshop_id, service_type, description,
    scheduled_date, estimated_duration, estimated_price,
    status, vehicle_brand, vehicle_model, vehicle_year, vehicle_plate
) VALUES (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Troca de óleo',
    'Troca de óleo do motor e filtros',
    NOW() + INTERVAL '2 days',
    60,
    120.00,
    'agendado',
    'Toyota',
    'Corolla',
    2020,
    'ABC-1234'
) ON CONFLICT DO NOTHING;

-- Agendamento 2: Maria na Mecânica Premium
INSERT INTO agendamentos (
    driver_id, workshop_id, service_type, description,
    scheduled_date, estimated_duration, estimated_price,
    status, vehicle_brand, vehicle_model, vehicle_year, vehicle_plate
) VALUES (
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'Revisão completa',
    'Revisão dos 30.000 km',
    NOW() + INTERVAL '1 day',
    180,
    450.00,
    'confirmado',
    'Honda',
    'Civic',
    2021,
    'XYZ-5678'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- AVALIAÇÕES DE EXEMPLO
-- ============================================================================

-- Avaliação para Auto Center São Paulo
INSERT INTO avaliacoes (
    agendamento_id, driver_id, workshop_id, rating, comment
) SELECT 
    a.id,
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    5,
    'Excelente atendimento! Serviço rápido e preço justo.'
FROM agendamentos a 
WHERE a.driver_id = '44444444-4444-4444-4444-444444444444'
AND a.workshop_id = '11111111-1111-1111-1111-111111111111'
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================================================
-- ATUALIZAR ESTATÍSTICAS DAS OFICINAS
-- ============================================================================

-- Atualizar rating da Auto Center São Paulo
UPDATE workshops SET 
    rating = 5.0,
    total_reviews = 1
WHERE profile_id = '11111111-1111-1111-1111-111111111111';

-- ============================================================================
-- VERIFICAÇÕES FINAIS
-- ============================================================================

SELECT 'DADOS DE EXEMPLO CRIADOS:' as status;

SELECT 'OFICINAS:' as status;
SELECT name, plan_type, address_city FROM workshops ORDER BY name;

SELECT 'MOTORISTAS:' as status;
SELECT name, email FROM profiles WHERE type = 'motorista' ORDER BY name;

SELECT 'AGENDAMENTOS:' as status;
SELECT 
    a.service_type,
    a.status,
    p1.name as motorista,
    p2.name as oficina
FROM agendamentos a
JOIN profiles p1 ON p1.id = a.driver_id
JOIN workshops w ON w.profile_id = a.workshop_id
JOIN profiles p2 ON p2.id = w.profile_id
ORDER BY a.scheduled_date;

SELECT '✅ DADOS DE EXEMPLO CARREGADOS!' as status;

-- ============================================================================
-- INSTRUÇÕES
-- ============================================================================

/*
📋 PRÓXIMOS PASSOS:

1. ✅ Execute este script no Supabase SQL Editor
2. 🔍 Verifique os dados: npm run setup:verify  
3. 🚀 Inicie o projeto: npm run dev
4. 👤 Teste login: admin@instauto.com.br / InstaAuto@2024
5. 📊 Acesse admin: /admin para ver os dados

🎯 DADOS CRIADOS:
- 3 oficinas (1 PRO com trial, 2 FREE)
- 2 motoristas
- 2 agendamentos
- 1 avaliação

Para criar mais dados, use:
- /admin/demo-users (usuários de teste)
- /admin/seed (oficinas reais de SP/RJ)
*/

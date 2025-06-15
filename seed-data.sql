-- DADOS DE EXEMPLO PARA TESTAR O SISTEMA

-- Inserir perfis de oficinas
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'autocentro@silva.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '{"name": "Auto Centro Silva", "type": "oficina"}'),
  ('22222222-2222-2222-2222-222222222222', 'oficina@costa.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '{"name": "Oficina Costa", "type": "oficina"}'),
  ('33333333-3333-3333-3333-333333333333', 'mega@auto.com', crypt('123456', gen_salt('bf')), NOW(), NOW(), NOW(), '{"name": "MegaAuto", "type": "oficina"}');

-- Inserir profiles
INSERT INTO profiles (id, email, name, type, phone)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'autocentro@silva.com', 'Auto Centro Silva', 'oficina', '(11) 99999-0000'),
  ('22222222-2222-2222-2222-222222222222', 'oficina@costa.com', 'Oficina Costa & Cia', 'oficina', '(11) 88888-1111'),
  ('33333333-3333-3333-3333-333333333333', 'mega@auto.com', 'MegaAuto Especializada', 'oficina', '(11) 77777-2222');

-- Inserir workshops
INSERT INTO workshops (id, profile_id, business_name, address, services, specialties, rating, total_reviews, verified, opening_hours, price_range)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Auto Centro Silva',
    '{"rua": "Rua das Oficinas, 123", "bairro": "Vila Madalena", "cidade": "São Paulo", "cep": "05014-000", "lat": -23.5505, "lng": -46.6333}',
    '{"Mecânica Geral", "Elétrica Automotiva", "Funilaria e Pintura", "Troca de Óleo", "Alinhamento e Balanceamento", "Ar Condicionado"}',
    '{"Honda", "Toyota", "Ford", "Chevrolet"}',
    4.8,
    156,
    true,
    '{"segunda": "08:00 - 18:00", "sabado": "08:00 - 14:00", "domingo": "Fechado"}',
    '$$'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Oficina Costa & Cia',
    '{"rua": "Av. Principal, 456", "bairro": "Pinheiros", "cidade": "São Paulo", "cep": "05422-000", "lat": -23.5629, "lng": -46.6825}',
    '{"Revisão Preventiva", "Troca de Óleo", "Sistema de Freios", "Suspensão", "Câmbio"}',
    '{"Volkswagen", "Fiat", "Renault"}',
    4.5,
    89,
    true,
    '{"segunda": "07:00 - 17:00", "sabado": "07:00 - 12:00", "domingo": "Fechado"}',
    '$'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'MegaAuto Especializada',
    '{"rua": "Rua dos Mecânicos, 789", "bairro": "Moema", "cidade": "São Paulo", "cep": "04077-000", "lat": -23.5893, "lng": -46.6658}',
    '{"Mecânica Geral", "Diagnóstico Computadorizado", "Injeção Eletrônica", "Motor", "Transmissão", "Ar Condicionado", "Som Automotivo"}',
    '{"BMW", "Audi", "Mercedes", "Carros Importados"}',
    4.9,
    203,
    true,
    '{"segunda": "08:00 - 19:00", "sabado": "08:00 - 16:00", "domingo": "09:00 - 14:00"}',
    '$$$'
  ); 
-- =============================================
-- SETUP MERCADOPAGO - INSTAUTO V7
-- =============================================

-- 1. TABELA DE TRANSAÇÕES DE PAGAMENTO
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_reference VARCHAR(255) UNIQUE NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  plan_type VARCHAR(50) NOT NULL CHECK (plan_type IN ('free', 'pro')),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('pix', 'credit', 'boleto')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
  
  -- IDs do MercadoPago
  preference_id VARCHAR(255),
  mercadopago_id VARCHAR(255),
  mercadopago_payment_id VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para performance
  INDEX idx_payment_transactions_external_ref (external_reference),
  INDEX idx_payment_transactions_user_email (user_email),
  INDEX idx_payment_transactions_status (status),
  INDEX idx_payment_transactions_created_at (created_at DESC)
);

-- 2. ADICIONAR CAMPOS DE PLANO NA TABELA PROFILES
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(50) DEFAULT 'free' CHECK (plan_type IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS plan_activated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP WITH TIME ZONE;

-- 3. TABELA DE HISTÓRICO DE PLANOS
CREATE TABLE IF NOT EXISTS plan_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL,
  activated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  deactivated_at TIMESTAMP WITH TIME ZONE,
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  
  -- Índices
  INDEX idx_plan_history_user_id (user_id),
  INDEX idx_plan_history_activated_at (activated_at DESC)
);

-- =============================================
-- RLS POLICIES - SEGURANÇA
-- =============================================

-- Habilitar RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_history ENABLE ROW LEVEL SECURITY;

-- POLICIES PARA PAYMENT_TRANSACTIONS
-- Usuários podem ver apenas suas próprias transações
CREATE POLICY "Users can view their own transactions" ON payment_transactions
  FOR SELECT USING (
    user_email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Apenas sistema pode inserir transações (via API)
CREATE POLICY "System can insert transactions" ON payment_transactions
  FOR INSERT WITH CHECK (true);

-- Apenas sistema pode atualizar transações (via webhook)
CREATE POLICY "System can update transactions" ON payment_transactions
  FOR UPDATE USING (true);

-- POLICIES PARA PLAN_HISTORY
-- Usuários podem ver seu próprio histórico
CREATE POLICY "Users can view their own plan history" ON plan_history
  FOR SELECT USING (user_id = auth.uid());

-- Sistema pode inserir histórico
CREATE POLICY "System can insert plan history" ON plan_history
  FOR INSERT WITH CHECK (true);

-- =============================================
-- FUNÇÕES ÚTEIS
-- =============================================

-- Função para verificar se usuário tem plano ativo
CREATE OR REPLACE FUNCTION has_active_plan(user_id UUID, required_plan TEXT DEFAULT 'pro')
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id 
    AND plan_type = required_plan 
    AND (plan_expires_at IS NULL OR plan_expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter transações do usuário
CREATE OR REPLACE FUNCTION get_user_transactions(user_email TEXT)
RETURNS TABLE (
  id UUID,
  external_reference VARCHAR(255),
  plan_type VARCHAR(50),
  amount DECIMAL(10,2),
  payment_method VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.id,
    pt.external_reference,
    pt.plan_type,
    pt.amount,
    pt.payment_method,
    pt.status,
    pt.created_at
  FROM payment_transactions pt
  WHERE pt.user_email = get_user_transactions.user_email
  ORDER BY pt.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para ativar plano
CREATE OR REPLACE FUNCTION activate_user_plan(
  user_email TEXT,
  plan_type TEXT,
  duration_days INTEGER DEFAULT 30
)
RETURNS BOOLEAN AS $$
DECLARE
  user_id UUID;
  expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Buscar usuário
  SELECT id INTO user_id FROM profiles WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Calcular data de expiração
  expires_at := NOW() + (duration_days || ' days')::INTERVAL;
  
  -- Atualizar plano
  UPDATE profiles 
  SET 
    plan_type = activate_user_plan.plan_type,
    plan_activated_at = NOW(),
    plan_expires_at = expires_at
  WHERE id = user_id;
  
  -- Inserir no histórico
  INSERT INTO plan_history (user_id, plan_type, activated_at, expires_at)
  VALUES (user_id, activate_user_plan.plan_type, NOW(), expires_at);
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGERS
-- =============================================

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para estatísticas de pagamento
CREATE OR REPLACE VIEW payment_stats AS
SELECT 
  plan_type,
  payment_method,
  status,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as average_amount,
  DATE_TRUNC('day', created_at) as transaction_date
FROM payment_transactions
GROUP BY plan_type, payment_method, status, DATE_TRUNC('day', created_at)
ORDER BY transaction_date DESC;

-- View para usuários com planos ativos
CREATE OR REPLACE VIEW active_plan_users AS
SELECT 
  p.id,
  p.email,
  p.name,
  p.plan_type,
  p.plan_activated_at,
  p.plan_expires_at,
  CASE 
    WHEN p.plan_expires_at IS NULL THEN 'permanent'
    WHEN p.plan_expires_at > NOW() THEN 'active'
    ELSE 'expired'
  END as plan_status
FROM profiles p
WHERE p.plan_type != 'free'
ORDER BY p.plan_activated_at DESC;

-- =============================================
-- DADOS DE TESTE (OPCIONAL)
-- =============================================

-- Inserir transação de teste (descomente se necessário)
/*
INSERT INTO payment_transactions (
  external_reference,
  user_email,
  plan_type,
  amount,
  payment_method,
  status
) VALUES (
  'test_' || extract(epoch from now()),
  'teste@instauto.com.br',
  'pro',
  89.00,
  'pix',
  'approved'
);
*/

-- =============================================
-- VERIFICAÇÃO FINAL
-- =============================================

-- Verificar se tudo foi criado corretamente
SELECT 
  'payment_transactions' as table_name,
  COUNT(*) as row_count
FROM payment_transactions
UNION ALL
SELECT 
  'plan_history' as table_name,
  COUNT(*) as row_count
FROM plan_history;

-- Verificar colunas adicionadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('plan_type', 'plan_activated_at', 'plan_expires_at');

COMMIT;

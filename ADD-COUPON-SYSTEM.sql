-- ============================================
-- SISTEMA DE CUPONS PARA INFLUENCERS
-- ============================================

-- 1. TABELA DE CUPONS
CREATE TABLE public.cupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  influencer_name TEXT NOT NULL,
  influencer_email TEXT,
  discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  commission_percent INTEGER NOT NULL CHECK (commission_percent > 0 AND commission_percent <= 50),
  max_uses INTEGER, -- NULL = uso ilimitado
  current_uses INTEGER DEFAULT 0,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABELA DE USO DE CUPONS
CREATE TABLE public.coupon_uses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID REFERENCES public.cupons(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  workshop_id UUID REFERENCES public.workshops(id) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ATUALIZAR TABELA WORKSHOPS PARA INCLUIR CUPOM
ALTER TABLE public.workshops 
ADD COLUMN coupon_code TEXT,
ADD COLUMN discount_applied DECIMAL(10,2) DEFAULT 0,
ADD COLUMN commission_owed DECIMAL(10,2) DEFAULT 0;

-- 4. RLS PARA CUPONS
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_uses ENABLE ROW LEVEL SECURITY;

-- Admin pode gerenciar tudo
CREATE POLICY "cupons_admin_all" ON public.cupons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Usuários podem ver cupons ativos
CREATE POLICY "cupons_users_select" ON public.cupons
  FOR SELECT USING (is_active = true AND valid_until >= CURRENT_DATE);

-- Admin pode ver todos os usos
CREATE POLICY "coupon_uses_admin_all" ON public.coupon_uses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Usuários podem ver seus próprios usos
CREATE POLICY "coupon_uses_own" ON public.coupon_uses
  FOR SELECT USING (auth.uid() = user_id);

-- 5. FUNÇÃO PARA APLICAR CUPOM
CREATE OR REPLACE FUNCTION public.apply_coupon(
  p_coupon_code TEXT,
  p_user_id UUID,
  p_workshop_id UUID,
  p_original_price DECIMAL
)
RETURNS JSON AS $$
DECLARE
  v_coupon public.cupons%ROWTYPE;
  v_discount_amount DECIMAL;
  v_commission_amount DECIMAL;
  v_final_price DECIMAL;
BEGIN
  -- Buscar cupom válido
  SELECT * INTO v_coupon
  FROM public.cupons
  WHERE UPPER(code) = UPPER(p_coupon_code)
    AND is_active = true
    AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
    AND (max_uses IS NULL OR current_uses < max_uses);
  
  IF v_coupon.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Cupom inválido ou expirado'
    );
  END IF;
  
  -- Calcular desconto e comissão
  v_discount_amount := (p_original_price * v_coupon.discount_percent / 100.0);
  v_commission_amount := (p_original_price * v_coupon.commission_percent / 100.0);
  v_final_price := p_original_price - v_discount_amount;
  
  -- Registrar uso do cupom
  INSERT INTO public.coupon_uses (
    coupon_id, user_id, workshop_id, original_price, 
    discount_amount, commission_amount
  ) VALUES (
    v_coupon.id, p_user_id, p_workshop_id, p_original_price,
    v_discount_amount, v_commission_amount
  );
  
  -- Atualizar contador de usos
  UPDATE public.cupons 
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = v_coupon.id;
  
  RETURN json_build_object(
    'success', true,
    'coupon_code', v_coupon.code,
    'influencer_name', v_coupon.influencer_name,
    'discount_percent', v_coupon.discount_percent,
    'original_price', p_original_price,
    'discount_amount', v_discount_amount,
    'final_price', v_final_price,
    'commission_amount', v_commission_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. FUNÇÃO PARA RELATÓRIO DE COMISSÕES
CREATE OR REPLACE FUNCTION public.get_commission_report(
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
  influencer_name TEXT,
  influencer_email TEXT,
  coupon_code TEXT,
  total_uses BIGINT,
  total_commission DECIMAL,
  avg_commission DECIMAL,
  last_use TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.influencer_name,
    c.influencer_email,
    c.code,
    COUNT(cu.id) as total_uses,
    COALESCE(SUM(cu.commission_amount), 0) as total_commission,
    COALESCE(AVG(cu.commission_amount), 0) as avg_commission,
    MAX(cu.used_at) as last_use
  FROM public.cupons c
  LEFT JOIN public.coupon_uses cu ON cu.coupon_id = c.id
  WHERE (p_start_date IS NULL OR cu.used_at >= p_start_date)
    AND (p_end_date IS NULL OR cu.used_at <= p_end_date)
  GROUP BY c.id, c.influencer_name, c.influencer_email, c.code
  ORDER BY total_commission DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. INSERIR CUPONS DE EXEMPLO
INSERT INTO public.cupons (
  code, influencer_name, influencer_email, 
  discount_percent, commission_percent, max_uses, valid_until
) VALUES 
  ('BRUNO20', 'Bruno Silva', 'bruno@exemplo.com', 20, 10, 100, '2025-12-31'),
  ('MARIA15', 'Maria Santos', 'maria@exemplo.com', 15, 8, 50, '2025-12-31'),
  ('CARLOS25', 'Carlos Souza', 'carlos@exemplo.com', 25, 12, NULL, '2025-12-31');

SELECT 'SISTEMA DE CUPONS INSTALADO COM SUCESSO!' as status;

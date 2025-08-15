-- 📁 CONFIGURAR STORAGE SUPABASE
-- Execute no Supabase SQL Editor

-- ============================================================================
-- CRIAR BUCKET PARA AVATARS
-- ============================================================================

-- Criar bucket público para avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- POLÍTICAS DE STORAGE
-- ============================================================================

-- Política para upload de avatars (usuários podem fazer upload do próprio avatar)
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para acesso público a avatars
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;
CREATE POLICY "Public avatar access" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Política para usuários atualizarem próprio avatar
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Política para usuários deletarem próprio avatar
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- VERIFICAÇÕES
-- ============================================================================

-- Verificar bucket criado
SELECT 'BUCKET CRIADO:' as status, id, name, public
FROM storage.buckets 
WHERE id = 'avatars';

-- Verificar políticas de storage
SELECT 'POLÍTICAS STORAGE:' as status;
SELECT policyname, cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

SELECT '✅ STORAGE CONFIGURADO!' as status;

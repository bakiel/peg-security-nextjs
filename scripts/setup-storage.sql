-- =====================================================
-- STORAGE BUCKETS SETUP FOR PEG SECURITY
-- =====================================================
-- Run this in Supabase SQL Editor to create storage buckets
-- URL: https://supabase.com/dashboard/project/ujiaeiqslzwmpvkyixdp/sql/new

-- =====================================================
-- 1. CREATE STORAGE BUCKETS
-- =====================================================

-- Gallery bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Team bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('team', 'team', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Services bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('services', 'services', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- CVs bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cvs', 'cvs', false, 10485760, ARRAY[
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

-- =====================================================
-- 2. STORAGE POLICIES - PUBLIC READ ACCESS
-- =====================================================

-- Public can read gallery images
DROP POLICY IF EXISTS "Public can read gallery images" ON storage.objects;
CREATE POLICY "Public can read gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

-- Public can read team images
DROP POLICY IF EXISTS "Public can read team images" ON storage.objects;
CREATE POLICY "Public can read team images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team');

-- Public can read services images
DROP POLICY IF EXISTS "Public can read services images" ON storage.objects;
CREATE POLICY "Public can read services images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'services');

-- =====================================================
-- 3. STORAGE POLICIES - ADMIN UPLOAD ACCESS
-- =====================================================

-- Gallery: Admin upload
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Gallery: Admin update
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON storage.objects;
CREATE POLICY "Authenticated users can update gallery images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Gallery: Admin delete
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON storage.objects;
CREATE POLICY "Authenticated users can delete gallery images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- Team: Admin upload
DROP POLICY IF EXISTS "Authenticated users can upload team images" ON storage.objects;
CREATE POLICY "Authenticated users can upload team images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'team' AND auth.role() = 'authenticated');

-- Team: Admin update
DROP POLICY IF EXISTS "Authenticated users can update team images" ON storage.objects;
CREATE POLICY "Authenticated users can update team images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'team' AND auth.role() = 'authenticated');

-- Team: Admin delete
DROP POLICY IF EXISTS "Authenticated users can delete team images" ON storage.objects;
CREATE POLICY "Authenticated users can delete team images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'team' AND auth.role() = 'authenticated');

-- Services: Admin upload
DROP POLICY IF EXISTS "Authenticated users can upload services images" ON storage.objects;
CREATE POLICY "Authenticated users can upload services images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'services' AND auth.role() = 'authenticated');

-- Services: Admin update
DROP POLICY IF EXISTS "Authenticated users can update services images" ON storage.objects;
CREATE POLICY "Authenticated users can update services images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'services' AND auth.role() = 'authenticated');

-- Services: Admin delete
DROP POLICY IF EXISTS "Authenticated users can delete services images" ON storage.objects;
CREATE POLICY "Authenticated users can delete services images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'services' AND auth.role() = 'authenticated');

-- CVs: Admin upload (private bucket)
DROP POLICY IF EXISTS "Authenticated users can upload CVs" ON storage.objects;
CREATE POLICY "Authenticated users can upload CVs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cvs' AND auth.role() = 'authenticated');

-- CVs: Admin read (private bucket)
DROP POLICY IF EXISTS "Authenticated users can read CVs" ON storage.objects;
CREATE POLICY "Authenticated users can read CVs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'cvs' AND auth.role() = 'authenticated');

-- CVs: Admin delete (private bucket)
DROP POLICY IF EXISTS "Authenticated users can delete CVs" ON storage.objects;
CREATE POLICY "Authenticated users can delete CVs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cvs' AND auth.role() = 'authenticated');

-- =====================================================
-- 4. VERIFY SETUP
-- =====================================================

-- Check buckets created
SELECT
  id,
  name,
  public,
  file_size_limit / 1024 / 1024 AS size_limit_mb,
  allowed_mime_types
FROM storage.buckets
WHERE id IN ('gallery', 'team', 'services', 'cvs')
ORDER BY id;

-- Check policies created
SELECT
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
ORDER BY policyname;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Storage setup complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Created buckets:';
  RAISE NOTICE '  - gallery (public, 5MB, images)';
  RAISE NOTICE '  - team (public, 5MB, images)';
  RAISE NOTICE '  - services (public, 5MB, images)';
  RAISE NOTICE '  - cvs (private, 10MB, documents)';
  RAISE NOTICE '';
  RAISE NOTICE 'Storage policies configured for:';
  RAISE NOTICE '  - Public read access (gallery, team, services)';
  RAISE NOTICE '  - Admin upload/update/delete access (all buckets)';
  RAISE NOTICE '  - Private CV bucket (admin-only access)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Go to http://localhost:3002/admin/gallery';
  RAISE NOTICE '  2. Upload your first image';
  RAISE NOTICE '  3. View it at http://localhost:3002/gallery';
END $$;

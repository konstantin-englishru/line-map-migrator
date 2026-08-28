CREATE POLICY "cms images admin write" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(),'admin'))
WITH CHECK (bucket_id = 'cms-images' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "cms images read" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'cms-images');
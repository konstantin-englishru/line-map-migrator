ALTER TABLE public.cms_teachers
  ADD COLUMN IF NOT EXISTS subjects jsonb,
  ADD COLUMN IF NOT EXISTS ages text,
  ADD COLUMN IF NOT EXISTS achievements jsonb,
  ADD COLUMN IF NOT EXISTS badges jsonb;
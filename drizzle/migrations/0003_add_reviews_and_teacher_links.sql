ALTER TABLE public.cms_teachers ADD COLUMN IF NOT EXISTS trial_url text;
ALTER TABLE public.cms_teachers ADD COLUMN IF NOT EXISTS question_url text;
ALTER TABLE public.cms_teachers ADD COLUMN IF NOT EXISTS signup_url text;

CREATE TABLE IF NOT EXISTS public.cms_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  initial text,
  name text,
  subtitle text,
  rating integer NOT NULL DEFAULT 5,
  text text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cms_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_reviews TO authenticated;
GRANT ALL ON public.cms_reviews TO service_role;

ALTER TABLE public.cms_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews public read" ON public.cms_reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews admin write" ON public.cms_reviews FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
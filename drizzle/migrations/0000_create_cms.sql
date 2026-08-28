CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin');
  RETURN true;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE TABLE public.cms_lines (
  id text PRIMARY KEY,
  name text,
  slug text,
  description text,
  full_description text,
  image text,
  legend jsonb,
  stations jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_lines TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_lines TO authenticated;
GRANT ALL ON public.cms_lines TO service_role;
ALTER TABLE public.cms_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lines public read" ON public.cms_lines FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "lines admin write" ON public.cms_lines FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.cms_stations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id text,
  name text,
  slug text UNIQUE,
  title text,
  short_description text,
  description text,
  image text,
  audience jsonb,
  format jsonb,
  advantages jsonb,
  program jsonb,
  extra jsonb,
  button_text text,
  button_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_stations TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_stations TO authenticated;
GRANT ALL ON public.cms_stations TO service_role;
ALTER TABLE public.cms_stations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stations public read" ON public.cms_stations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "stations admin write" ON public.cms_stations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.cms_teachers (
  id text PRIMARY KEY,
  name text,
  slug text,
  image text,
  position text,
  short_description text,
  description text,
  education text,
  experience text,
  extra jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_teachers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_teachers TO authenticated;
GRANT ALL ON public.cms_teachers TO service_role;
ALTER TABLE public.cms_teachers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teachers public read" ON public.cms_teachers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "teachers admin write" ON public.cms_teachers FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.cms_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_settings TO authenticated;
GRANT ALL ON public.cms_settings TO service_role;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.cms_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "settings admin write" ON public.cms_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
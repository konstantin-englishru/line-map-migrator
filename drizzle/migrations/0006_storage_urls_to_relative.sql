DO $$
DECLARE r record; pat text := 'https?://[^"'']*?/storage/v1/object/(sign|public)/cms-images/([^"?'']+)(\?[^"'']*)?';
BEGIN
  FOR r IN
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name LIKE 'cms\_%'
      AND data_type IN ('text','character varying','jsonb')
  LOOP
    IF r.data_type = 'jsonb' THEN
      EXECUTE format(
        'UPDATE public.%I SET %I = regexp_replace(%I::text, %L, %L, ''g'')::jsonb WHERE %I::text ~ %L',
        r.table_name, r.column_name, r.column_name, pat, 'cms-images/\2', r.column_name, pat);
    ELSE
      EXECUTE format(
        'UPDATE public.%I SET %I = regexp_replace(%I, %L, %L, ''g'') WHERE %I ~ %L',
        r.table_name, r.column_name, r.column_name, pat, 'cms-images/\2', r.column_name, pat);
    END IF;
  END LOOP;
END $$;
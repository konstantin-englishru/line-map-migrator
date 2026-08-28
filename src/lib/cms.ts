import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Лёгкий слой CMS: публичные страницы продолжают рендерить свои статические данные,
 * а из базы подмешиваются только заполненные администратором поля.
 */

export type CmsTable = "cms_lines" | "cms_stations" | "cms_teachers";

const isFilled = (v: unknown) =>
  v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0);

/** Возвращает одну запись-переопределение (или null). */
export function useCmsRow<T = Record<string, unknown>>(
  table: CmsTable,
  column: string,
  value: string | undefined,
): T | null {
  const [row, setRow] = useState<T | null>(null);
  useEffect(() => {
    if (!value) return;
    let alive = true;
    void (async () => {
      const { data } = await supabase.from(table).select("*").eq(column, value).maybeSingle();
      if (alive) setRow((data as T) ?? null);
    })();
    return () => {
      alive = false;
    };
  }, [table, column, value]);
  return row;
}

/** Подмешивает заполненные поля записи в базовый объект по карте соответствия. */
export function applyOverride<B extends object>(
  base: B,
  row: Record<string, unknown> | null,
  map: Partial<Record<keyof B & string, string>>,
): B {
  if (!row) return base;
  const out = { ...base } as Record<string, unknown>;
  for (const [baseKey, rowKey] of Object.entries(map)) {
    const v = row[rowKey as string];
    if (isFilled(v)) out[baseKey] = v;
  }
  return out as B;
}

/** Настройки сайта (телефон, адрес и т.п.). */
export function useCmsSettings(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase.from("cms_settings").select("key,value");
      if (!alive || !data) return;
      const next: Record<string, string> = {};
      for (const r of data) if (r.value) next[r.key] = r.value;
      setMap(next);
    })();
    return () => {
      alive = false;
    };
  }, []);
  return map;
}

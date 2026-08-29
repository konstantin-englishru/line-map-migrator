import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Универсальный «бабл» контента (документы, контакты, статьи, фото, видео, футер). */
export type CmsBlock = {
  id: string;
  page: string;
  title: string | null;
  text: string | null;
  url: string | null;
  image: string | null;
  sort_order: number;
  is_active: boolean;
};

/** Список баблов одной страницы (общий источник данных для сайта и админки). */
export function useCmsBlocks(page: string): CmsBlock[] {
  const [rows, setRows] = useState<CmsBlock[]>([]);
  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase
        .from("cms_blocks")
        .select("*")
        .eq("page", page)
        .eq("is_active", true)
        .order("sort_order");
      if (alive) setRows((data as CmsBlock[]) ?? []);
    })();
    return () => {
      alive = false;
    };
  }, [page]);
  return rows;
}

/** Ссылка на лид-форму — единый источник для всего сайта. */
export const DEFAULT_LEAD_FORM_URL =
  "https://gorodznaniy.s20.online/common/1/form/draw?id=7&baseColor=205EDC&borderRadius=8&css=%2F%2Fcdn.alfacrm.pro%2Flead-form%2Fform.css";

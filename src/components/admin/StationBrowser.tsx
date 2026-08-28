import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { METRO_LINES } from "@/lib/lines-data";
import { buildCourse } from "@/routes/p.$slug";

/**
 * Простой редактор текста страниц станций.
 * Три поля: заголовок, описание, «Для кого этот курс».
 * Данные хранятся в cms_stations по slug и читаются шаблоном p.$slug.tsx.
 */

export function StationBrowser() {
  const [openLine, setOpenLine] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [forWhom, setForWhom] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const openProgram = async (program: string) => {
    setErr("");
    setMsg("");
    setBusy(true);
    const { data, error } = await supabase
      .from("cms_stations")
      .select("title,description,content")
      .eq("slug", program)
      .maybeSingle();
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    const preset = buildCourse(program);
    const content = (data?.content as Record<string, unknown> | null) ?? {};
    const savedForWhom = Array.isArray(content["forWhom"]) ? (content["forWhom"] as string[]) : null;
    setSlug(program);
    setTitle(data?.title || preset.h1);
    setDescription(data?.description || preset.description);
    setForWhom((savedForWhom ?? preset.forWhom).join("\n"));
    setEditing(true);
  };

  // Прямая ссылка: /admin/stations?slug=english
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("slug");
    if (q) void openProgram(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setBusy(true);
    setErr("");
    const list = forWhom.split("\n").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("cms_stations").upsert(
      {
        slug,
        name: slug,
        title,
        description,
        content: { forWhom: list, forWhomCards: null } as never,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "slug" },
    );
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setEditing(false);
    setMsg(`Сохранено. Страница /p/${slug} обновлена.`);
  };

  if (editing) {
    return (
      <>
        <h1>{slug}</h1>
        <p className="ad-mini">Страница: /p/{encodeURIComponent(slug)}</p>
        {err && <div className="ad-err">{err}</div>}
        <div className="ad-card">
          <label className="ad-field">
            <span>Заголовок страницы</span>
            <input className="ad-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="ad-field">
            <span>Описание страницы</span>
            <textarea className="ad-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="ad-field">
            <span>Для кого этот курс (по одному пункту в строке)</span>
            <textarea className="ad-textarea" rows={6} value={forWhom} onChange={(e) => setForWhom(e.target.value)} />
          </label>
        </div>
        <div className="ad-card">
          <button className="ad-btn" disabled={busy} onClick={() => void save()}>
            Сохранить
          </button>{" "}
          <button className="ad-btn ad-btn-sec" onClick={() => setEditing(false)}>
            Отмена
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Станции</h1>
      <p className="ad-mini">Выберите линию, затем станцию — откроется редактор текста её страницы.</p>
      {msg && <div className="ad-msg">{msg}</div>}
      {err && <div className="ad-err">{err}</div>}
      {METRO_LINES.map((line) => (
        <div className="ad-card" key={line.id}>
          <button
            className="ad-btn ad-btn-sec"
            onClick={() => setOpenLine(openLine === line.id ? null : line.id)}
          >
            {openLine === line.id ? "▾" : "▸"} {line.name}
          </button>
          {openLine === line.id &&
            line.stations.map((st) => (
              <div key={st.name} style={{ margin: "10px 0 0 8px" }}>
                <div className="ad-mini">{st.name}</div>
                {st.programs.map((p) => (
                  <div className="ad-row" key={p}>
                    <div>{p}</div>
                    <button className="ad-btn ad-btn-sec" disabled={busy} onClick={() => void openProgram(p)}>
                      Редактировать
                    </button>
                  </div>
                ))}
              </div>
            ))}
        </div>
      ))}
    </>
  );
}

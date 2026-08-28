import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { METRO_LINES } from "@/lib/lines-data";
import { RecordForm, type Field, type Row } from "./Crud";

/** Поля контента страницы станции (шаблон страницы не редактируется). */
const FIELDS: Field[] = [
  { key: "name", label: "Название станции", type: "text" },
  { key: "title", label: "Заголовок страницы (H1)", type: "text" },
  { key: "short_description", label: "Краткое описание (подзаголовок)", type: "textarea" },
  { key: "description", label: "Основное описание", type: "textarea" },
  { key: "image", label: "Фотография", type: "image" },
  { key: "audience", label: "Для кого этот курс", type: "list" },
  { key: "format", label: "Формат обучения", type: "list", hint: "порядок: длительность, расписание, формат, методика, преподаватель" },
  { key: "advantages", label: "Преимущества / результаты", type: "list" },
  { key: "program", label: "Программа обучения", type: "list" },
  { key: "extra", label: "Дополнительные текстовые блоки", type: "list" },
  { key: "button_text", label: "Текст основной кнопки", type: "text" },
  { key: "button_url", label: "Ссылка основной кнопки", type: "text" },
];

export function StationBrowser() {
  const [openLine, setOpenLine] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const openProgram = async (lineId: string, stationName: string, program: string) => {
    setErr("");
    setMsg("");
    setBusy(true);
    const { data, error } = await supabase.from("cms_stations").select("*").eq("slug", program).maybeSingle();
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setSlug(program);
    setEditing(
      (data as Row) ?? {
        slug: program,
        line_id: lineId,
        name: stationName,
        title: "",
        short_description: "",
        description: "",
        image: "",
        audience: [],
        format: [],
        advantages: [],
        program: [],
        extra: [],
        button_text: "",
        button_url: "",
        sort_order: 0,
        is_active: true,
      },
    );
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    setErr("");
    const payload = { ...editing, slug, updated_at: new Date().toISOString() };
    const { error } = await supabase.from("cms_stations").upsert(payload as never, { onConflict: "slug" });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setEditing(null);
    setMsg(`Сохранено. Страница «${slug}» обновлена на сайте.`);
  };

  if (editing) {
    return (
      <>
        <h1>{slug}</h1>
        <p className="ad-mini">Страница: /p/{encodeURIComponent(slug)} — заполненные поля заменяют текст на сайте, пустые оставляют текущий.</p>
        {err && <div className="ad-err">{err}</div>}
        <RecordForm
          fields={FIELDS}
          value={editing}
          onChange={setEditing}
          onSave={() => void save()}
          onCancel={() => setEditing(null)}
          busy={busy}
          onError={setErr}
        />
      </>
    );
  }

  return (
    <>
      <h1>Станции</h1>
      <p className="ad-mini">Выберите линию, затем станцию — откроется редактор её страницы.</p>
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
                    <button className="ad-btn ad-btn-sec" disabled={busy} onClick={() => void openProgram(line.id, st.name, p)}>
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

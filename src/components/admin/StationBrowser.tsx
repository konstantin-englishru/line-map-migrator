import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { METRO_LINES } from "@/lib/lines-data";
import { buildCourse, type CourseData } from "@/routes/p.$slug";

/**
 * Редактор контента существующих страниц станций.
 * Структура полей берётся из реального шаблона страницы (buildCourse по slug),
 * поэтому в админке отображаются ровно те блоки и карточки, что есть на сайте.
 */

type Draft = Record<string, unknown>;

const TEXTS: { key: keyof CourseData & string; label: string; area?: boolean }[] = [
  { key: "h1", label: "Заголовок (H1)", area: true },
  { key: "tagline", label: "Подзаголовок / бейдж" },
  { key: "description", label: "Описание", area: true },
  { key: "primaryCta", label: "Текст основной кнопки" },
  { key: "secondaryCta", label: "Текст второй кнопки" },
  { key: "heroImage", label: "Изображение (URL)" },
];

type ObjBlock = {
  key: string;
  title: string;
  titleKeys: { key: string; label: string }[];
  itemFields: { key: string; label: string; area?: boolean }[];
};

const OBJ_BLOCKS: ObjBlock[] = [
  {
    key: "forWhomCards",
    title: "Для кого этот курс",
    titleKeys: [{ key: "forWhomTitle", label: "Заголовок блока" }],
    itemFields: [
      { key: "title", label: "Заголовок карточки" },
      { key: "desc", label: "Текст карточки", area: true },
    ],
  },
  {
    key: "formatCards",
    title: "Формат обучения",
    titleKeys: [
      { key: "formatTitle", label: "Заголовок блока" },
      { key: "formatSub", label: "Подзаголовок блока" },
    ],
    itemFields: [
      { key: "title", label: "Заголовок карточки" },
      { key: "desc", label: "Текст карточки", area: true },
    ],
  },
  {
    key: "benefits",
    title: "Преимущества",
    titleKeys: [
      { key: "benefitsTitle", label: "Заголовок блока" },
      { key: "benefitsSub", label: "Подзаголовок блока" },
    ],
    itemFields: [
      { key: "title", label: "Заголовок" },
      { key: "desc", label: "Описание", area: true },
    ],
  },
  {
    key: "modules",
    title: "Программа / этапы",
    titleKeys: [
      { key: "programTitle", label: "Заголовок блока" },
      { key: "programSub", label: "Подзаголовок блока" },
    ],
    itemFields: [
      { key: "title", label: "Название этапа" },
      { key: "desc", label: "Описание этапа", area: true },
    ],
  },
  {
    key: "stats",
    title: "Цифры в шапке",
    titleKeys: [],
    itemFields: [
      { key: "value", label: "Значение" },
      { key: "label", label: "Подпись" },
    ],
  },
  {
    key: "reviews",
    title: "Отзывы",
    titleKeys: [{ key: "reviewsTitle", label: "Заголовок блока" }],
    itemFields: [
      { key: "name", label: "Имя" },
      { key: "role", label: "Роль" },
      { key: "text", label: "Текст отзыва", area: true },
    ],
  },
  {
    key: "faq",
    title: "Вопросы и ответы",
    titleKeys: [{ key: "faqTitle", label: "Заголовок блока" }],
    itemFields: [
      { key: "q", label: "Вопрос" },
      { key: "a", label: "Ответ", area: true },
    ],
  },
];

const STR_LISTS: { key: string; title: string; titleKey?: string }[] = [
  { key: "forWhom", title: "Для кого (список)", titleKey: "forWhomTitle" },
  { key: "results", title: "Результаты / преимущества (список)", titleKey: "resultsTitle" },
];

const FORMAT_FIELDS: { key: string; label: string }[] = [
  { key: "duration", label: "Длительность" },
  { key: "schedule", label: "Расписание" },
  { key: "mode", label: "Формат" },
  { key: "method", label: "Методика" },
  { key: "teacher", label: "Преподаватель" },
];

const FINAL_FIELDS: { key: string; label: string }[] = [
  { key: "finalTitle", label: "Заголовок финального блока" },
  { key: "finalSub", label: "Подзаголовок финального блока" },
  { key: "finalCta", label: "Текст финальной кнопки" },
];

function Input({
  label,
  value,
  area,
  onChange,
}: {
  label: string;
  value: string;
  area?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {area ? (
        <textarea className="ad-textarea" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="ad-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export function StationBrowser() {
  const [openLine, setOpenLine] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [lineId, setLineId] = useState<string>("");
  const [stationName, setStationName] = useState<string>("");
  const [base, setBase] = useState<CourseData | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const openProgram = async (line: string, station: string, program: string) => {
    setErr("");
    setMsg("");
    setBusy(true);
    const { data, error } = await supabase
      .from("cms_stations")
      .select("content")
      .eq("slug", program)
      .maybeSingle();
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    const preset = buildCourse(program);
    const saved = (data?.content as Draft | null) ?? {};
    setSlug(program);
    setLineId(line);
    setStationName(station);
    setBase(preset);
    setDraft({ ...(preset as unknown as Draft), ...saved });
  };

  const val = (k: string): string => {
    const v = draft?.[k];
    return typeof v === "string" ? v : "";
  };
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...(d ?? {}), [k]: v }));

  const items = (k: string): Record<string, unknown>[] =>
    Array.isArray(draft?.[k]) ? (draft?.[k] as Record<string, unknown>[]) : [];

  const setItem = (k: string, i: number, field: string, v: string) => {
    const arr = items(k).map((it, idx) => (idx === i ? { ...it, [field]: v } : it));
    set(k, arr);
  };

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setErr("");
    const { error } = await supabase.from("cms_stations").upsert(
      {
        slug,
        line_id: lineId,
        name: stationName,
        content: draft as never,
        updated_at: new Date().toISOString(),
      } as never,
      { onConflict: "slug" },
    );
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setMsg(`Сохранено. Страница «${slug}» обновлена на сайте.`);
    setDraft(null);
    setBase(null);
  };

  if (draft && base) {
    const fmt = (draft["format"] as Record<string, string> | undefined) ?? {};
    return (
      <>
        <h1>{slug}</h1>
        <p className="ad-mini">
          Страница: /p/{encodeURIComponent(slug)} — редактируются реальные блоки этой страницы.
        </p>
        {err && <div className="ad-err">{err}</div>}

        <div className="ad-card">
          <b>Основная информация</b>
          {TEXTS.map((f) => (
            <Input key={f.key} label={f.label} area={f.area} value={val(f.key)} onChange={(v) => set(f.key, v)} />
          ))}
        </div>

        {STR_LISTS.filter((b) => Array.isArray(base[b.key as keyof CourseData])).map((b) => (
          <div className="ad-card" key={b.key}>
            <b>{b.title}</b>
            {b.titleKey && (
              <Input label="Заголовок блока" value={val(b.titleKey)} onChange={(v) => set(b.titleKey!, v)} />
            )}
            {(Array.isArray(draft[b.key]) ? (draft[b.key] as string[]) : []).map((s, i) => (
              <Input
                key={i}
                label={`Пункт ${i + 1}`}
                area
                value={s}
                onChange={(v) => {
                  const arr = (draft[b.key] as string[]).map((o, idx) => (idx === i ? v : o));
                  set(b.key, arr);
                }}
              />
            ))}
          </div>
        ))}

        {OBJ_BLOCKS.filter((b) => Array.isArray(base[b.key as keyof CourseData])).map((b) => (
          <div className="ad-card" key={b.key}>
            <b>{b.title}</b>
            {b.titleKeys.map((t) => (
              <Input key={t.key} label={t.label} value={val(t.key)} onChange={(v) => set(t.key, v)} />
            ))}
            {items(b.key).map((it, i) => (
              <div className="ad-row" key={i} style={{ display: "block" }}>
                <div className="ad-mini">Карточка {i + 1}</div>
                {b.itemFields.map((f) => (
                  <Input
                    key={f.key}
                    label={f.label}
                    area={f.area}
                    value={typeof it[f.key] === "string" ? (it[f.key] as string) : ""}
                    onChange={(v) => setItem(b.key, i, f.key, v)}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}

        {!Array.isArray(base.formatCards) && (
        <div className="ad-card">
          <b>Параметры обучения</b>
          {FORMAT_FIELDS.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              value={fmt[f.key] ?? ""}
              onChange={(v) => set("format", { ...fmt, [f.key]: v })}
            />
          ))}
        </div>
        )}

        <div className="ad-card">
          <b>Финальный блок</b>
          {FINAL_FIELDS.map((f) => (
            <Input key={f.key} label={f.label} value={val(f.key)} onChange={(v) => set(f.key, v)} />
          ))}
        </div>

        <div className="ad-card">
          <button className="ad-btn" disabled={busy} onClick={() => void save()}>
            Сохранить
          </button>{" "}
          <button
            className="ad-btn ad-btn-sec"
            onClick={() => {
              setDraft(null);
              setBase(null);
            }}
          >
            Отмена
          </button>
        </div>
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
                    <button
                      className="ad-btn ad-btn-sec"
                      disabled={busy}
                      onClick={() => void openProgram(line.id, st.name, p)}
                    >
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

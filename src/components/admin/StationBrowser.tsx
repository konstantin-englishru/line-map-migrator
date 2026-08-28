import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { METRO_LINES } from "@/lib/lines-data";
import { buildCourse, type CourseData } from "@/routes/p.$slug";

/**
 * Редактор контента существующих страниц станций.
 * Структура полей берётся из реального шаблона страницы (buildCourse по slug),
 * поэтому в админке отображаются ровно те блоки и карточки, что есть на сайте.
 * Сохраняются только реально изменённые поля — остальное берётся из шаблона.
 */

type Draft = Record<string, unknown>;

const MAIN_FIELDS: { key: string; label: string; area?: boolean }[] = [
  { key: "h1", label: "Заголовок страницы", area: true },
  { key: "tagline", label: "Надпись над заголовком" },
  { key: "description", label: "Описание под заголовком", area: true },
  { key: "heroImage", label: "Главное фото (ссылка)" },
  { key: "primaryCta", label: "Надпись на кнопке записи" },
  { key: "phone", label: "Телефон" },
];

const ABOUT_FIELDS: { key: string; label: string; area?: boolean }[] = [
  { key: "aboutTitle", label: "Заголовок блока «О курсе»" },
  { key: "aboutSub", label: "Подзаголовок блока «О курсе»", area: true },
];

const FORMAT_FIELDS: { key: string; label: string }[] = [
  { key: "duration", label: "Длительность" },
  { key: "schedule", label: "Расписание" },
  { key: "mode", label: "Формат занятий" },
  { key: "method", label: "Методика" },
  { key: "teacher", label: "Преподаватель" },
];

const FINAL_FIELDS: { key: string; label: string; area?: boolean }[] = [
  { key: "finalTitle", label: "Заголовок финального блока", area: true },
  { key: "finalSub", label: "Текст финального блока", area: true },
  { key: "finalCta", label: "Надпись на финальной кнопке" },
];

/** Списки простых строк. */
const STR_LISTS: { key: string; title: string; titleKey: string; titleLabel: string; itemLabel: string }[] = [
  {
    key: "forWhom",
    title: "Для кого этот курс",
    titleKey: "forWhomTitle",
    titleLabel: "Заголовок блока",
    itemLabel: "Пункт",
  },
  {
    key: "results",
    title: "Результаты обучения",
    titleKey: "resultsTitle",
    titleLabel: "Заголовок блока",
    itemLabel: "Результат",
  },
];

type ObjBlock = {
  key: string;
  title: string;
  itemTitle: string;
  titleKeys: { key: string; label: string; area?: boolean }[];
  itemFields: { key: string; label: string; area?: boolean }[];
};

const OBJ_BLOCKS: ObjBlock[] = [
  {
    key: "forWhomCards",
    title: "Для кого этот курс (карточки)",
    itemTitle: "Карточка",
    titleKeys: [{ key: "forWhomTitle", label: "Заголовок блока" }],
    itemFields: [
      { key: "title", label: "Заголовок карточки" },
      { key: "desc", label: "Текст карточки", area: true },
    ],
  },
  {
    key: "benefits",
    title: "Преимущества",
    itemTitle: "Преимущество",
    titleKeys: [
      { key: "benefitsTitle", label: "Заголовок блока" },
      { key: "benefitsSub", label: "Подзаголовок блока", area: true },
    ],
    itemFields: [
      { key: "title", label: "Заголовок" },
      { key: "desc", label: "Описание", area: true },
    ],
  },
  {
    key: "modules",
    title: "Программа обучения",
    itemTitle: "Модуль",
    titleKeys: [
      { key: "programTitle", label: "Заголовок блока" },
      { key: "programSub", label: "Подзаголовок блока", area: true },
    ],
    itemFields: [
      { key: "title", label: "Название модуля" },
      { key: "desc", label: "Описание модуля", area: true },
    ],
  },
  {
    key: "formatCards",
    title: "Формат обучения (карточки)",
    itemTitle: "Карточка",
    titleKeys: [
      { key: "formatTitle", label: "Заголовок блока" },
      { key: "formatSub", label: "Подзаголовок блока", area: true },
    ],
    itemFields: [
      { key: "title", label: "Заголовок карточки" },
      { key: "desc", label: "Текст карточки", area: true },
    ],
  },
  {
    key: "reviews",
    title: "Отзывы родителей",
    itemTitle: "Отзыв",
    titleKeys: [{ key: "reviewsTitle", label: "Заголовок блока" }],
    itemFields: [
      { key: "name", label: "Имя" },
      { key: "role", label: "Кто это" },
      { key: "text", label: "Текст отзыва", area: true },
      { key: "avatar", label: "Аватар (эмодзи или ссылка)" },
    ],
  },
  {
    key: "faq",
    title: "Частые вопросы",
    itemTitle: "Вопрос",
    titleKeys: [{ key: "faqTitle", label: "Заголовок блока" }],
    itemFields: [
      { key: "q", label: "Вопрос" },
      { key: "a", label: "Ответ", area: true },
    ],
  },
];

/** Поля, которые админка вправе сохранять в CMS. */
const MANAGED_KEYS = [
  ...MAIN_FIELDS.map((f) => f.key),
  ...ABOUT_FIELDS.map((f) => f.key),
  ...FINAL_FIELDS.map((f) => f.key),
  ...STR_LISTS.flatMap((b) => [b.key, b.titleKey]),
  ...OBJ_BLOCKS.flatMap((b) => [b.key, ...b.titleKeys.map((t) => t.key)]),
  "format",
  "formatTitle",
  "formatSub",
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

function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = arr.slice();
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}

function ItemTools({
  index,
  total,
  onUp,
  onDown,
  onRemove,
}: {
  index: number;
  total: number;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  return (
    <span style={{ display: "inline-flex", gap: 6 }}>
      <button className="ad-btn ad-btn-sec" disabled={index === 0} onClick={onUp} title="Переместить вверх">
        ↑
      </button>
      <button
        className="ad-btn ad-btn-sec"
        disabled={index === total - 1}
        onClick={onDown}
        title="Переместить вниз"
      >
        ↓
      </button>
      <button className="ad-btn ad-btn-sec" onClick={onRemove} title="Удалить">
        Удалить
      </button>
    </span>
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

  // Прямая ссылка на редактор конкретной страницы: /admin/stations?slug=english
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("slug");
    if (q) void openProgram("", "", q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const val = (k: string): string => {
    const v = draft?.[k];
    return typeof v === "string" ? v : "";
  };
  const set = (k: string, v: unknown) => setDraft((d) => ({ ...(d ?? {}), [k]: v }));

  const strList = (k: string): string[] => (Array.isArray(draft?.[k]) ? (draft?.[k] as string[]) : []);
  const items = (k: string): Record<string, unknown>[] =>
    Array.isArray(draft?.[k]) ? (draft?.[k] as Record<string, unknown>[]) : [];

  const setItem = (k: string, i: number, field: string, v: string) => {
    set(k, items(k).map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));
  };

  const save = async () => {
    if (!draft || !base) return;
    setBusy(true);
    setErr("");
    const baseObj = base as unknown as Record<string, unknown>;
    const payload: Draft = {};
    for (const k of MANAGED_KEYS) {
      const v = draft[k];
      if (v === undefined) continue;
      if (JSON.stringify(v) === JSON.stringify(baseObj[k])) continue;
      payload[k] = v;
    }
    // Список «Для кого» отменяет карточки, если администратор редактировал именно список.
    if (payload["forWhom"] && !Array.isArray(baseObj["forWhomCards"])) {
      payload["forWhomCards"] = null;
    }
    const { error } = await supabase.from("cms_stations").upsert(
      {
        slug,
        ...(lineId ? { line_id: lineId } : {}),
        ...(stationName ? { name: stationName } : {}),
        content: payload as never,
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
    const baseObj = base as unknown as Record<string, unknown>;
    return (
      <>
        <h1>{slug}</h1>
        <p className="ad-mini">
          Страница: /p/{encodeURIComponent(slug)} — редактируются реальные блоки этой страницы.
        </p>
        {err && <div className="ad-err">{err}</div>}

        <div className="ad-card">
          <b>Основная информация</b>
          {MAIN_FIELDS.map((f) => (
            <Input key={f.key} label={f.label} area={f.area} value={val(f.key)} onChange={(v) => set(f.key, v)} />
          ))}
        </div>

        <div className="ad-card">
          <b>О курсе</b>
          {ABOUT_FIELDS.map((f) => (
            <Input key={f.key} label={f.label} area={f.area} value={val(f.key)} onChange={(v) => set(f.key, v)} />
          ))}
        </div>

        {STR_LISTS.filter((b) => Array.isArray(baseObj[b.key])).map((b) => {
          const list = strList(b.key);
          return (
            <div className="ad-card" key={b.key}>
              <b>{b.title}</b>
              <Input label={b.titleLabel} value={val(b.titleKey)} onChange={(v) => set(b.titleKey, v)} />
              {list.map((s, i) => (
                <div key={i} style={{ marginTop: 10 }}>
                  <div className="ad-row">
                    <div className="ad-mini">
                      {b.itemLabel} {i + 1}
                    </div>
                    <ItemTools
                      index={i}
                      total={list.length}
                      onUp={() => set(b.key, move(list, i, i - 1))}
                      onDown={() => set(b.key, move(list, i, i + 1))}
                      onRemove={() => set(b.key, list.filter((_, idx) => idx !== i))}
                    />
                  </div>
                  <Input
                    label=""
                    area
                    value={s}
                    onChange={(v) => set(b.key, list.map((o, idx) => (idx === i ? v : o)))}
                  />
                </div>
              ))}
              <button className="ad-btn ad-btn-sec" onClick={() => set(b.key, [...list, ""])}>
                + Добавить
              </button>
            </div>
          );
        })}

        {OBJ_BLOCKS.filter((b) => Array.isArray(baseObj[b.key])).map((b) => {
          const list = items(b.key);
          return (
            <div className="ad-card" key={b.key}>
              <b>{b.title}</b>
              {b.titleKeys.map((t) => (
                <Input
                  key={t.key}
                  label={t.label}
                  area={t.area}
                  value={val(t.key)}
                  onChange={(v) => set(t.key, v)}
                />
              ))}
              {list.map((it, i) => (
                <div key={i} style={{ marginTop: 12, borderTop: "1px solid #eee", paddingTop: 10 }}>
                  <div className="ad-row">
                    <div className="ad-mini">
                      {b.itemTitle} {i + 1}
                    </div>
                    <ItemTools
                      index={i}
                      total={list.length}
                      onUp={() => set(b.key, move(list, i, i - 1))}
                      onDown={() => set(b.key, move(list, i, i + 1))}
                      onRemove={() => set(b.key, list.filter((_, idx) => idx !== i))}
                    />
                  </div>
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
              <button
                className="ad-btn ad-btn-sec"
                style={{ marginTop: 10 }}
                onClick={() => {
                  const template = (list[0] ?? {}) as Record<string, unknown>;
                  const fresh: Record<string, unknown> = { ...template };
                  for (const f of b.itemFields) fresh[f.key] = "";
                  set(b.key, [...list, fresh]);
                }}
              >
                + Добавить
              </button>
            </div>
          );
        })}

        <div className="ad-card">
          <b>Формат обучения</b>
          <Input label="Заголовок блока" value={val("formatTitle")} onChange={(v) => set("formatTitle", v)} />
          <Input
            label="Подзаголовок блока"
            area
            value={val("formatSub")}
            onChange={(v) => set("formatSub", v)}
          />
          {FORMAT_FIELDS.map((f) => (
            <Input
              key={f.key}
              label={f.label}
              value={fmt[f.key] ?? ""}
              onChange={(v) => set("format", { ...fmt, [f.key]: v })}
            />
          ))}
        </div>

        <div className="ad-card">
          <b>Финальный блок</b>
          {FINAL_FIELDS.map((f) => (
            <Input key={f.key} label={f.label} area={f.area} value={val(f.key)} onChange={(v) => set(f.key, v)} />
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

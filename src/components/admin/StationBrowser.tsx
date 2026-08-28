import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { METRO_LINES } from "@/lib/lines-data";
import { buildCourse } from "@/routes/p.$slug";

/**
 * Простой редактор текстов страниц станций.
 * Данные хранятся в cms_stations по slug и читаются шаблоном p.$slug.tsx.
 * Пустые поля не сохраняются — страница показывает значение по умолчанию.
 */

type Pair = { title: string; desc: string };

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  const tmp = next[i]!;
  next[i] = next[j]!;
  next[j] = tmp;
  return next;
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="ad-field">
      <span>{label}</span>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <input
            className="ad-input"
            style={{ flex: 1 }}
            value={it}
            onChange={(e) => {
              const next = items.slice();
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button className="ad-btn ad-btn-sec" onClick={() => onChange(move(items, i, -1))}>↑</button>
          <button className="ad-btn ad-btn-sec" onClick={() => onChange(move(items, i, 1))}>↓</button>
          <button className="ad-btn ad-btn-sec" onClick={() => onChange(items.filter((_, k) => k !== i))}>✕</button>
        </div>
      ))}
      <button className="ad-btn ad-btn-sec" onClick={() => onChange([...items, ""])}>+ Добавить</button>
    </div>
  );
}

function PairEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Pair[];
  onChange: (v: Pair[]) => void;
}) {
  return (
    <div className="ad-field">
      <span>{label}</span>
      {items.map((it, i) => (
        <div key={i} style={{ border: "1px solid #eee", borderRadius: 8, padding: 8, marginBottom: 8 }}>
          <input
            className="ad-input"
            placeholder="Заголовок"
            value={it.title}
            onChange={(e) => {
              const next = items.slice();
              next[i] = { ...it, title: e.target.value };
              onChange(next);
            }}
          />
          <textarea
            className="ad-textarea"
            placeholder="Описание"
            value={it.desc}
            onChange={(e) => {
              const next = items.slice();
              next[i] = { ...it, desc: e.target.value };
              onChange(next);
            }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <button className="ad-btn ad-btn-sec" onClick={() => onChange(move(items, i, -1))}>↑</button>
            <button className="ad-btn ad-btn-sec" onClick={() => onChange(move(items, i, 1))}>↓</button>
            <button className="ad-btn ad-btn-sec" onClick={() => onChange(items.filter((_, k) => k !== i))}>✕</button>
          </div>
        </div>
      ))}
      <button className="ad-btn ad-btn-sec" onClick={() => onChange([...items, { title: "", desc: "" }])}>
        + Добавить
      </button>
    </div>
  );
}

/** Storage-ключ должен быть ASCII: slug может быть кириллицей, поэтому кодируем безопасно. */
function slugKey(slug: string): string {
  const ascii = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return `${ascii || "station"}-${h.toString(36)}`;
}

async function uploadStationImage(slug: string, file: File): Promise<string> {
  if (!slug) throw new Error("Не выбрана станция (пустой slug)");
  if (!file) throw new Error("Файл не выбран");
  const extRaw = (file.name.split(".").pop() ?? "").toLowerCase();
  const ext = /^[a-z0-9]{1,5}$/.test(extRaw) ? extRaw : "jpg";
  const path = `stations/${slugKey(slug)}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("cms-images")
    .upload(path, file, { upsert: true, contentType: file.type || undefined });
  if (error) throw new Error(`Загрузка не удалась (${path}): ${error.message}`);
  const { data, error: signErr } = await supabase.storage
    .from("cms-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr || !data?.signedUrl) throw new Error(`Ссылка не создана: ${signErr?.message ?? "пусто"}`);
  return data.signedUrl;
}

function ImageField({
  label,
  slug,
  value,
  fallback,
  onChange,
  onError,
}: {
  label: string;
  slug: string;
  value: string;
  fallback: string;
  onChange: (v: string) => void;
  onError: (m: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const shown = value || fallback;
  return (
    <div className="ad-field">
      <span>{label}</span>
      {shown ? (
        <img
          src={shown}
          alt=""
          style={{ maxWidth: 320, width: "100%", borderRadius: 10, display: "block", marginBottom: 8 }}
        />
      ) : (
        <div className="ad-mini">Фото нет</div>
      )}
      <div className="ad-mini" style={{ marginBottom: 6 }}>
        {value ? "Загружено через админку" : "Изображение по умолчанию"}
      </div>
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try {
            const url = await uploadStationImage(slug, f);
            onChange(url);
          } catch (x) {
            onError(x instanceof Error ? x.message : String(x));
          }
          setBusy(false);
          e.target.value = "";
        }}
      />
      {value && (
        <button className="ad-btn ad-btn-sec" style={{ marginTop: 8 }} onClick={() => onChange("")}>
          Удалить фото (вернуть исходное)
        </button>
      )}
    </div>
  );
}

export function StationBrowser() {
  const [openLine, setOpenLine] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [forWhom, setForWhom] = useState("");
  const [primaryCta, setPrimaryCta] = useState("");
  const [phone, setPhone] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSub, setAboutSub] = useState("");
  const [resultsTitle, setResultsTitle] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [benefitsTitle, setBenefitsTitle] = useState("");
  const [benefitsSub, setBenefitsSub] = useState("");
  const [benefits, setBenefits] = useState<Pair[]>([]);
  const [programTitle, setProgramTitle] = useState("");
  const [programSub, setProgramSub] = useState("");
  const [modules, setModules] = useState<Pair[]>([]);
  const [formatTitle, setFormatTitle] = useState("");
  const [formatSub, setFormatSub] = useState("");
  const [duration, setDuration] = useState("");
  const [schedule, setSchedule] = useState("");
  const [mode, setMode] = useState("");
  const [method, setMethod] = useState("");
  const [teacher, setTeacher] = useState("");
  const [finalTitle, setFinalTitle] = useState("");
  const [finalSub, setFinalSub] = useState("");
  const [finalCta, setFinalCta] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [visualImage, setVisualImage] = useState("");
  const [heroFallback, setHeroFallback] = useState("");
  const [visualFallback, setVisualFallback] = useState("");
  const [hasVisual, setHasVisual] = useState(false);
  // Исходные значения формата (чтобы понять, менял ли админ эти поля)
  const [baseFormat, setBaseFormat] = useState({ duration: "", schedule: "", mode: "", method: "", teacher: "" });
  const [hadFormatCards, setHadFormatCards] = useState(false);
  const [baseBenefits, setBaseBenefits] = useState<Record<string, unknown>[]>([]);
  const [baseModules, setBaseModules] = useState<Record<string, unknown>[]>([]);

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
    const c = (data?.content as Record<string, unknown> | null) ?? {};
    const s = (k: string, fb?: string) => (typeof c[k] === "string" ? (c[k] as string) : (fb ?? ""));
    const arr = (k: string): unknown[] | null => (Array.isArray(c[k]) ? (c[k] as unknown[]) : null);

    setSlug(program);
    setTitle(data?.title ?? preset.h1 ?? "");
    setDescription(data?.description ?? preset.description ?? "");
    setForWhom(((arr("forWhom") as string[] | null) ?? preset.forWhom).join("\n"));
    setPrimaryCta(s("primaryCta", preset.primaryCta));
    setPhone(s("phone", preset.phone ?? ""));
    setAboutTitle(s("aboutTitle", preset.aboutTitle ?? ""));
    setAboutSub(s("aboutSub", preset.aboutSub ?? ""));
    setResultsTitle(s("resultsTitle", preset.resultsTitle ?? ""));
    setResults(((arr("results") as string[] | null) ?? preset.results ?? []).slice());
    setBenefitsTitle(s("benefitsTitle", preset.benefitsTitle ?? ""));
    setBenefitsSub(s("benefitsSub", preset.benefitsSub ?? ""));
    const bSrc = ((arr("benefits") as Record<string, unknown>[] | null) ??
      (preset.benefits as unknown as Record<string, unknown>[]) ?? []);
    setBaseBenefits(bSrc);
    setBenefits(bSrc.map((b) => ({ title: String(b["title"] ?? ""), desc: String(b["desc"] ?? "") })));
    setProgramTitle(s("programTitle", preset.programTitle ?? ""));
    setProgramSub(s("programSub", preset.programSub ?? ""));
    const mSrc = ((arr("modules") as Record<string, unknown>[] | null) ??
      (preset.modules as unknown as Record<string, unknown>[]) ?? []);
    setBaseModules(mSrc);
    setModules(mSrc.map((m) => ({ title: String(m["title"] ?? ""), desc: String(m["desc"] ?? "") })));
    setFormatTitle(s("formatTitle", preset.formatTitle ?? ""));
    setFormatSub(s("formatSub", preset.formatSub ?? ""));
    const cf = (c["format"] as Record<string, string> | undefined) ?? undefined;
    const f = { ...preset.format, ...(cf ?? {}) };
    setDuration(f.duration ?? "");
    setSchedule(f.schedule ?? "");
    setMode(f.mode ?? "");
    setMethod(f.method ?? "");
    setTeacher(f.teacher ?? "");
    setBaseFormat({
      duration: f.duration ?? "",
      schedule: f.schedule ?? "",
      mode: f.mode ?? "",
      method: f.method ?? "",
      teacher: f.teacher ?? "",
    });
    setHadFormatCards(Boolean(preset.formatCards) && c["formatCards"] !== null);
    setFinalTitle(s("finalTitle", preset.finalTitle ?? ""));
    setFinalSub(s("finalSub", preset.finalSub ?? ""));
    setFinalCta(s("finalCta", preset.finalCta ?? ""));
    setHeroFallback(preset.heroImage ?? "");
    setVisualFallback(preset.visual?.image ?? "");
    setHasVisual(Boolean(preset.visual));
    setHeroImage(typeof c["heroImage"] === "string" ? (c["heroImage"] as string) : "");
    setVisualImage(typeof c["visualImage"] === "string" ? (c["visualImage"] as string) : "");
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
    const list = forWhom.split("\n").map((x) => x.trim()).filter(Boolean);
    const fmt = { duration, schedule, mode, method, teacher };
    const formatChanged = (Object.keys(fmt) as (keyof typeof fmt)[]).some(
      (k) => fmt[k] !== baseFormat[k],
    );

    const content: Record<string, unknown> = {
      // Дублируем заголовок/описание в content: у части станций старые записи
      // уже содержат h1/title/description, которые перекрывают колонки таблицы.
      h1: title,
      title,
      description,
      forWhom: list,
      forWhomCards: null,
      primaryCta,
      phone,
      aboutTitle,
      aboutSub,
      resultsTitle,
      results: results.map((r) => r.trim()).filter(Boolean),
      benefitsTitle,
      benefitsSub,
      benefits: benefits
        .filter((b) => b.title.trim() || b.desc.trim())
        .map((b, i) => ({ ...(baseBenefits[i] ?? {}), title: b.title, desc: b.desc })),
      programTitle,
      programSub,
      modules: modules
        .filter((m) => m.title.trim() || m.desc.trim())
        .map((m, i) => ({ icon: String(i + 1), ...(baseModules[i] ?? {}), title: m.title, desc: m.desc })),
      formatTitle,
      formatSub,
      format: fmt,
      finalTitle,
      finalSub,
      finalCta,
      heroImage,
      visualImage,
    };
    if (formatChanged && hadFormatCards) content["formatCards"] = null;

    const { error } = await supabase.from("cms_stations").upsert(
      {
        slug,
        name: slug,
        title,
        description,
        content: content as never,
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

  const field = (label: string, value: string, set: (v: string) => void, area = false) => (
    <label className="ad-field" key={label}>
      <span>{label}</span>
      {area ? (
        <textarea className="ad-textarea" value={value} onChange={(e) => set(e.target.value)} />
      ) : (
        <input className="ad-input" value={value} onChange={(e) => set(e.target.value)} />
      )}
    </label>
  );

  if (editing) {
    return (
      <>
        <h1>{slug}</h1>
        <p className="ad-mini">Страница: /p/{encodeURIComponent(slug)}</p>
        {err && <div className="ad-err">{err}</div>}

        <div className="ad-card">
          <h2>Основное</h2>
          {field("Заголовок страницы", title, setTitle)}
          {field("Описание страницы", description, setDescription, true)}
          <label className="ad-field">
            <span>Для кого этот курс (по одному пункту в строке)</span>
            <textarea className="ad-textarea" rows={6} value={forWhom} onChange={(e) => setForWhom(e.target.value)} />
          </label>
          {field("Текст основной кнопки (Hero)", primaryCta, setPrimaryCta)}
          {field("Телефон", phone, setPhone)}
        </div>

        <div className="ad-card">
          <h2>О курсе</h2>
          {field("Заголовок блока", aboutTitle, setAboutTitle, true)}
          {field("Подзаголовок / текст", aboutSub, setAboutSub, true)}
        </div>

        <div className="ad-card">
          <h2>Результаты</h2>
          {field("Заголовок блока", resultsTitle, setResultsTitle)}
          <ListEditor label="Пункты результатов" items={results} onChange={setResults} />
        </div>

        <div className="ad-card">
          <h2>Преимущества</h2>
          {field("Заголовок", benefitsTitle, setBenefitsTitle, true)}
          {field("Подзаголовок", benefitsSub, setBenefitsSub, true)}
          <PairEditor label="Преимущества" items={benefits} onChange={setBenefits} />
        </div>

        <div className="ad-card">
          <h2>Программа обучения</h2>
          {field("Заголовок", programTitle, setProgramTitle, true)}
          {field("Подзаголовок", programSub, setProgramSub, true)}
          <PairEditor label="Модули" items={modules} onChange={setModules} />
        </div>

        <div className="ad-card">
          <h2>Формат обучения</h2>
          {field("Заголовок", formatTitle, setFormatTitle)}
          {field("Подзаголовок", formatSub, setFormatSub, true)}
          {field("Длительность", duration, setDuration)}
          {field("Расписание", schedule, setSchedule)}
          {field("Формат", mode, setMode)}
          {field("Методика", method, setMethod)}
          {field("Преподаватели", teacher, setTeacher)}
        </div>

        <div className="ad-card">
          <h2>Финальный блок</h2>
          {field("Заголовок", finalTitle, setFinalTitle, true)}
          {field("Подзаголовок", finalSub, setFinalSub, true)}
          {field("Текст кнопки", finalCta, setFinalCta)}
        </div>

        <div className="ad-card">
          <h2>Фотографии</h2>
          <ImageField
            label="Главное фото (Hero)"
            slug={slug}
            value={heroImage}
            fallback={heroFallback}
            onChange={setHeroImage}
            onError={setErr}
          />
          {hasVisual && (
            <ImageField
              label="Фото в блоке «О курсе»"
              slug={slug}
              value={visualImage}
              fallback={visualFallback}
              onChange={setVisualImage}
              onError={setErr}
            />
          )}
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

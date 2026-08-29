import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FieldType = "text" | "textarea" | "number" | "bool" | "list" | "image";
export type Field = { key: string; label: string; type: FieldType; hint?: string };
export type Row = Record<string, unknown>;

async function uploadImage(file: File): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/[^\w.\-]+/g, "_")}`;
  const { error } = await supabase.storage.from("cms-images").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = await supabase.storage.from("cms-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  return data?.signedUrl ?? "";
}

function ListEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const set = (i: number, v: string) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i: number, d: number) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div>
      {value.map((v, i) => (
        <div className="ad-list-item" key={i}>
          <textarea className="ad-textarea" value={v} onChange={(e) => set(i, e.target.value)} />
          <button type="button" className="ad-btn ad-btn-sec" onClick={() => move(i, -1)}>↑</button>
          <button type="button" className="ad-btn ad-btn-sec" onClick={() => move(i, 1)}>↓</button>
          <button type="button" className="ad-btn ad-btn-del" onClick={() => onChange(value.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" className="ad-btn ad-btn-sec" onClick={() => onChange([...value, ""])}>+ Добавить пункт</button>
    </div>
  );
}

/** Форма редактирования одной записи (используется и в списках, и в разделе «Станции»). */
export function RecordForm({
  fields,
  value,
  onChange,
  onSave,
  onCancel,
  busy,
  onError,
}: {
  fields: Field[];
  value: Row;
  onChange: (v: Row) => void;
  onSave: () => void;
  onCancel: () => void;
  busy?: boolean;
  onError?: (m: string) => void;
}) {
  const set = (k: string, v: unknown) => onChange({ ...value, [k]: v });
  return (
    <div className="ad-card">
      {fields.map((f) => {
        const v = value[f.key];
        return (
          <label className="ad-field" key={f.key}>
            <span>{f.label}{f.hint ? ` — ${f.hint}` : ""}</span>
            {f.type === "textarea" && (
              <textarea className="ad-textarea" value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            )}
            {f.type === "text" && (
              <input className="ad-input" value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            )}
            {f.type === "number" && (
              <input className="ad-input" type="number" value={(v as number) ?? 0} onChange={(e) => set(f.key, Number(e.target.value))} />
            )}
            {f.type === "bool" && (
              <input type="checkbox" checked={v !== false} onChange={(e) => set(f.key, e.target.checked)} />
            )}
            {f.type === "list" && (
              <ListEditor value={Array.isArray(v) ? (v as string[]) : []} onChange={(nv) => set(f.key, nv)} />
            )}
            {f.type === "image" && (
              <div>
                <input className="ad-input" value={(v as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      set(f.key, await uploadImage(file));
                    } catch (ex) {
                      onError?.(String((ex as Error).message ?? ex));
                    }
                  }}
                />
                {typeof v === "string" && v && <img src={v} alt="" className="ad-thumb" />}
              </div>
            )}
          </label>
        );
      })}
      <button className="ad-btn" disabled={busy} onClick={onSave}>Сохранить</button>{" "}
      <button className="ad-btn ad-btn-sec" onClick={onCancel}>Отмена</button>
    </div>
  );
}


export function Crud({
  table,
  title,
  fields,
  idField,
  labelField,
}: {
  table: "cms_lines" | "cms_stations" | "cms_teachers" | "cms_reviews";
  title: string;
  fields: Field[];
  idField: string;
  labelField: string;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from(table).select("*").order("sort_order").order(labelField);
    if (error) setErr(error.message);
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    setErr("");
    setMsg("");
    const payload: Row = { ...editing, updated_at: new Date().toISOString() };
    // Новая запись с автогенерируемым id (uuid) — не отправляем пустой идентификатор
    if (payload[idField] === "" || payload[idField] === undefined || payload[idField] === null) delete payload[idField];
    const { error } = payload[idField] === undefined
      ? await supabase.from(table).insert(payload as never)
      : await supabase.from(table).upsert(payload as never, { onConflict: idField });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    setMsg("Сохранено. Изменения уже видны на сайте.");
    setEditing(null);
    void load();
  };

  const remove = async (row: Row) => {
    if (!confirm("Удалить запись?")) return;
    await supabase.from(table).delete().eq(idField, row[idField] as string);
    void load();
  };

  if (editing) {
    return (
      <>
        <h1>{title}</h1>
        {err && <div className="ad-err">{err}</div>}
        <RecordForm
          fields={fields}
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
      <h1>{title}</h1>
      {msg && <div className="ad-msg">{msg}</div>}
      {err && <div className="ad-err">{err}</div>}
      <div className="ad-card">
        {rows.length === 0 && <p className="ad-mini">Пока нет записей.</p>}
        {rows.map((r) => (
          <div className="ad-row" key={String(r[idField])}>
            <div>
              <b>{String(r[labelField] ?? r[idField])}</b>{" "}
              {r["is_active"] === false && <span className="ad-mini">(скрыто)</span>}
              <div className="ad-mini">{String(r[idField])}</div>
            </div>
            <div>
              <button className="ad-btn ad-btn-sec" onClick={() => setEditing(r)}>Редактировать</button>{" "}
              <button className="ad-btn ad-btn-del" onClick={() => void remove(r)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="ad-btn"
        onClick={() => {
          const blank: Row = { sort_order: rows.length, is_active: true };
          for (const f of fields) if (!(f.key in blank)) blank[f.key] = f.type === "list" ? [] : "";
          setEditing(blank);
        }}
      >
        + Добавить
      </button>
    </>
  );
}

export function SettingsEditor({ groups }: { groups: { title: string; keys: { key: string; label: string; type?: FieldType }[] }[] }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("cms_settings").select("key,value");
      const next: Record<string, string> = {};
      for (const r of data ?? []) next[r.key] = r.value ?? "";
      setValues(next);
    })();
  }, []);

  const save = async () => {
    setBusy(true);
    setErr("");
    setMsg("");
    const payload = Object.entries(values).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
    const { error } = await supabase.from("cms_settings").upsert(payload, { onConflict: "key" });
    setBusy(false);
    if (error) setErr(error.message);
    else setMsg("Сохранено.");
  };

  return (
    <>
      {msg && <div className="ad-msg">{msg}</div>}
      {err && <div className="ad-err">{err}</div>}
      {groups.map((g) => (
        <div className="ad-card" key={g.title}>
          <h2>{g.title}</h2>
          {g.keys.map((k) => (
            <label className="ad-field" key={k.key}>
              <span>{k.label}</span>
              {k.type === "textarea" ? (
                <textarea
                  className="ad-textarea"
                  value={values[k.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [k.key]: e.target.value })}
                />
              ) : k.type === "image" ? (
                <div>
                  <input
                    className="ad-input"
                    value={values[k.key] ?? ""}
                    onChange={(e) => setValues({ ...values, [k.key]: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setValues((prev) => ({ ...prev, [k.key]: "" }));
                        const url = await uploadImage(file);
                        setValues((prev) => ({ ...prev, [k.key]: url }));
                      } catch (ex) {
                        setErr(String((ex as Error).message ?? ex));
                      }
                    }}
                  />
                  {values[k.key] && <img src={values[k.key]} alt="" className="ad-thumb" />}
                </div>
              ) : (
                <input
                  className="ad-input"
                  value={values[k.key] ?? ""}
                  onChange={(e) => setValues({ ...values, [k.key]: e.target.value })}
                />
              )}
            </label>
          ))}
        </div>
      ))}
      <button className="ad-btn" disabled={busy} onClick={() => void save()}>Сохранить</button>
    </>
  );
}

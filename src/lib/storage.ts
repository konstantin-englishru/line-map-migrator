import { supabase } from "@/integrations/supabase/client";

/**
 * В базе хранятся ОТНОСИТЕЛЬНЫЕ пути к файлам в storage: `cms-images/<path>`.
 * Ссылки для показа создаются на лету (бакет приватный).
 */
export const BUCKET = "cms-images";

const REL = /^cms-images\/(.+)$/;
const ABS = /^https?:\/\/[^"\s]*\/storage\/v1\/object\/(?:sign|public)\/cms-images\/([^?"\s]+)/;

/** Приводит любое значение к относительному виду `cms-images/<path>`. */
export function toRelativeStoragePath(v: string): string {
  const m = ABS.exec(v);
  if (m) return `cms-images/${decodeURIComponent(m[1])}`;
  return v;
}

function collect(node: unknown, out: Set<string>): void {
  if (typeof node === "string") {
    const rel = toRelativeStoragePath(node);
    const m = REL.exec(rel);
    if (m) out.add(m[1]);
    return;
  }
  if (Array.isArray(node)) return node.forEach((n) => collect(n, out));
  if (node && typeof node === "object") Object.values(node).forEach((n) => collect(n, out));
}

function replace<T>(node: T, map: Map<string, string>): T {
  if (typeof node === "string") {
    const rel = toRelativeStoragePath(node);
    const m = REL.exec(rel);
    return (m ? (map.get(m[1]) ?? node) : node) as T;
  }
  if (Array.isArray(node)) return node.map((n) => replace(n, map)) as unknown as T;
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) out[k] = replace(v, map);
    return out as T;
  }
  return node;
}

/** Заменяет относительные пути storage на рабочие подписанные ссылки. */
export async function resolveStorageUrls<T>(data: T): Promise<T> {
  const paths = new Set<string>();
  collect(data, paths);
  if (paths.size === 0) return data;
  const list = [...paths];
  const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrls(list, 60 * 60 * 24);
  const map = new Map<string, string>();
  signed?.forEach((s, i) => {
    if (s.signedUrl) map.set(list[i], s.signedUrl);
  });
  return replace(data, map);
}

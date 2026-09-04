import { createFileRoute } from "@tanstack/react-router";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-export-key",
};

async function listRecursive(
  supabaseAdmin: {
    storage: {
      from: (bucket: string) => {
        list: (
          prefix: string,
          options: { limit: number }
        ) => Promise<{ data: Array<{ id: string | null; name: string }> | null; error: Error | null }>;
      };
    };
  },
  bucket: string,
  prefix: string
): Promise<string[]> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .list(prefix, { limit: 1000 });

  if (error) throw error;
  if (!data) return [];

  const files: string[] = [];

  for (const item of data) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

    if (!item.id) {
      const nested = await listRecursive(supabaseAdmin, bucket, fullPath);
      files.push(...nested);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handle(request: Request): Promise<Response> {
  // Verify export key
  const exportKey = request.headers.get("x-export-key");
  const expectedKey = process.env["STORAGE_EXPORT_KEY"];
  if (!expectedKey || exportKey !== expectedKey) {
    return json({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const bucket = url.searchParams.get("bucket");

  if (!action || !bucket) {
    return json({ error: "Missing action or bucket" }, 400);
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    if (action === "list") {
      const prefix = url.searchParams.get("prefix") || "";
      const files = await listRecursive(supabaseAdmin, bucket, prefix);
      return json(files);
    }

    if (action === "download") {
      const path = url.searchParams.get("path");
      if (!path) {
        return json({ error: "Missing path" }, 400);
      }

      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .download(path);

      if (error) {
        return json({ error: error.message }, 500);
      }

      return new Response(data, {
        headers: {
          ...corsHeaders,
          "Content-Type": data.type || "application/octet-stream",
        },
      });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
}

export const Route = createFileRoute("/api/public/storage-export")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { headers: corsHeaders }),
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
});

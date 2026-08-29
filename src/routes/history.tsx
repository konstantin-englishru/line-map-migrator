import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/SitePage";
import { useCmsBlocks } from "@/lib/site-cms";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "История компании — Город Знаний" },
      { name: "description", content: "История учебного центра «Город Знаний»: как мы начинались и куда идём." },
      { property: "og:title", content: "История компании — Город Знаний" },
      { property: "og:description", content: "История учебного центра «Город Знаний»." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const blocks = useCmsBlocks("history");
  return (
    <SitePage title="История компании">
      {blocks.length === 0 && <p className="sp-empty">Материалы скоро появятся.</p>}
      {blocks.map((b) => (
        <div className="sp-text" key={b.id} style={{ marginBottom: 16 }}>
          {b.title && <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>{b.title}</h2>}
          {b.image && <img src={b.image} alt={b.title ?? ""} style={{ width: "100%", borderRadius: 20, marginBottom: 12 }} />}
          {b.text}
        </div>
      ))}
    </SitePage>
  );
}

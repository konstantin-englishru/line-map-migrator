import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/SitePage";
import { useCmsBlocks } from "@/lib/site-cms";

export const Route = createFileRoute("/svedeniya")({
  head: () => ({
    meta: [
      { title: "Сведения об образовательной организации — Город Знаний" },
      {
        name: "description",
        content: "Документы и сведения об образовательной организации учебного центра «Город Знаний».",
      },
      { property: "og:title", content: "Сведения об образовательной организации — Город Знаний" },
      { property: "og:description", content: "Документы и сведения об образовательной организации." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const blocks = useCmsBlocks("documents");
  return (
    <SitePage title="Сведения об образовательной организации">
      {blocks.length === 0 && <p className="sp-empty">Документы скоро появятся.</p>}
      <div className="sp-bubbles">
        {blocks.map((b) =>
          b.url ? (
            <a className="sp-bubble" key={b.id} href={b.url} target="_blank" rel="noopener">
              <h3>{b.title}</h3>
              {b.text && <p>{b.text}</p>}
            </a>
          ) : (
            <div className="sp-bubble" key={b.id}>
              <h3>{b.title}</h3>
              {b.text && <p>{b.text}</p>}
            </div>
          ),
        )}
      </div>
    </SitePage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/SitePage";
import { useCmsBlocks } from "@/lib/site-cms";

export const Route = createFileRoute("/articles")({
  head: () => ({
    meta: [
      { title: "Полезные статьи — Город Знаний" },
      { name: "description", content: "Статьи и советы педагогов учебного центра «Город Знаний» для родителей." },
      { property: "og:title", content: "Полезные статьи — Город Знаний" },
      { property: "og:description", content: "Статьи и советы педагогов для родителей." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const blocks = useCmsBlocks("articles");
  return (
    <SitePage title="Полезные статьи">
      {blocks.length === 0 && <p className="sp-empty">Статьи скоро появятся.</p>}
      <div className="sp-bubbles">
        {blocks.map((b) => {
          const inner = (
            <>
              {b.image && <img src={b.image} alt={b.title ?? ""} style={{ width: "100%", borderRadius: 18, marginBottom: 10 }} />}
              <h3>{b.title}</h3>
              {b.text && <p>{b.text}</p>}
            </>
          );
          return b.url ? (
            <a className="sp-bubble" key={b.id} href={b.url}>
              {inner}
            </a>
          ) : (
            <div className="sp-bubble" key={b.id}>
              {inner}
            </div>
          );
        })}
      </div>
    </SitePage>
  );
}

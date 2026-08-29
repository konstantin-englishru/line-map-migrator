import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/SitePage";
import { useCmsBlocks } from "@/lib/site-cms";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Фото и видео галерея — Город Знаний" },
      { name: "description", content: "Фотографии и видео с занятий и праздников учебного центра «Город Знаний»." },
      { property: "og:title", content: "Фото и видео галерея — Город Знаний" },
      { property: "og:description", content: "Фотографии и видео с занятий и праздников центра." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MediaPage,
});

function MediaPage() {
  const blocks = useCmsBlocks("media");
  return (
    <SitePage title="Фото и видео галерея">
      {blocks.length === 0 && <p className="sp-empty">Материалы скоро появятся.</p>}
      <div className="sp-media">
        {blocks.map((b) => (
          <figure key={b.id}>
            {b.url ? (
              <iframe src={b.url} title={b.title ?? "Видео"} allowFullScreen loading="lazy" />
            ) : b.image ? (
              <img src={b.image} alt={b.title ?? ""} loading="lazy" />
            ) : null}
            {b.title && <figcaption>{b.title}</figcaption>}
          </figure>
        ))}
      </div>
    </SitePage>
  );
}

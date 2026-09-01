import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Город Знаний — детский развивающий центр" },
      {
        name: "description",
        content:
          "Развивающие занятия для детей от 4 до 17 лет. Английский язык, подготовка к школе, робототехника и другие направления.",
      },
      { property: "og:title", content: "Город Знаний — детский развивающий центр" },
      {
        property: "og:description",
        content:
          "Развивающие занятия для детей от 4 до 17 лет. Английский язык, подготовка к школе, робототехника и другие направления.",
      },
      { property: "og:image", content: "https://xn--80afdmggzbeav.xn--p1ai/og-image.jpg" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://xn--80afdmggzbeav.xn--p1ai/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Город Знаний — детский развивающий центр" },
      {
        name: "twitter:description",
        content:
          "Развивающие занятия для детей от 4 до 17 лет. Английский язык, подготовка к школе, робототехника и другие направления.",
      },
      { name: "twitter:image", content: "https://xn--80afdmggzbeav.xn--p1ai/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://xn--80afdmggzbeav.xn--p1ai/" }],
  }),
  component: Index,
});

function Index() {
  // Хэш (в т.ч. #line-<id> для автооткрытия панели линии) прокидываем в src iframe.
  // После SSR-гидратации атрибут src не перезаписывается, а смена только фрагмента
  // не перезагружает iframe — поэтому добавляем query-параметр для полной загрузки.
  const [src, setSrc] = useState("/legacy.html");
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) setSrc("/legacy.html?h=" + encodeURIComponent(hash.slice(1)) + hash);
  }, []);
  return (
    <iframe
      src={src}
      title="Город Знаний"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        display: "block",
      }}
    />
  );
}

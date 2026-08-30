import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Город Знаний — Детский развивающий центр" },
      {
        name: "description",
        content:
          "Детский развивающий центр «Город Знаний» — программы для малышей, школьников, старшеклассников и взрослых.",
      },
    ],
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

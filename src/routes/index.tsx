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
  // Хэш (в т.ч. #line-<id> для автооткрытия панели линии) прокидываем в src iframe
  // сразу при первом рендере, чтобы legacy-скрипты увидели его при первой загрузке.
  const [src] = useState(
    () =>
      "/legacy.html" +
      (typeof window !== "undefined" ? window.location.hash || "" : ""),
  );
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

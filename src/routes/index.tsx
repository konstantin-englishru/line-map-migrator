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
  const [src, setSrc] = useState("/legacy.html");
  useEffect(() => {
    if (window.location.hash) setSrc("/legacy.html" + window.location.hash);
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

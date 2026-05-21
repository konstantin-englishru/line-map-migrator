import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/legacy.html"
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

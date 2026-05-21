import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/p/$slug")({
  head: ({ params }) => {
    const title = decodeURIComponent(params.slug);
    return {
      meta: [
        { title: `${title} — Город Знаний` },
        { name: "description", content: `Страница «${title}» детского развивающего центра «Город Знаний».` },
      ],
    };
  },
  component: PageStub,
});

function PageStub() {
  const { slug } = Route.useParams();
  const title = decodeURIComponent(slug);
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "linear-gradient(180deg, #E8F4FF 0%, #FFF5F7 100%)",
        fontFamily: "'Fredoka', 'Quicksand', system-ui, sans-serif",
        textAlign: "center",
        color: "#2D2D2D",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "3rem 2.5rem",
          borderRadius: 40,
          boxShadow: "0 20px 60px rgba(0,0,0,.08)",
          maxWidth: 640,
          width: "100%",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚇</div>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, margin: "0 0 0.75rem" }}>{title}</h1>
        <p style={{ opacity: 0.7, fontSize: "1.05rem", marginBottom: "2rem" }}>
          Эта станция уже в пути. Скоро здесь появится полное описание раздела.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            background: "#C9A0DC",
            color: "#2D2D2D",
            fontWeight: 700,
            padding: "0.9rem 1.8rem",
            borderRadius: 18,
            textDecoration: "none",
            border: "2px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,.06)",
          }}
        >
          ← Вернуться к карте
        </Link>
      </div>
    </main>
  );
}
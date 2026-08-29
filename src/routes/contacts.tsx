import { createFileRoute } from "@tanstack/react-router";
import { SitePage } from "@/components/SitePage";
import { useCmsBlocks } from "@/lib/site-cms";
import { useCmsSettings } from "@/lib/cms";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты — Город Знаний" },
      { name: "description", content: "Адрес, телефон и мессенджеры учебного центра «Город Знаний»." },
      { property: "og:title", content: "Контакты — Город Знаний" },
      { property: "og:description", content: "Адрес, телефон и мессенджеры учебного центра." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const s = useCmsSettings();
  const blocks = useCmsBlocks("contacts");
  const fallback = [
    { id: "a", title: "Адрес", text: s.address || "ул. Ясеневая, д. 26, м. Зябликово", url: null },
    { id: "p", title: "Телефон", text: s.phone || "+7 499 938 58 58", url: "tel:" + (s.phone_href || "+74999385858") },
    { id: "e", title: "E-mail", text: s.email || "", url: s.email ? "mailto:" + s.email : null },
    { id: "t", title: "Telegram", text: "Написать нам", url: s.telegram_url || "https://t.me/gorod_znanij" },
  ].filter((b) => b.text);
  const list = blocks.length ? blocks : fallback;
  return (
    <SitePage title="Контакты">
      <div className="sp-bubbles">
        {list.map((b) =>
          b.url ? (
            <a className="sp-bubble" key={b.id} href={b.url}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </a>
          ) : (
            <div className="sp-bubble" key={b.id}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ),
        )}
      </div>
    </SitePage>
  );
}

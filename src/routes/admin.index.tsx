import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Админ-панель — Город Знаний" },
      { name: "description", content: "Управление контентом сайта учебного центра «Город Знаний»." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Админ-панель — Город Знаний" },
      { property: "og:description", content: "Управление контентом сайта учебного центра." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminHome,
});

const SECTIONS = [
  ["lines", "Линии", "Названия, описания, легенды и станции веток"],
  ["stations", "Станции", "Линия → станция → редактирование страницы курса"],
  ["teachers", "Преподаватели", "Карточки педагогов и ссылки кнопок"],
  ["reviews", "Отзывы родителей", "Добавление, порядок и видимость отзывов"],
  ["map", "Схема линий", "Редактор расположения станций и линий на схеме"],
  ["history", "История компании", "Текст страницы /history"],
  ["documents", "Сведения об организации", "Баблы документов на странице /svedeniya"],
  ["contacts", "Контакты", "Баблы страницы /contacts"],
  ["articles", "Полезные статьи", "Статьи на странице /articles"],
  ["media", "Фото/Видео материалы", "Фотографии и видео на странице /media"],
  ["footer-social", "Подвал: «Наш телеграф»", "Соцсети подвала: название, ссылка, иконка"],
  ["footer-links", "Подвал: нижние ссылки", "Сведения об организации, политика конфиденциальности"],
  ["settings", "Настройки", "Контакты, шапка, подвал, лид-форма и тексты главной"],
] as const;

function AdminHome() {
  return (
    <AdminGuard>
      <h1>Админ-панель</h1>
      <p className="ad-mini">Редактируется только контент. Дизайн и структура страниц остаются в коде.</p>
      {SECTIONS.map(([id, name, desc]) => (
        <div className="ad-card" key={id}>
          <b>{name}</b>
          <div className="ad-mini" style={{ margin: "6px 0 10px" }}>{desc}</div>
          <Link className="ad-btn" to="/admin/$section" params={{ section: id }}>Открыть</Link>
        </div>
      ))}
    </AdminGuard>
  );
}

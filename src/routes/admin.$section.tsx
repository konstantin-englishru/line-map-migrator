import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Crud, SettingsEditor, type Field } from "@/components/admin/Crud";
import { StationBrowser } from "@/components/admin/StationBrowser";


export const Route = createFileRoute("/admin/$section")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Редактирование контента — Город Знаний" },
      { name: "description", content: "Раздел админ-панели для редактирования контента сайта «Город Знаний»." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Редактирование контента — Город Знаний" },
      { property: "og:description", content: "Раздел админ-панели для редактирования контента сайта." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminSection,
});

const LINE_FIELDS: Field[] = [
  { key: "id", label: "ID линии", type: "text", hint: "как в схеме: pink, purple и т.д." },
  { key: "name", label: "Название", type: "text" },
  { key: "description", label: "Короткое описание", type: "textarea" },
  { key: "full_description", label: "Полное описание", type: "textarea" },
  { key: "image", label: "Изображение", type: "image" },
  { key: "legend", label: "Легенда (абзацы)", type: "list" },
  { key: "stations", label: "Станции линии", type: "list", hint: "формат: Название | Программа 1, Программа 2" },
  { key: "sort_order", label: "Порядок", type: "number" },
  { key: "is_active", label: "Активна", type: "bool" },
];

const STATION_FIELDS: Field[] = [
  { key: "line_id", label: "Линия (ID)", type: "text" },
  { key: "name", label: "Название станции", type: "text" },
  { key: "slug", label: "Slug (адрес страницы)", type: "text", hint: "совпадает с названием программы в адресе /p/…" },
  { key: "title", label: "Заголовок страницы (H1)", type: "text" },
  { key: "short_description", label: "Краткое описание (подзаголовок)", type: "textarea" },
  { key: "description", label: "Основное описание", type: "textarea" },
  { key: "image", label: "Фотография", type: "image" },
  { key: "audience", label: "Для кого этот курс", type: "list" },
  { key: "format", label: "Формат обучения", type: "list" },
  { key: "advantages", label: "Преимущества / результаты", type: "list" },
  { key: "program", label: "Программа / содержание", type: "list" },
  { key: "extra", label: "Дополнительные блоки", type: "list" },
  { key: "button_text", label: "Текст кнопки", type: "text" },
  { key: "button_url", label: "Ссылка кнопки", type: "text" },
  { key: "sort_order", label: "Порядок", type: "number" },
  { key: "is_active", label: "Активна", type: "bool" },
];

const TEACHER_FIELDS: Field[] = [
  { key: "id", label: "ID педагога", type: "text", hint: "как в адресе /teacher/…, например t01" },
  { key: "name", label: "Имя", type: "text" },
  { key: "image", label: "Фотография", type: "image" },
  { key: "position", label: "Должность", type: "text" },
  { key: "short_description", label: "Краткое описание (цитата)", type: "textarea" },
  { key: "description", label: "Полное описание", type: "textarea" },
  { key: "education", label: "Образование", type: "textarea" },
  { key: "experience", label: "Опыт", type: "text" },
  { key: "extra", label: "Дополнительно (факты)", type: "list" },
  { key: "trial_url", label: "Ссылка «Записаться на пробное»", type: "text", hint: "по умолчанию форма на главной" },
  { key: "question_url", label: "Ссылка «Задать вопрос педагогу»", type: "text", hint: "по умолчанию Telegram" },
  { key: "signup_url", label: "Ссылка «Записаться» (нижний блок)", type: "text", hint: "по умолчанию форма на главной" },
  { key: "sort_order", label: "Порядок", type: "number" },
  { key: "is_active", label: "Активен", type: "bool" },
];

const REVIEW_FIELDS: Field[] = [
  { key: "name", label: "Имя автора", type: "text" },
  { key: "subtitle", label: "Подпись", type: "text", hint: "например: мама Кирилла, 7 лет" },
  { key: "initial", label: "Буква в кружке", type: "text", hint: "если пусто — первая буква имени" },
  { key: "rating", label: "Оценка (1–5)", type: "number" },
  { key: "text", label: "Текст отзыва", type: "textarea" },
  { key: "sort_order", label: "Порядок", type: "number" },
  { key: "is_active", label: "Показывать", type: "bool" },
];

function AdminSection() {
  const { section } = Route.useParams();

  return (
    <AdminGuard>
      {section === "lines" && (
        <Crud table="cms_lines" title="Линии" fields={LINE_FIELDS} idField="id" labelField="name" />
      )}
      {section === "stations" && <StationBrowser />}
      {section === "stations-all" && (
        <Crud table="cms_stations" title="Станции / программы (список)" fields={STATION_FIELDS} idField="slug" labelField="name" />
      )}

      {section === "teachers" && (
        <Crud table="cms_teachers" title="Преподаватели" fields={TEACHER_FIELDS} idField="id" labelField="name" />
      )}
      {section === "reviews" && (
        <Crud table="cms_reviews" title="Отзывы родителей" fields={REVIEW_FIELDS} idField="id" labelField="name" />
      )}
      {section === "map" && (
        <>
          <h1>Схема линий</h1>
          <p className="ad-mini">
            Редактор расположения станций открывается в отдельной вкладке. Обычным посетителям сайта он недоступен.
          </p>
          <div className="ad-card">
            <a className="ad-btn" href="/legacy.html?edit=1" target="_blank" rel="noopener">Открыть редактор схемы</a>
          </div>
        </>
      )}
      {section === "settings" && (
        <>
          <h1>Настройки и главная</h1>
          <SettingsEditor
            groups={[
              {
                title: "Контакты",
                keys: [
                  { key: "phone", label: "Телефон (как показывать)" },
                  { key: "phone_href", label: "Телефон для ссылки tel:", },
                  { key: "email", label: "E-mail" },
                  { key: "address", label: "Адрес" },
                  { key: "telegram_url", label: "Ссылка Telegram" },
                  { key: "max_url", label: "Ссылка MAX" },
                  { key: "consult_url", label: "Ссылка кнопки «Получить консультацию»" },
                ],
              },
              {
                title: "Шапка сайта",
                keys: [
                  { key: "menu_about", label: "Пункт меню «О нас»" },
                  { key: "menu_programs", label: "Пункт меню «Программы»" },
                  { key: "menu_contacts", label: "Пункт меню «Контакты»" },
                  { key: "menu_articles", label: "Пункт меню «Полезные статьи»" },
                  { key: "show_telegram", label: "Показывать иконку Telegram (1 — да, 0 — нет)" },
                  { key: "show_max", label: "Показывать иконку MAX (1 — да, 0 — нет)" },
                  { key: "telegram_icon", label: "Иконка Telegram (картинка)", type: "image" },
                  { key: "max_icon", label: "Иконка MAX (картинка)", type: "image" },
                ],
              },
              {
                title: "Отзывы",
                keys: [{ key: "reviews_visible_count", label: "Сколько отзывов показывать сразу (по умолчанию 6)" }],
              },
              {
                title: "Легенда линий: ссылки станций",
                keys: [
                  {
                    key: "station_links",
                    label: "По строке на станцию, формат: линия | Станция => /p/Название страницы",
                    type: "textarea",
                  },
                ],
              },
              {
                title: "Тексты главной страницы",
                keys: [
                  { key: "hero_title", label: "Основной заголовок" },
                  { key: "hero_subtitle", label: "Описание под заголовком", type: "textarea" },
                  { key: "cta_text", label: "Текст кнопки записи" },
                  { key: "info_text", label: "Текст информационного блока", type: "textarea" },
                ],
              },
            ]}
          />
        </>
      )}
      {!["lines", "stations", "stations-all", "teachers", "reviews", "map", "settings"].includes(section) && (
        <p>Раздел не найден.</p>
      )}
    </AdminGuard>
  );
}

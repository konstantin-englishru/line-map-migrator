import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * Универсальный шаблон страницы курса «Город Знаний».
 * Контент задаётся через объект `course` (легко заменить на CMS / API).
 * Дизайн повторяет визуальную систему главной страницы: пастель,
 * скруглённые карточки, мягкие тени, акцентные градиенты, Accuratist/Fredoka.
 */

type CourseModule = { title: string; desc: string; icon: string };
type CourseBenefit = { title: string; desc: string; icon: string; color: string };
type CourseReview = { name: string; role: string; text: string; avatar: string };
type CourseFaq = { q: string; a: string };

type CourseData = {
  emoji: string;
  title: string;
  tagline: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stats: { value: string; label: string }[];
  forWhom: string[];
  results: string[];
  benefits: CourseBenefit[];
  modules: CourseModule[];
  format: { duration: string; schedule: string; mode: string; method: string; teacher: string };
  reviews: CourseReview[];
  faq: CourseFaq[];
};

const PALETTE = ["#F79EC7", "#B79BEA", "#9EE07A", "#D6E85E", "#FFCB85", "#9DC7EE"];

function buildCourse(title: string): CourseData {
  return {
    emoji: "🎓",
    title,
    tagline: "Современный курс в «Городе Знаний»",
    description:
      "Системная программа, в которой ребёнок учится с удовольствием. Опытные педагоги, игровая методика и заметные результаты уже после первых занятий.",
    primaryCta: "Записаться на пробное занятие",
    secondaryCta: "Получить консультацию",
    stats: [
      { value: "1200+", label: "учеников прошли курс" },
      { value: "4.9", label: "средняя оценка родителей" },
      { value: "12 лет", label: "опыта педагогов" },
      { value: "94%", label: "продолжают обучение" },
    ],
    forWhom: [
      "Детей, которым важно учиться в комфортном темпе",
      "Родителей, ищущих современный и тёплый подход",
      "Тех, кто хочет реальный, измеримый результат",
    ],
    results: [
      "Уверенно применяет полученные знания на практике",
      "Развивает мышление, внимание и самостоятельность",
      "Получает мотивацию учиться дальше",
    ],
    benefits: [
      { icon: "🎨", title: "Игровая методика", desc: "Уроки построены как путешествие — ребёнок не замечает, как учится.", color: "#F79EC7" },
      { icon: "👩‍🏫", title: "Опытные педагоги", desc: "Преподаватели с педагогическим образованием и любовью к детям.", color: "#B79BEA" },
      { icon: "📊", title: "Прозрачный прогресс", desc: "Регулярно показываем родителям результаты и план следующих шагов.", color: "#9EE07A" },
      { icon: "💚", title: "Уютная атмосфера", desc: "Маленькие группы, светлые классы, доброжелательная среда.", color: "#FFCB85" },
    ],
    modules: [
      { icon: "1", title: "Знакомство и диагностика", desc: "Определяем уровень и составляем индивидуальный маршрут." },
      { icon: "2", title: "База", desc: "Закладываем фундамент: ключевые понятия и навыки." },
      { icon: "3", title: "Практика", desc: "Тренируем навыки в живых заданиях и проектах." },
      { icon: "4", title: "Углубление", desc: "Сложные темы через игры, кейсы и обсуждения." },
      { icon: "5", title: "Результат", desc: "Показываем родителям рост и празднуем успехи." },
    ],
    format: {
      duration: "9 месяцев / модули по 4 недели",
      schedule: "2 раза в неделю по 60 минут",
      mode: "Очно в центре или онлайн",
      method: "Игровой подход + развивающие методики",
      teacher: "Сертифицированные педагоги с опытом 5+ лет",
    },
    reviews: [
      { name: "Анна", role: "мама Миши, 7 лет", text: "Миша ходит с удовольствием и уже сам просит дополнительные задания. Спасибо команде!", avatar: "👩" },
      { name: "Игорь", role: "папа Софии, 9 лет", text: "Видим реальный результат — оценки в школе подтянулись, появилась уверенность.", avatar: "👨" },
      { name: "Мария", role: "мама Алисы, 6 лет", text: "Атмосфера тёплая, педагоги внимательные. Алиса теперь обожает занятия.", avatar: "🧑" },
    ],
    faq: [
      { q: "С какого возраста можно начать?", a: "Подбираем программу под возраст ребёнка — от 4 лет и старше. На пробном занятии поможем определить уровень." },
      { q: "Что если ребёнок пропустит занятие?", a: "Мы предложим отработку или дадим материалы для самостоятельного изучения." },
      { q: "Можно ли заниматься онлайн?", a: "Да, у нас есть онлайн-формат с теми же педагогами и методикой." },
      { q: "Как проходит пробное занятие?", a: "Знакомимся с ребёнком, проводим мини-диагностику и показываем формат работы. Это бесплатно и ни к чему не обязывает." },
    ],
  };
}

export const Route = createFileRoute("/p/$slug")({
  head: ({ params }) => {
    const title = decodeURIComponent(params.slug);
    return {
      meta: [
        { title: `${title} — курс в центре «Город Знаний»` },
        {
          name: "description",
          content: `Курс «${title}» в детском развивающем центре «Город Знаний»: программа, формат, преподаватели, отзывы и запись на пробное занятие.`,
        },
        { property: "og:title", content: `${title} — Город Знаний` },
        { property: "og:description", content: `Курс «${title}» в центре «Город Знаний». Запишитесь на бесплатное пробное занятие.` },
      ],
    };
  },
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const title = decodeURIComponent(slug);
  const course = buildCourse(title);
  const trialHref = `/p/${encodeURIComponent("Записаться на пробное занятие")}`;
  const consultHref = `/p/${encodeURIComponent("Бесплатная консультация")}`;

  return (
    <>
      <style>{styles}</style>
      <main className="cp-page">
        {/* ===== Top bar ===== */}
        <header className="cp-topbar">
          <Link to="/" className="cp-back">← К карте курсов</Link>
          <span className="cp-brand">🚇 Город Знаний</span>
          <a href={trialHref} className="cp-top-cta">Пробное занятие</a>
        </header>

        {/* ===== Hero ===== */}
        <section className="cp-hero">
          <div className="cp-hero-grid">
            <div className="cp-hero-text">
              <span className="cp-badge">Курс • {course.tagline}</span>
              <h1 className="cp-h1">{course.title}</h1>
              <p className="cp-lead">{course.description}</p>
              <div className="cp-cta-row">
                <a href={trialHref} className="cp-btn cp-btn-primary">🚂 {course.primaryCta}</a>
                <a href={consultHref} className="cp-btn cp-btn-ghost">💬 {course.secondaryCta}</a>
              </div>
              <div className="cp-stats">
                {course.stats.map((s) => (
                  <div key={s.label} className="cp-stat">
                    <div className="cp-stat-v">{s.value}</div>
                    <div className="cp-stat-l">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="cp-hero-art">
              <div className="cp-blob cp-blob-1" />
              <div className="cp-blob cp-blob-2" />
              <div className="cp-blob cp-blob-3" />
              <div className="cp-hero-card">
                <div className="cp-hero-emoji">{course.emoji}</div>
                <div className="cp-hero-card-title">{course.title}</div>
                <div className="cp-hero-card-sub">пробное занятие бесплатно</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== About ===== */}
        <section className="cp-section">
          <div className="cp-section-head">
            <h2 className="cp-h2">О курсе</h2>
            <p className="cp-sub">Кому подойдёт и какие задачи решает</p>
          </div>
          <div className="cp-two-col">
            <div className="cp-soft-card">
              <h3 className="cp-h3">👨‍👩‍👧 Для кого</h3>
              <ul className="cp-list">
                {course.forWhom.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
            <div className="cp-soft-card cp-soft-card-alt">
              <h3 className="cp-h3">🎯 Результаты</h3>
              <ul className="cp-list">
                {course.results.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* ===== Benefits ===== */}
        <section className="cp-section">
          <div className="cp-section-head">
            <h2 className="cp-h2">Почему выбирают этот курс</h2>
            <p className="cp-sub">Четыре причины, по которым родители доверяют нам</p>
          </div>
          <div className="cp-bento">
            {course.benefits.map((b) => (
              <div key={b.title} className="cp-bento-card" style={{ background: b.color }}>
                <div className="cp-bento-icon">{b.icon}</div>
                <h4 className="cp-bento-title">{b.title}</h4>
                <p className="cp-bento-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Program ===== */}
        <section className="cp-section">
          <div className="cp-section-head">
            <h2 className="cp-h2">Программа обучения</h2>
            <p className="cp-sub">Путь ученика — шаг за шагом, как остановки на ветке метро</p>
          </div>
          <div className="cp-timeline">
            {course.modules.map((m, i) => (
              <div key={m.title} className="cp-tl-item">
                <div className="cp-tl-dot" style={{ background: PALETTE[i % PALETTE.length] }}>{m.icon}</div>
                <div className="cp-tl-card">
                  <h4 className="cp-tl-title">{m.title}</h4>
                  <p className="cp-tl-desc">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Format ===== */}
        <section className="cp-section">
          <div className="cp-section-head">
            <h2 className="cp-h2">Формат обучения</h2>
            <p className="cp-sub">Удобно и для ребёнка, и для родителей</p>
          </div>
          <div className="cp-format-grid">
            <FormatItem icon="⏱" label="Длительность" value={course.format.duration} />
            <FormatItem icon="📅" label="Расписание" value={course.format.schedule} />
            <FormatItem icon="🏫" label="Формат" value={course.format.mode} />
            <FormatItem icon="🧩" label="Методика" value={course.format.method} />
            <FormatItem icon="👩‍🏫" label="Преподаватели" value={course.format.teacher} />
          </div>
        </section>

        {/* ===== Reviews ===== */}
        <section className="cp-section">
          <div className="cp-section-head">
            <h2 className="cp-h2">Отзывы родителей</h2>
            <p className="cp-sub">Истории учеников «Города Знаний»</p>
          </div>
          <div className="cp-reviews">
            {course.reviews.map((r) => (
              <article key={r.name} className="cp-review">
                <div className="cp-review-stars">★ ★ ★ ★ ★</div>
                <p className="cp-review-text">«{r.text}»</p>
                <div className="cp-review-author">
                  <span className="cp-review-ava">{r.avatar}</span>
                  <div>
                    <div className="cp-review-name">{r.name}</div>
                    <div className="cp-review-role">{r.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="cp-section">
          <div className="cp-section-head">
            <h2 className="cp-h2">Частые вопросы</h2>
            <p className="cp-sub">Если не нашли ответ — напишите нам</p>
          </div>
          <div className="cp-faq">
            {course.faq.map((f, i) => (
              <details key={f.q} className="cp-faq-item" open={i === 0}>
                <summary className="cp-faq-q">
                  <span>{f.q}</span>
                  <span className="cp-faq-chev">＋</span>
                </summary>
                <p className="cp-faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ===== Final CTA ===== */}
        <section className="cp-final">
          <div className="cp-final-card">
            <div className="cp-final-emoji">🚂</div>
            <h2 className="cp-final-title">Готовы начать путешествие?</h2>
            <p className="cp-final-sub">
              Запишитесь на бесплатное пробное занятие — познакомимся, проведём диагностику и
              покажем, как будет учиться ваш ребёнок.
            </p>
            <div className="cp-cta-row cp-cta-row-center">
              <a href={trialHref} className="cp-btn cp-btn-primary cp-btn-lg">
                🎁 {course.primaryCta}
              </a>
              <a href={consultHref} className="cp-btn cp-btn-ghost cp-btn-lg">
                📞 {course.secondaryCta}
              </a>
            </div>
          </div>
        </section>

        <footer className="cp-footer">
          <Link to="/" className="cp-back">← Вернуться на карту курсов</Link>
          <span className="cp-footer-tel">+7 499 938 58 58</span>
        </footer>
      </main>
    </>
  );
}

function FormatItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="cp-fmt">
      <div className="cp-fmt-icon">{icon}</div>
      <div>
        <div className="cp-fmt-label">{label}</div>
        <div className="cp-fmt-value">{value}</div>
      </div>
    </div>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&family=Montserrat:wght@400;700;800;900&display=swap');

  .cp-page {
    --pink: #F79EC7;
    --lav: #B79BEA;
    --mint: #9EE07A;
    --yellow: #D6E85E;
    --peach: #FFCB85;
    --sky: #9DC7EE;
    --bg: #DCE9FF;
    --ink: #3A3A3A;
    --ink-soft: #6B6B7B;
    min-height: 100vh;
    background:
      radial-gradient(1100px 600px at 10% -10%, #FF9EC7 0%, transparent 60%),
      radial-gradient(900px 500px at 110% 10%, #7AD4FF 0%, transparent 55%),
      radial-gradient(900px 700px at 50% 110%, #B79BEA 0%, transparent 60%),
      var(--bg);
    color: var(--ink);
    font-family: 'Accuratist', 'Montserrat', 'Quicksand', 'Fredoka', system-ui, sans-serif;
    padding-bottom: 60px;
  }
  .cp-page * { box-sizing: border-box; }

  /* Top bar */
  .cp-topbar {
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 14px 22px;
    background: rgba(255,255,255,.78);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0,0,0,.04);
  }
  .cp-back { color: var(--ink); text-decoration: none; font-weight: 600; font-size: 15px; }
  .cp-back:hover { color: #B07AC9; }
  .cp-brand { font-weight: 800; font-size: 18px; letter-spacing: .2px; }
  .cp-top-cta {
    background: linear-gradient(135deg, #F472B6, #FB923C);
    color: #fff; text-decoration: none; font-weight: 700;
    padding: 10px 18px; border-radius: 999px;
    box-shadow: 0 6px 18px rgba(244,114,182,.35);
    transition: transform .25s cubic-bezier(.2,.9,.3,1.4), box-shadow .25s;
  }
  .cp-top-cta:hover { transform: translateY(-2px) scale(1.04); }

  /* Hero */
  .cp-hero { padding: 56px 22px 32px; max-width: 1180px; margin: 0 auto; }
  .cp-hero-grid {
    display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; align-items: center;
  }
  .cp-badge {
    display: inline-block; padding: 8px 16px; border-radius: 999px;
    background: #fff; box-shadow: 0 6px 16px rgba(155,114,207,.15);
    font-weight: 600; font-size: 13px; color: #8B5CF6; margin-bottom: 18px;
  }
  .cp-h1 {
    font-size: clamp(34px, 5vw, 56px); line-height: 1.05; margin: 0 0 18px;
    font-weight: 900; letter-spacing: -.5px;
  }
  .cp-lead { font-size: 18px; line-height: 1.55; color: var(--ink-soft); margin: 0 0 28px; max-width: 560px; }
  .cp-cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
  .cp-cta-row-center { justify-content: center; }
  .cp-btn {
    display: inline-flex; align-items: center; gap: 8px;
    text-decoration: none; font-weight: 700; font-size: 16px;
    padding: 14px 24px; border-radius: 999px;
    transition: transform .25s cubic-bezier(.2,.9,.3,1.4), box-shadow .25s, filter .25s;
  }
  .cp-btn-primary {
    background: linear-gradient(135deg, #F472B6, #FB923C);
    color: #fff; box-shadow: 0 10px 24px rgba(244,114,182,.4);
    animation: cpGlow 2.6s ease-in-out infinite;
  }
  @keyframes cpGlow {
    0%,100% { box-shadow: 0 10px 24px rgba(244,114,182,.4), 0 0 0 0 rgba(244,114,182,.5); }
    50%     { box-shadow: 0 14px 32px rgba(244,114,182,.6), 0 0 0 12px rgba(244,114,182,0); }
  }
  .cp-btn-ghost {
    background: #fff; color: var(--ink);
    box-shadow: 0 6px 16px rgba(0,0,0,.06); border: 1px solid rgba(0,0,0,.04);
  }
  .cp-btn-lg { padding: 18px 30px; font-size: 18px; }
  .cp-btn:hover { transform: translateY(-2px) scale(1.04); filter: brightness(1.05); }

  .cp-stats {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 32px;
  }
  .cp-stat {
    background: rgba(255,255,255,.7); border-radius: 18px; padding: 14px 12px;
    text-align: center; box-shadow: 0 6px 16px rgba(0,0,0,.04);
  }
  .cp-stat-v { font-size: 22px; font-weight: 900; color: #8B5CF6; }
  .cp-stat-l { font-size: 12px; color: var(--ink-soft); margin-top: 4px; line-height: 1.3; }

  /* Hero art */
  .cp-hero-art { position: relative; height: 420px; }
  .cp-blob { position: absolute; border-radius: 50%; filter: blur(2px); animation: cpFloat 7s ease-in-out infinite; }
  .cp-blob-1 { width: 220px; height: 220px; background: var(--pink); top: 10px; right: 30px; }
  .cp-blob-2 { width: 160px; height: 160px; background: var(--mint); bottom: 30px; left: 20px; animation-delay: 1.5s; }
  .cp-blob-3 { width: 120px; height: 120px; background: var(--peach); top: 180px; right: 200px; animation-delay: 3s; }
  @keyframes cpFloat { 0%,100%{ transform: translateY(0); } 50% { transform: translateY(-14px); } }
  .cp-hero-card {
    position: absolute; inset: 50% auto auto 50%; transform: translate(-50%, -50%);
    background: #fff; border-radius: 36px; padding: 40px 32px;
    box-shadow: 0 30px 60px rgba(0,0,0,.12);
    text-align: center; min-width: 280px;
  }
  .cp-hero-emoji { font-size: 84px; line-height: 1; margin-bottom: 12px; }
  .cp-hero-card-title { font-weight: 800; font-size: 20px; }
  .cp-hero-card-sub { font-size: 13px; color: var(--ink-soft); margin-top: 6px; }

  /* Sections */
  .cp-section { max-width: 1180px; margin: 0 auto; padding: 56px 22px; }
  .cp-section-head { text-align: center; margin-bottom: 36px; }
  .cp-h2 { font-size: clamp(26px, 3.6vw, 40px); font-weight: 900; margin: 0 0 10px; letter-spacing: -.3px; }
  .cp-sub { font-size: 16px; color: var(--ink-soft); margin: 0; }
  .cp-h3 { font-size: 22px; font-weight: 800; margin: 0 0 14px; }

  /* Two-col cards */
  .cp-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .cp-soft-card {
    background: #fff; border-radius: 28px; padding: 28px;
    box-shadow: 0 14px 34px rgba(0,0,0,.05); border: 1px solid rgba(255,255,255,.9);
  }
  .cp-soft-card-alt { background: linear-gradient(135deg, #FFF, #FAF3FF); }
  .cp-list { margin: 0; padding-left: 0; list-style: none; }
  .cp-list li {
    position: relative; padding: 10px 0 10px 32px; font-size: 16px;
    border-bottom: 1px dashed rgba(0,0,0,.06);
  }
  .cp-list li:last-child { border-bottom: none; }
  .cp-list li::before {
    content: '✓'; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 22px; height: 22px; background: var(--mint); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 12px; color: #2F7A3A;
  }

  /* Benefits */
  .cp-bento { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .cp-bento-card {
    border-radius: 28px; padding: 26px;
    box-shadow: 0 14px 30px rgba(0,0,0,.06); border: 4px solid #fff;
    transition: transform .3s cubic-bezier(.2,.9,.3,1.4);
  }
  .cp-bento-card:hover { transform: translateY(-6px) rotate(-.5deg); }
  .cp-bento-icon { font-size: 38px; margin-bottom: 10px; }
  .cp-bento-title { font-weight: 800; font-size: 18px; margin: 0 0 8px; }
  .cp-bento-desc { font-size: 14px; color: var(--ink-soft); margin: 0; line-height: 1.5; }

  /* Timeline */
  .cp-timeline { position: relative; max-width: 760px; margin: 0 auto; }
  .cp-timeline::before {
    content: ''; position: absolute; left: 27px; top: 12px; bottom: 12px; width: 4px;
    background: linear-gradient(180deg, var(--pink), var(--lav), var(--mint));
    border-radius: 4px;
  }
  .cp-tl-item { display: flex; gap: 20px; margin-bottom: 18px; position: relative; }
  .cp-tl-dot {
    flex-shrink: 0; width: 58px; height: 58px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 900; font-size: 22px; color: #fff;
    box-shadow: 0 8px 18px rgba(0,0,0,.10); border: 4px solid #fff;
    text-shadow: 0 1px 0 rgba(0,0,0,.15);
  }
  .cp-tl-card {
    flex: 1; background: #fff; border-radius: 22px; padding: 20px 22px;
    box-shadow: 0 10px 22px rgba(0,0,0,.05);
  }
  .cp-tl-title { margin: 0 0 6px; font-size: 18px; font-weight: 800; }
  .cp-tl-desc { margin: 0; font-size: 15px; color: var(--ink-soft); line-height: 1.5; }

  /* Format grid */
  .cp-format-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 880px; margin: 0 auto; }
  .cp-fmt {
    display: flex; gap: 16px; align-items: flex-start;
    background: #fff; border-radius: 22px; padding: 20px;
    box-shadow: 0 10px 24px rgba(0,0,0,.05);
  }
  .cp-fmt-icon {
    flex-shrink: 0; width: 48px; height: 48px; border-radius: 14px;
    background: var(--lav); display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .cp-fmt-label { font-size: 12px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: .5px; }
  .cp-fmt-value { font-size: 16px; font-weight: 700; margin-top: 4px; }

  /* Reviews */
  .cp-reviews { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .cp-review {
    background: #fff; border-radius: 28px; padding: 26px;
    box-shadow: 0 14px 30px rgba(0,0,0,.06);
    display: flex; flex-direction: column; gap: 14px;
  }
  .cp-review-stars { color: #F59E0B; letter-spacing: 2px; font-size: 14px; }
  .cp-review-text { margin: 0; font-size: 15px; line-height: 1.55; color: var(--ink); flex: 1; }
  .cp-review-author { display: flex; align-items: center; gap: 12px; }
  .cp-review-ava {
    width: 44px; height: 44px; border-radius: 50%; background: var(--pink);
    display: inline-flex; align-items: center; justify-content: center; font-size: 22px;
  }
  .cp-review-name { font-weight: 800; font-size: 15px; }
  .cp-review-role { font-size: 12px; color: var(--ink-soft); }

  /* FAQ */
  .cp-faq { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
  .cp-faq-item {
    background: #fff; border-radius: 20px; padding: 18px 22px;
    box-shadow: 0 8px 20px rgba(0,0,0,.04);
    transition: box-shadow .25s;
  }
  .cp-faq-item[open] { box-shadow: 0 14px 30px rgba(0,0,0,.08); }
  .cp-faq-q {
    cursor: pointer; list-style: none; display: flex; justify-content: space-between;
    align-items: center; gap: 16px; font-weight: 700; font-size: 16px;
  }
  .cp-faq-q::-webkit-details-marker { display: none; }
  .cp-faq-chev {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--lav); display: flex; align-items: center; justify-content: center;
    font-weight: 900; transition: transform .3s;
  }
  .cp-faq-item[open] .cp-faq-chev { transform: rotate(45deg); background: var(--pink); }
  .cp-faq-a { margin: 12px 0 0; color: var(--ink-soft); font-size: 15px; line-height: 1.55; }

  /* Final CTA */
  .cp-final { max-width: 1180px; margin: 0 auto; padding: 56px 22px; }
  .cp-final-card {
    background: linear-gradient(135deg, #FCE7F3 0%, #E0E7FF 50%, #DBEAFE 100%);
    border-radius: 40px; padding: 56px 32px; text-align: center;
    box-shadow: 0 24px 60px rgba(155,114,207,.18); border: 4px solid #fff;
    position: relative; overflow: hidden;
  }
  .cp-final-card::before, .cp-final-card::after {
    content: ''; position: absolute; border-radius: 50%; filter: blur(40px);
  }
  .cp-final-card::before { width: 240px; height: 240px; background: rgba(244,114,182,.35); top: -60px; left: -60px; }
  .cp-final-card::after  { width: 280px; height: 280px; background: rgba(167,139,250,.35); bottom: -80px; right: -80px; }
  .cp-final-emoji { font-size: 64px; position: relative; }
  .cp-final-title { font-size: clamp(26px, 3.6vw, 40px); font-weight: 900; margin: 12px 0 14px; position: relative; }
  .cp-final-sub { color: var(--ink-soft); font-size: 17px; max-width: 560px; margin: 0 auto 28px; position: relative; line-height: 1.55; }

  /* Footer */
  .cp-footer {
    max-width: 1180px; margin: 0 auto; padding: 22px;
    display: flex; justify-content: space-between; align-items: center; gap: 12px;
    color: var(--ink-soft); font-size: 14px;
  }
  .cp-footer-tel { font-weight: 700; color: var(--ink); }

  /* Responsive */
  @media (max-width: 980px) {
    .cp-hero-grid { grid-template-columns: 1fr; gap: 24px; }
    .cp-hero-art { height: 320px; }
    .cp-two-col { grid-template-columns: 1fr; }
    .cp-bento { grid-template-columns: repeat(2, 1fr); }
    .cp-reviews { grid-template-columns: 1fr; }
    .cp-stats { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .cp-topbar { padding: 10px 14px; }
    .cp-brand { display: none; }
    .cp-top-cta { padding: 8px 14px; font-size: 13px; }
    .cp-hero { padding: 32px 16px 12px; }
    .cp-section { padding: 36px 16px; }
    .cp-bento { grid-template-columns: 1fr; }
    .cp-format-grid { grid-template-columns: 1fr; }
    .cp-final-card { padding: 40px 22px; border-radius: 28px; }
    .cp-cta-row { flex-direction: column; align-items: stretch; }
    .cp-btn { justify-content: center; }
    .cp-footer { flex-direction: column; }
  }
`;
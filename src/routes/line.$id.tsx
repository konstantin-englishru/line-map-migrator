import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getLine, METRO_LINES, type MetroLine } from "@/lib/lines-data";
import { useCmsRow } from "@/lib/cms";

export const Route = createFileRoute("/line/$id")({
  head: ({ params }) => {
    const line = getLine(params.id);
    const title = line
      ? `Ветка «${line.name}» — Город Знаний`
      : "Ветка метро — Город Знаний";
    const description = line
      ? `${line.name} (${line.age}): легенда ветки и все станции — программы «Города Знаний».`
      : "Легенды веток образовательной карты «Города Знаний».";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ params }): { line: MetroLine } => {
    const line = getLine(params.id);
    if (!line) throw notFound();
    return { line };
  },
  component: LinePage,
});

function LinePage() {
  const { line } = Route.useLoaderData() as { line: MetroLine };
  const others = METRO_LINES.filter((l) => l.id !== line.id);
  const [lead, ...rest] = line.legend;
  const stationCount = line.stations.length;
  const programCount = line.stations.reduce((a, s) => a + s.programs.length, 0);

  return (
    <>
      <style>{styles}</style>
      <main
        className="lp-page"
        style={
          {
            "--line": line.color,
            "--line-soft": `${line.color}22`,
          } as React.CSSProperties
        }
      >
        {/* Hero */}
        <header className="lp-hero">
          <div className="lp-hero-inner">
            <Link to="/" className="lp-back">← К схеме метро</Link>
            <div className="lp-badge">
              <span className="lp-dot" />
              Ветка образовательной карты
            </div>
            <h1 className="lp-title">«{line.name}»</h1>
            <p className="lp-tagline">{line.age} · {stationCount} станций · {programCount} программ</p>
            {lead && <p className="lp-lead">{lead}</p>}
            <div className="lp-cta-row">
              <a href="#line-form" className="lp-btn lp-btn-primary">
                🎁 Записаться на пробное
              </a>
              <a href="tel:+74999385858" className="lp-btn lp-btn-ghost">
                📞 Получить консультацию
              </a>
            </div>
          </div>
          <div className="lp-hero-rail" aria-hidden="true">
            {line.stations.map((s) => (
              <span key={s.name} className="lp-rail-stop" title={s.name} />
            ))}
          </div>
        </header>

        {/* Легенда */}
        <section className="lp-section">
          <div className="lp-section-head">
            <h2 className="lp-h2">Легенда ветки</h2>
            <p className="lp-sub">История о том, как здесь живут и учатся</p>
          </div>
          <article className="lp-story">
            {rest.map((p, i) => (
              <p key={i} className={i === 0 ? "lp-p lp-p-first" : "lp-p"}>{p}</p>
            ))}
          </article>
        </section>

        {/* Станции */}
        <section className="lp-section">
          <div className="lp-section-head">
            <h2 className="lp-h2">Станции ветки</h2>
            <p className="lp-sub">Каждая станция — набор направлений и программ</p>
          </div>
          <div className="lp-stations">
            {line.stations.map((st, i) => (
              <article key={st.name} className="lp-station">
                <div className="lp-station-num">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="lp-station-title">{st.name}</h3>
                <ul className="lp-programs">
                  {st.programs.map((p) => (
                    <li key={p}>
                      <a href={`/p/${encodeURIComponent(p)}`} className="lp-prog">{p}</a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Как проходят занятия */}
        <section className="lp-section">
          <div className="lp-section-head">
            <h2 className="lp-h2">Как всё устроено</h2>
            <p className="lp-sub">Понятный формат для детей и родителей</p>
          </div>
          <div className="lp-facts">
            <Fact icon="👩‍🏫" label="Педагоги" value="Опытные наставники, а не «проверяющие»" />
            <Fact icon="👥" label="Формат" value="Группы до 8 человек или индивидуально" />
            <Fact icon="💻" label="Где" value="Очно в центре или онлайн" />
            <Fact icon="🎯" label="Подход" value="Свой темп, без сравнений и давления" />
          </div>
        </section>

        {/* CTA */}
        <section className="lp-final" id="line-form">
          <div className="lp-final-card">
            <div className="lp-final-emoji">🚂</div>
            <h2 className="lp-final-title">Поехали по ветке «{line.name}»?</h2>
            <p className="lp-final-sub">
              Запишитесь на пробное занятие — познакомимся, подберём станцию
              и составим маршрут именно для вашего ребёнка.
            </p>
            <div className="lp-alfa-form">
              <iframe
                src="https://gorodznaniy.s20.online/common/1/form/draw?id=7&baseColor=205EDC&borderRadius=8&css=%2F%2Fcdn.alfacrm.pro%2Flead-form%2Fform.css"
                title="Записаться на пробное занятие"
                loading="lazy"
                style={{
                  width: "100%",
                  minHeight: 640,
                  border: 0,
                  borderRadius: 20,
                  display: "block",
                  background: "#fff",
                }}
              />
            </div>
            <div className="lp-cta-row lp-cta-center" style={{ marginTop: 18 }}>
              <a href="tel:+74999385858" className="lp-btn lp-btn-ghost lp-btn-lg">
                📞 +7 499 938 58 58
              </a>
            </div>
          </div>
        </section>

        {/* Другие ветки */}
        <section className="lp-section">
          <div className="lp-section-head">
            <h2 className="lp-h2">Другие ветки города</h2>
            <p className="lp-sub">Пересадка на соседний маршрут</p>
          </div>
          <div className="lp-others">
            {others.map((l) => (
              <Link
                key={l.id}
                to="/line/$id"
                params={{ id: l.id }}
                className="lp-other"
                style={{ borderColor: `${l.color}55` }}
              >
                <span className="lp-other-dot" style={{ background: l.color }} />
                <span className="lp-other-name">{l.name}</span>
                <span className="lp-other-age">{l.age}</span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="lp-footer">
          <Link to="/" className="lp-back">← Вернуться на карту курсов</Link>
          <span className="lp-footer-tel">+7 499 938 58 58</span>
        </footer>
      </main>
    </>
  );
}

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="lp-fact">
      <div className="lp-fact-icon">{icon}</div>
      <div>
        <div className="lp-fact-label">{label}</div>
        <div className="lp-fact-value">{value}</div>
      </div>
    </div>
  );
}

const styles = `
  .lp-page {
    --ink: #2F3440;
    --ink-soft: #6B6B7B;
    font-family: 'Quicksand', 'Montserrat', system-ui, sans-serif;
    color: var(--ink);
    background:
      radial-gradient(1200px 700px at 10% -10%, var(--line-soft), transparent 60%),
      linear-gradient(180deg, #FFFFFF 0%, #F6FAFF 40%, #EEF4FF 100%);
    min-height: 100vh;
    padding-bottom: 60px;
  }
  .lp-page a { text-decoration: none; }

  .lp-hero {
    position: relative;
    overflow: hidden;
    padding: 34px 20px 64px;
    background: linear-gradient(135deg, var(--line) 0%, color-mix(in srgb, var(--line) 55%, #FFFFFF) 100%);
    border-bottom-left-radius: 48px;
    border-bottom-right-radius: 48px;
    box-shadow: 0 24px 60px -30px rgba(0,0,0,.35);
  }
  .lp-hero-inner { max-width: 900px; margin: 0 auto; position: relative; z-index: 2; }
  .lp-back {
    display: inline-block; color: #fff; font-weight: 700; opacity: .9;
    background: rgba(255,255,255,.18); padding: 8px 16px; border-radius: 999px;
    backdrop-filter: blur(4px);
  }
  .lp-back:hover { opacity: 1; }
  .lp-badge {
    display: inline-flex; align-items: center; gap: 8px; margin-top: 22px;
    background: rgba(255,255,255,.85); color: var(--ink);
    font-weight: 700; font-size: .85rem; padding: 7px 14px; border-radius: 999px;
  }
  .lp-dot { width: 10px; height: 10px; border-radius: 999px; background: var(--line); }
  .lp-title {
    font-family: 'Montserrat', sans-serif; font-weight: 900; color: #fff;
    font-size: clamp(2.2rem, 7vw, 4rem); line-height: 1.05; margin: 14px 0 6px;
    text-shadow: 0 6px 20px rgba(0,0,0,.18);
  }
  .lp-tagline { color: rgba(255,255,255,.95); font-weight: 700; margin: 0 0 18px; }
  .lp-lead {
    background: rgba(255,255,255,.92); border-radius: 24px; padding: 18px 22px;
    font-size: 1.05rem; line-height: 1.65; margin: 0 0 22px;
    box-shadow: 0 18px 40px -26px rgba(0,0,0,.5);
  }
  .lp-cta-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .lp-cta-center { justify-content: center; }
  .lp-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-weight: 800; border-radius: 999px; padding: 13px 24px;
    transition: transform .18s ease, box-shadow .18s ease;
  }
  .lp-btn:hover { transform: translateY(-2px) scale(1.02); }
  .lp-btn-primary { background: #fff; color: var(--ink); box-shadow: 0 14px 30px -16px rgba(0,0,0,.55); }
  .lp-btn-ghost { background: rgba(255,255,255,.2); color: #fff; border: 2px solid rgba(255,255,255,.7); }
  .lp-btn-lg { padding: 16px 30px; font-size: 1.05rem; }
  .lp-final .lp-btn-primary { background: var(--line); color: #fff; }
  .lp-final .lp-btn-ghost { background: #fff; color: var(--ink); border-color: var(--line); }

  .lp-hero-rail {
    position: absolute; left: 0; right: 0; bottom: 22px; height: 6px;
    background: rgba(255,255,255,.45); display: flex; align-items: center;
    justify-content: space-around; z-index: 1;
  }
  .lp-rail-stop {
    width: 16px; height: 16px; border-radius: 999px; background: #fff;
    box-shadow: 0 0 0 4px rgba(255,255,255,.35);
  }

  .lp-section { max-width: 1000px; margin: 0 auto; padding: 52px 20px 0; }
  .lp-section-head { text-align: center; margin-bottom: 26px; }
  .lp-h2 {
    font-family: 'Montserrat', sans-serif; font-weight: 900;
    font-size: clamp(1.5rem, 4vw, 2.2rem); color: var(--ink); margin: 0 0 6px;
  }
  .lp-sub { color: var(--ink-soft); font-weight: 600; margin: 0; }

  .lp-story {
    background: #fff; border-radius: 32px; padding: 28px 26px;
    border: 3px solid var(--line-soft);
    box-shadow: 0 28px 60px -40px rgba(31,41,55,.6);
  }
  .lp-p { margin: 0 0 16px; line-height: 1.8; font-size: 1.02rem; color: #3C4250; }
  .lp-p:last-child { margin-bottom: 0; }
  .lp-p-first::first-letter {
    float: left; font-family: 'Montserrat', sans-serif; font-weight: 900;
    font-size: 3.2rem; line-height: .9; padding: 6px 12px 0 0; color: var(--line);
  }

  .lp-stations { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .lp-station {
    position: relative; background: #fff; border-radius: 26px; padding: 22px 20px 20px;
    border-left: 10px solid var(--line);
    box-shadow: 0 22px 46px -34px rgba(31,41,55,.7);
    transition: transform .2s ease;
  }
  .lp-station:hover { transform: translateY(-4px); }
  .lp-station-num {
    font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: .9rem;
    color: var(--line); letter-spacing: .08em;
  }
  .lp-station-title { font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 1.2rem; margin: 4px 0 12px; }
  .lp-programs { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .lp-prog {
    display: inline-block; background: var(--line-soft); color: #37404F;
    font-weight: 700; font-size: .88rem; padding: 7px 13px; border-radius: 999px;
    transition: background .18s ease, color .18s ease;
  }
  .lp-prog:hover { background: var(--line); color: #fff; }

  .lp-facts { display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .lp-fact {
    display: flex; gap: 14px; align-items: center; background: #fff;
    border-radius: 22px; padding: 18px; border: 2px solid #EEF2FA;
  }
  .lp-fact-icon { font-size: 1.8rem; }
  .lp-fact-label { font-weight: 800; color: var(--line); font-size: .85rem; text-transform: uppercase; letter-spacing: .04em; }
  .lp-fact-value { font-weight: 600; color: #3C4250; }

  .lp-final { max-width: 1000px; margin: 56px auto 0; padding: 0 20px; }
  .lp-final-card {
    text-align: center; background: #fff; border-radius: 36px; padding: 40px 24px;
    border: 4px solid var(--line-soft);
    box-shadow: 0 34px 70px -46px rgba(31,41,55,.75);
  }
  .lp-final-emoji { font-size: 2.6rem; }
  .lp-final-title { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: clamp(1.4rem, 4vw, 2rem); margin: 8px 0; }
  .lp-final-sub { color: var(--ink-soft); max-width: 620px; margin: 0 auto 22px; line-height: 1.7; font-weight: 600; }
  .lp-alfa-form { max-width: 560px; margin: 0 auto 14px; border-radius: 24px; overflow: hidden; box-shadow: 0 14px 40px -24px rgba(31,41,55,.35); }

  .lp-others { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); }
  .lp-other {
    display: flex; align-items: center; gap: 10px; background: #fff;
    border: 3px solid #EEF2FA; border-radius: 999px; padding: 12px 18px;
    color: var(--ink); font-weight: 700; transition: transform .18s ease;
  }
  .lp-other:hover { transform: translateY(-3px); }
  .lp-other-dot { width: 14px; height: 14px; border-radius: 999px; }
  .lp-other-age { margin-left: auto; font-size: .8rem; color: var(--ink-soft); font-weight: 600; }

  .lp-footer {
    max-width: 1000px; margin: 48px auto 0; padding: 0 20px;
    display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .lp-footer .lp-back { background: var(--line); }
  .lp-footer-tel { font-weight: 800; color: var(--ink); }

  @media (max-width: 640px) {
    .lp-hero { padding: 22px 16px 54px; }
    .lp-story { padding: 22px 18px; }
  }
`;

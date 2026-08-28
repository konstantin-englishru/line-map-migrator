import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTeacher, TEACHERS, type Teacher } from "@/lib/teachers-data";
import { useCmsRow, applyOverride } from "@/lib/cms";

export const Route = createFileRoute("/teacher/$id")({
  head: ({ params }) => {
    const t = getTeacher(params.id);
    const title = t ? `${t.name} — педагог «Города Знаний»` : "Педагог — Город Знаний";
    const description = t
      ? `${t.name}: ${t.role}. Опыт ${t.experience}, ученики ${t.ages}. Методика, подход и запись на бесплатное пробное занятие.`
      : "Педагоги учебного центра «Город Знаний».";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ params }): { teacher: Teacher } => {
    const teacher = getTeacher(params.id);
    if (!teacher) throw notFound();
    return { teacher };
  },
  component: TeacherPage,
});

function TeacherPage() {
  const { teacher: base } = Route.useLoaderData() as { teacher: Teacher };
  const cms = useCmsRow<Record<string, unknown>>("cms_teachers", "id", base.id);
  const t = applyOverride(base, cms, {
    name: "name",
    role: "position",
    photo: "image",
    quote: "short_description",
    about: "description",
    education: "education",
    experience: "experience",
    facts: "extra",
  });
  const others = TEACHERS.filter((x) => x.id !== t.id).slice(0, 6);

  return (
    <>
      <style>{styles}</style>
      <main className="tp" style={{ ["--c" as string]: t.color, ["--c-soft" as string]: `${t.color}1f` }}>
        <header className="tp-hero">
          <div className="tp-blob tp-blob-a" />
          <div className="tp-blob tp-blob-b" />
          <div className="tp-hero-inner">
            <a href="/" className="tp-back">← На главную</a>
            <div className="tp-hero-grid">
              <div className="tp-photo-wrap">
                <div className="tp-photo-ring" />
                <img src={t.photo} alt={t.name} className="tp-photo" width={320} height={320} />
                <span className="tp-photo-badge">{t.experience} опыта</span>
              </div>
              <div>
                <div className="tp-badge"><span className="tp-dot" />Педагог «Города Знаний»</div>
                <h1 className="tp-name">{t.name}</h1>
                <p className="tp-role">{t.role}</p>
                <div className="tp-chips">
                  {t.subjects.map((s) => <span key={s} className="tp-chip">{s}</span>)}
                </div>
                <div className="tp-cta-row">
                  <a href="/p/Записаться%20на%20пробное%20занятие" className="tp-btn tp-btn-primary">🎁 Записаться на пробное</a>
                  <a href="/p/Получить%20консультацию" className="tp-btn tp-btn-ghost">📞 Задать вопрос педагогу</a>
                </div>
              </div>
            </div>
            <div className="tp-stats">
              <div className="tp-stat"><b>{t.experience}</b><span>стаж преподавания</span></div>
              <div className="tp-stat"><b>{t.ages}</b><span>возраст учеников</span></div>
              <div className="tp-stat"><b>до 6</b><span>детей в группе</span></div>
              <div className="tp-stat"><b>1-е</b><span>занятие бесплатно</span></div>
            </div>
          </div>
        </header>

        <section className="tp-section">
          <div className="tp-wrap tp-two">
            <div className="tp-card">
              <h2 className="tp-h2">О педагоге</h2>
              <p className="tp-text">{t.about}</p>
              <p className="tp-text tp-muted">{t.education}</p>
            </div>
            <blockquote className="tp-quote">
              <span className="tp-quote-mark">“</span>
              {t.quote}
              <footer>— {t.name}</footer>
            </blockquote>
          </div>
        </section>

        <section className="tp-section tp-section-alt">
          <div className="tp-wrap">
            <h2 className="tp-h2 tp-center">Как проходят занятия</h2>
            <div className="tp-steps">
              {t.approach.map((a, i) => (
                <div className="tp-step" key={a}>
                  <span className="tp-step-num">{i + 1}</span>
                  <p>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="tp-section">
          <div className="tp-wrap tp-two">
            <div className="tp-card">
              <h2 className="tp-h2">Достижения и опыт</h2>
              <ul className="tp-list">
                {t.achievements.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
            <div className="tp-card tp-card-tint">
              <h2 className="tp-h2">Коротко</h2>
              <ul className="tp-list">
                {t.facts.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="tp-section tp-section-alt">
          <div className="tp-wrap">
            <h2 className="tp-h2 tp-center">Другие педагоги</h2>
            <div className="tp-others">
              {others.map((o) => (
                <a key={o.id} href={`/teacher/${o.id}`} className="tp-other" style={{ ["--c" as string]: o.color }}>
                  <img src={o.photo} alt={o.name} loading="lazy" width={72} height={72} />
                  <b>{o.name}</b>
                  <span>{o.role}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="tp-final">
          <div className="tp-wrap tp-center">
            <h2 className="tp-h2">Познакомьтесь лично</h2>
            <p className="tp-text">Приходите на бесплатное пробное занятие — покажем методику в деле и дадим честную обратную связь по ребёнку.</p>
            <div className="tp-cta-row tp-center-row">
              <a href="/p/Записаться%20на%20пробное%20занятие" className="tp-btn tp-btn-primary">📝 Записаться</a>
              <a href="tel:+74999385858" className="tp-btn tp-btn-ghost">+7 499 938 58 58</a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = `
.tp{font-family:'Montserrat',system-ui,sans-serif;color:#1F2A44;background:#fff;}
.tp-wrap{max-width:1100px;margin:0 auto;padding:0 20px;}
.tp-hero{position:relative;overflow:hidden;padding:28px 0 56px;background:linear-gradient(120deg,#FFE7AF 0%,#FFD2BC 25%,#F4BEC7 55%,#E8B8E3 80%,#D9C0F3 100%);}
.tp-hero-inner{position:relative;z-index:2;max-width:1100px;margin:0 auto;padding:0 20px;}
.tp-blob{position:absolute;border-radius:50%;filter:blur(60px);opacity:.55;}
.tp-blob-a{width:420px;height:420px;background:var(--c);top:-160px;right:-80px;}
.tp-blob-b{width:340px;height:340px;background:#fff;bottom:-160px;left:-60px;}
.tp-back{display:inline-block;margin-bottom:20px;font-weight:600;color:#1F2A44;text-decoration:none;background:rgba(255,255,255,.7);padding:8px 16px;border-radius:999px;}
.tp-back:hover{background:#fff;}
.tp-hero-grid{display:grid;gap:28px;align-items:center;}
@media(min-width:820px){.tp-hero-grid{grid-template-columns:320px 1fr;gap:44px;}}
.tp-photo-wrap{position:relative;width:260px;margin:0 auto;}
.tp-photo{width:260px;height:260px;border-radius:50%;object-fit:cover;border:8px solid #fff;box-shadow:0 22px 50px rgba(31,42,68,.22);position:relative;z-index:2;}
.tp-photo-ring{position:absolute;inset:-14px;border-radius:50%;border:3px dashed var(--c);animation:tp-spin 24s linear infinite;}
@keyframes tp-spin{to{transform:rotate(360deg);}}
.tp-photo-badge{position:absolute;z-index:3;bottom:6px;left:50%;transform:translateX(-50%);background:var(--c);color:#fff;font-weight:700;font-size:13px;padding:7px 16px;border-radius:999px;white-space:nowrap;box-shadow:0 8px 18px rgba(31,42,68,.2);}
.tp-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.75);padding:7px 15px;border-radius:999px;font-weight:700;font-size:13px;margin-bottom:14px;}
.tp-dot{width:9px;height:9px;border-radius:50%;background:var(--c);}
.tp-name{font-size:clamp(30px,5vw,50px);font-weight:900;line-height:1.05;margin:0 0 8px;}
.tp-role{font-size:18px;font-weight:600;opacity:.8;margin:0 0 16px;}
.tp-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px;}
.tp-chip{background:#fff;border:2px solid var(--c);color:#1F2A44;font-weight:600;font-size:13px;padding:6px 14px;border-radius:999px;}
.tp-cta-row{display:flex;flex-wrap:wrap;gap:12px;}
.tp-center-row{justify-content:center;}
.tp-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:999px;font-weight:800;text-decoration:none;transition:transform .18s ease,box-shadow .18s ease;}
.tp-btn:hover{transform:translateY(-3px);}
.tp-btn-primary{background:var(--c);color:#fff;box-shadow:0 12px 26px rgba(31,42,68,.22);}
.tp-btn-ghost{background:#fff;color:#1F2A44;box-shadow:0 8px 20px rgba(31,42,68,.12);}
.tp-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:34px;}
@media(min-width:820px){.tp-stats{grid-template-columns:repeat(4,1fr);}}
.tp-stat{background:rgba(255,255,255,.8);border-radius:20px;padding:16px;text-align:center;}
.tp-stat b{display:block;font-size:22px;font-weight:900;color:var(--c);}
.tp-stat span{font-size:13px;opacity:.75;}
.tp-section{padding:56px 0;}
.tp-section-alt{background:var(--c-soft);}
.tp-two{display:grid;gap:20px;}
@media(min-width:820px){.tp-two{grid-template-columns:1.4fr 1fr;}}
.tp-card{background:#fff;border-radius:26px;padding:28px;box-shadow:0 14px 34px rgba(31,42,68,.09);}
.tp-card-tint{background:linear-gradient(160deg,#fff,var(--c-soft));}
.tp-h2{font-size:clamp(22px,3vw,32px);font-weight:900;margin:0 0 14px;}
.tp-center{text-align:center;}
.tp-text{font-size:16px;line-height:1.7;margin:0 0 12px;}
.tp-muted{opacity:.7;font-size:15px;}
.tp-quote{position:relative;background:var(--c);color:#fff;border-radius:26px;padding:36px 28px 28px;font-size:19px;font-weight:600;line-height:1.55;margin:0;}
.tp-quote-mark{position:absolute;top:2px;left:20px;font-size:72px;opacity:.35;line-height:1;}
.tp-quote footer{margin-top:14px;font-size:14px;font-weight:700;opacity:.85;}
.tp-steps{display:grid;gap:16px;margin-top:24px;}
@media(min-width:820px){.tp-steps{grid-template-columns:repeat(2,1fr);}}
.tp-step{display:flex;gap:14px;align-items:flex-start;background:#fff;border-radius:22px;padding:20px;box-shadow:0 10px 26px rgba(31,42,68,.08);}
.tp-step p{margin:0;line-height:1.6;}
.tp-step-num{flex:none;width:38px;height:38px;border-radius:50%;background:var(--c);color:#fff;font-weight:900;display:grid;place-items:center;}
.tp-list{margin:0;padding-left:0;list-style:none;display:grid;gap:10px;}
.tp-list li{position:relative;padding-left:26px;line-height:1.6;}
.tp-list li:before{content:"✓";position:absolute;left:0;color:var(--c);font-weight:900;}
.tp-others{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:24px;}
@media(min-width:820px){.tp-others{grid-template-columns:repeat(3,1fr);}}
.tp-other{background:#fff;border-radius:22px;padding:18px;text-align:center;text-decoration:none;color:#1F2A44;box-shadow:0 10px 24px rgba(31,42,68,.08);transition:transform .18s ease;display:block;}
.tp-other:hover{transform:translateY(-4px);}
.tp-other img{width:72px;height:72px;border-radius:50%;object-fit:cover;border:4px solid var(--c);margin:0 auto 10px;display:block;}
.tp-other b{display:block;font-size:15px;}
.tp-other span{font-size:12px;opacity:.7;}
.tp-final{padding:64px 0;background:linear-gradient(120deg,#FFE7AF,#F4BEC7 55%,#D9C0F3);}
`;

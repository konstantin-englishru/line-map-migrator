import type { ReactNode } from "react";
import { useCmsBlocks } from "@/lib/site-cms";
import { useCmsSettings } from "@/lib/cms";

/**
 * Единый шаблон информационных страниц: общая шапка → контент → общий подвал.
 * Все тексты подвала и контакты берутся из админки (cms_settings / cms_blocks),
 * поэтому подвал одинаков на всех страницах, где используется этот шаблон.
 */

const NAV = [
  { href: "/history", label: "История компании" },
  { href: "/svedeniya", label: "Сведения об образовательной организации" },
  { href: "/media", label: "Фото/видео галерея" },
  { href: "/contacts", label: "Контакты" },
  { href: "/articles", label: "Полезные статьи" },
];

export function SiteHeader() {
  const s = useCmsSettings();
  const phone = s.phone || "+7 499 938 58 58";
  const phoneHref = "tel:" + (s.phone_href || phone).replace(/[^+\d]/g, "");
  return (
    <header className="sp-header">
      <a className="sp-brand" href="/">
        <img src="/GorodZnaniyLOGO.png" alt="Город Знаний" />
        <span>Город Знаний</span>
      </a>
      <nav className="sp-nav">
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>
      <a className="sp-phone" href={phoneHref}>
        {phone}
      </a>
    </header>
  );
}

export function SiteFooter() {
  const s = useCmsSettings();
  const socials = useCmsBlocks("footer_social");
  const bottom = useCmsBlocks("footer_bottom");
  const phone = s.phone || "+7 499 938 58 58";
  return (
    <footer className="sp-footer">
      <div className="sp-footer-grid">
        <div className="sp-fcard">
          <h5>{s.footer_depo_title || "Депо (Адрес)"}</h5>
          {(s.footer_depo_text || "ул. Ясеневая, д. 26\nм. Зябликово").split("\n").map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
        <div className="sp-fcard">
          <h5>{s.footer_contact_title || "Связь"}</h5>
          <p>
            <a href={"tel:" + (s.phone_href || phone).replace(/[^+\d]/g, "")}>{phone}</a>
          </p>
          {s.email && (
            <p>
              <a href={"mailto:" + s.email}>{s.email}</a>
            </p>
          )}
        </div>
        <div className="sp-fcard sp-fsocial">
          <h5>{s.footer_social_title || "Наш телеграф:"}</h5>
          <div className="sp-socials">
            {(socials.length
              ? socials
              : [
                  { id: "vk", title: "VK", url: s.vk_url || "#", image: null },
                  { id: "tg", title: "TG", url: s.telegram_url || "#", image: null },
                ]
            ).map((b) => (
              <a key={b.id} href={b.url || "#"} target="_blank" rel="noopener">
                {b.image ? <img src={b.image} alt={b.title ?? ""} /> : b.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="sp-footer-bottom">
        {(bottom.length
          ? bottom
          : [
              { id: "d1", title: "Сведения об образовательной организации", url: "/svedeniya" },
              { id: "d2", title: "Политика конфиденциальности", url: "/p/Политика%20конфиденциальности" },
            ]
        ).map((b) => (
          <a key={b.id} href={b.url || "#"}>
            {b.title}
          </a>
        ))}
        <a href="/legacy.html#accessibility" className="sp-a11y">
          Версия для слабовидящих
        </a>
      </div>
      <p className="sp-copy">© 2026 Город Знаний. Следующая станция — Успех!</p>
    </footer>
  );
}

export function SitePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="sp-root">
      <style>{SITE_CSS}</style>
      <SiteHeader />
      <main className="sp-main">
        <h1 className="sp-title">{title}</h1>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

const SITE_CSS = `
.sp-root{min-height:100vh;display:flex;flex-direction:column;background:#F3F8FF;color:#1F2937;font-family:'Montserrat',system-ui,sans-serif;}
.sp-header{display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding:14px 24px;background:#fff;box-shadow:0 2px 12px rgba(30,58,95,.08);position:sticky;top:0;z-index:20;}
.sp-brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px;color:#1E3A5F;text-decoration:none;}
.sp-brand img{width:44px;height:44px;object-fit:contain;}
.sp-nav{display:flex;gap:8px;flex-wrap:wrap;flex:1;}
.sp-nav a{font-size:13px;font-weight:700;color:#1F2937;text-decoration:none;background:#F3F8FF;padding:8px 12px;border-radius:12px;}
.sp-nav a:hover{background:#DFC7FF;}
.sp-phone{font-weight:800;color:#1E3A5F;text-decoration:none;background:#FFC2DA;padding:9px 14px;border-radius:12px;white-space:nowrap;}
.sp-main{flex:1;width:100%;max-width:1040px;margin:0 auto;padding:32px 20px 56px;}
.sp-title{font-size:clamp(28px,4vw,42px);font-weight:900;color:#1E3A5F;margin-bottom:24px;}
.sp-bubbles{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}
.sp-bubble{display:block;background:#fff;border:4px solid #fff;border-radius:28px;padding:20px 22px;box-shadow:0 8px 24px rgba(30,58,95,.08);text-decoration:none;color:inherit;transition:transform .2s;}
.sp-bubble:hover{transform:translateY(-3px);}
.sp-bubble h3{font-weight:800;font-size:18px;margin-bottom:6px;color:#1E3A5F;}
.sp-bubble p{font-size:15px;line-height:1.6;white-space:pre-wrap;}
.sp-text{background:#fff;border-radius:28px;padding:28px;box-shadow:0 8px 24px rgba(30,58,95,.08);font-size:16px;line-height:1.75;white-space:pre-wrap;}
.sp-media{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;}
.sp-media figure{background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 8px 24px rgba(30,58,95,.08);}
.sp-media img,.sp-media iframe,.sp-media video{width:100%;display:block;border:0;aspect-ratio:16/10;object-fit:cover;background:#000;}
.sp-media figcaption{padding:10px 14px;font-weight:700;font-size:14px;}
.sp-empty{opacity:.6;}
.sp-footer{background:linear-gradient(180deg,#1E3A5F 0%,#0F2540 100%);color:#E8F1FF;padding:40px 24px 24px;}
.sp-footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;max-width:1040px;margin:0 auto;}
.sp-fcard{background:#fff;color:#1F2937;border-radius:24px;padding:22px;}
.sp-fcard h5{font-weight:800;font-size:18px;margin-bottom:10px;color:#1E3A5F;}
.sp-fcard p{font-size:14px;font-weight:500;}
.sp-fcard a{color:inherit;text-decoration:none;}
.sp-socials{display:flex;gap:12px;flex-wrap:wrap;}
.sp-socials a{width:44px;height:44px;border-radius:999px;background:#DFC7FF;display:flex;align-items:center;justify-content:center;font-weight:800;color:#1F2937;text-decoration:none;overflow:hidden;}
.sp-socials img{width:26px;height:26px;object-fit:contain;}
.sp-footer-bottom{max-width:1040px;margin:32px auto 0;padding-top:20px;border-top:1px solid rgba(255,255,255,.2);display:flex;gap:20px;flex-wrap:wrap;justify-content:center;}
.sp-footer-bottom a{color:#E8F1FF;opacity:.75;font-size:14px;font-weight:500;text-decoration:none;}
.sp-footer-bottom a:hover{opacity:1;}
.sp-copy{text-align:center;margin-top:24px;font-size:13px;opacity:.5;}
`;

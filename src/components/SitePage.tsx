import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Единый шаблон информационных страниц.
 * Header и Footer НЕ дублируются: они подгружаются напрямую из /legacy.html
 * (та же самая разметка, стили и поведение, что на главной странице).
 * Контент страниц остаётся прежним (sp-* стили ниже).
 */

declare global {
  interface Window {
    tailwind?: unknown;
    openLineById?: (id: string) => boolean;
  }
}

const TW_CONFIG = {
  theme: {
    extend: {
      colors: {
        carBg: "#FFFBEF",
        skyBg: "#EFE6FB",
        pastelYellow: "#D6E85E",
        pastelMint: "#9EE07A",
        pastelPink: "#F79EC7",
        pastelLavender: "#B79BEA",
        textMain: "#3A3A3A",
        doorFrame: "#B7D6F0",
      },
      fontFamily: {
        heading: ["Fredoka", "sans-serif"],
        body: ["Quicksand", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
        "inner-window": "inset 0 4px 6px -1px rgba(0, 0, 0, 0.1), inset 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        cushion: "0 -4px 10px rgba(0,0,0,0.03), inset 0 4px 0 rgba(255,255,255,0.5)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulseSoft: { "0%, 100%": { opacity: 1, transform: "scale(1)" }, "50%": { opacity: 0.95, transform: "scale(0.98)" } },
      },
    },
  },
};

let chromePromise: Promise<{ header: string; mobileMenu: string; bumper: string; footer: string; styles: string }> | null = null;

function ensureTailwind() {
  if (document.getElementById("tw-play-cdn")) return;
  // Play CDN перезаписывает window.tailwind при загрузке, поэтому конфиг
  // назначаем сразу после выполнения скрипта (onload), как на главной.
  const s = document.createElement("script");
  s.id = "tw-play-cdn";
  s.src = "https://cdn.tailwindcss.com";
  s.onload = () => {
    (window.tailwind as { config?: unknown }).config = TW_CONFIG;
    // Форсируем пересборку стилей для уже вставленной разметки
    document.body.classList.add("tw-ready");
    setTimeout(() => document.body.classList.remove("tw-ready"), 50);
  };
  document.head.appendChild(s);
}

function ensureFonts() {
  if (document.getElementById("legacy-fonts")) return;
  const l = document.createElement("link");
  l.id = "legacy-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
}

function loadLegacyChrome() {
  if (!chromePromise) {
    ensureTailwind();
    ensureFonts();
    chromePromise = fetch("/legacy.html")
      .then((r) => r.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const header = doc.querySelector("header.site-header");
        const mobileMenu = doc.getElementById("mobile-menu");
        const footer = doc.querySelector("footer");
        const bumper = footer?.previousElementSibling;
        const styles = Array.from(doc.querySelectorAll("style"))
          .map((el) => el.textContent || "")
          .join("\n");
        return {
          header: header?.outerHTML || "",
          mobileMenu: mobileMenu?.outerHTML || "",
          bumper: bumper?.outerHTML || "",
          footer: footer?.outerHTML || "",
          styles,
        };
      });
  }
  return chromePromise;
}

function useLegacyChrome() {
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Фолбэк для ссылок «Программы»: на главной открывается панель линии,
    // отсюда — переход на главную с авто-открытием той же панели.
    window.openLineById = (id: string) => {
      window.location.href = "/#line-" + id;
      return false;
    };
    loadLegacyChrome().then((c) => {
      if (cancelled || !headerRef.current || !footerRef.current) return;
      headerRef.current.innerHTML = c.header + c.mobileMenu;
      footerRef.current.innerHTML = c.bumper + c.footer;
      if (!document.getElementById("legacy-styles")) {
        const st = document.createElement("style");
        st.id = "legacy-styles";
        st.textContent = c.styles;
        document.head.appendChild(st);
      }
      // Клик по логотипу «Город Знаний» ведёт на главную (/), не затрагивая ссылку адреса
      const logo = headerRef.current.querySelector("header.site-header .cursor-pointer.group");
      const onLogoClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest?.("a") as HTMLAnchorElement | null;
        if (a) return; // адрес на Яндекс.Карты работает как раньше
        e.preventDefault();
        e.stopPropagation();
        window.location.href = "/";
      };
      logo?.addEventListener("click", onLogoClick);
      // Якорные ссылки главной (#callback-form и т.п.) ведут на главную
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href")!.slice(1);
        if (id && !document.getElementById(id)) {
          e.preventDefault();
          window.location.href = "/#" + id;
        }
      };
      document.addEventListener("click", onClick);
      setReady(true);
      return () => {
        document.removeEventListener("click", onClick);
        logo?.removeEventListener("click", onLogoClick);
      };
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { headerRef, footerRef, ready };
}

export function SitePage({ title, children }: { title: string; children: ReactNode }) {
  const { headerRef, footerRef, ready } = useLegacyChrome();
  return (
    <div className="sp-root">
      <style>{SITE_CSS}</style>
      <div className="sp-car">
        <div ref={headerRef} className="sp-chrome" aria-hidden={!ready} />
        <main className="sp-main">
          <h1 className="sp-title">{title}</h1>
          {children}
        </main>
        <div ref={footerRef} className="sp-chrome" aria-hidden={!ready} />
      </div>
    </div>
  );
}

const SITE_CSS = `
.sp-root{min-height:100vh;background:#DCE9FF;color:#1F2937;font-family:'Accuratist','Montserrat',system-ui,sans-serif;padding:0 8px;}
.sp-car{width:100%;max-width:1400px;margin:0 auto;background:#FFFBEF;border:8px solid #fff;border-radius:40px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 10px 25px -5px rgba(0,0,0,.05);}
@media(min-width:768px){.sp-car{border-radius:60px;}}
.sp-chrome:empty{min-height:0;}
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
`;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const adminStyles = `
.ad{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1F2A44;background:#F6F7FB;min-height:100vh;}
.ad-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:14px 20px;background:#fff;border-bottom:1px solid #E6E8F0;}
.ad-bar b{margin-right:14px;}
.ad-bar a{color:#1F2A44;text-decoration:none;padding:8px 14px;border-radius:999px;background:#F0F2F8;font-size:14px;}
.ad-bar a:hover{background:#E3E7F5;}
.ad-bar .ad-out{margin-left:auto;border:0;cursor:pointer;background:#FFE3E3;color:#A32222;padding:8px 14px;border-radius:999px;font-size:14px;}
.ad-wrap{max-width:900px;margin:0 auto;padding:24px 20px 60px;}
.ad-card{background:#fff;border:1px solid #E6E8F0;border-radius:14px;padding:18px;margin-bottom:14px;}
.ad-row{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EFF1F7;}
.ad-row:last-child{border-bottom:0;}
.ad-field{margin-bottom:14px;display:block;}
.ad-field span{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:#5A6478;}
.ad-input,.ad-textarea{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #D8DCEA;border-radius:10px;font:inherit;font-size:14px;background:#fff;}
.ad-textarea{min-height:110px;resize:vertical;}
.ad-btn{display:inline-block;border:0;cursor:pointer;background:#4A6BF3;color:#fff;padding:10px 18px;border-radius:10px;font-size:14px;text-decoration:none;}
.ad-btn:disabled{opacity:.6;cursor:default;}
.ad-btn-sec{background:#EDEFF7;color:#1F2A44;}
.ad-btn-del{background:#FFE3E3;color:#A32222;}
.ad-list-item{display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;}
.ad-list-item .ad-textarea{min-height:60px;}
.ad-msg{padding:10px 14px;border-radius:10px;background:#E7F7EC;color:#1B6B3A;margin-bottom:14px;font-size:14px;}
.ad-err{padding:10px 14px;border-radius:10px;background:#FFE3E3;color:#A32222;margin-bottom:14px;font-size:14px;}
.ad-mini{font-size:12px;color:#8A92A6;}
.ad-thumb{max-width:160px;border-radius:10px;display:block;margin-top:8px;}
`;

export function AdminNav() {
  const navigate = useNavigate();
  return (
    <div className="ad-bar">
      <b>Админ-панель</b>
      <Link to="/admin">Главная</Link>
      <Link to="/admin/$section" params={{ section: "lines" }}>Линии</Link>
      <Link to="/admin/$section" params={{ section: "stations" }}>Станции</Link>
      <Link to="/admin/$section" params={{ section: "teachers" }}>Преподаватели</Link>
      <Link to="/admin/$section" params={{ section: "settings" }}>Настройки</Link>
      <button
        className="ad-out"
        onClick={async () => {
          await supabase.auth.signOut();
          void navigate({ to: "/admin/login" });
        }}
      >
        Выйти
      </button>
    </div>
  );
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");

  useEffect(() => {
    let alive = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;
      if (!data.user) {
        void navigate({ to: "/admin/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!alive) return;
      setState(roles ? "ok" : "denied");
    })();
    return () => {
      alive = false;
    };
  }, [navigate]);

  return (
    <>
      <style>{adminStyles}</style>
      <div className="ad">
        {state === "ok" && <AdminNav />}
        <div className="ad-wrap">
          {state === "loading" && <p>Загрузка…</p>}
          {state === "denied" && (
            <div className="ad-err">
              У этой учётной записи нет прав администратора.{" "}
              <Link to="/admin/login">Войти под другой</Link>
            </div>
          )}
          {state === "ok" && children}
        </div>
      </div>
    </>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminStyles } from "@/components/admin/AdminGuard";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Вход в админ-панель — Город Знаний" },
      { name: "description", content: "Служебная страница входа в панель управления контентом сайта «Город Знаний»." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Вход в админ-панель — Город Знаний" },
      { property: "og:description", content: "Служебная страница входа в панель управления контентом." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setBusy(false);
      setErr(error.message);
      return;
    }
    await supabase.rpc("claim_admin");
    setBusy(false);
    void navigate({ to: "/admin" });
  };

  const createAdmin = async () => {
    setBusy(true);
    setErr("");
    setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setBusy(false);
      setErr(error.message);
      return;
    }
    const { data: claimed } = await supabase.rpc("claim_admin");
    setBusy(false);
    if (claimed) void navigate({ to: "/admin" });
    else setMsg("Учётная запись создана. Если требуется подтверждение почты — подтвердите и войдите.");
  };

  return (
    <>
      <style>{adminStyles}</style>
      <div className="ad">
        <div className="ad-wrap" style={{ maxWidth: 420 }}>
          <h1>Вход в админ-панель</h1>
          {err && <div className="ad-err">{err}</div>}
          {msg && <div className="ad-msg">{msg}</div>}
          <div className="ad-card">
            <label className="ad-field">
              <span>E-mail</span>
              <input className="ad-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="ad-field">
              <span>Пароль</span>
              <input className="ad-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button className="ad-btn" disabled={busy} onClick={() => void signIn()}>Войти</button>{" "}
            <button className="ad-btn ad-btn-sec" disabled={busy} onClick={() => void createAdmin()}>
              Создать администратора (первый вход)
            </button>
            <p className="ad-mini">Кнопка создания работает только пока администратор не назначен.</p>
          </div>
        </div>
      </div>
    </>
  );
}

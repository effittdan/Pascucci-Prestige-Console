import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Check, LoaderCircle, LogIn, Shield } from "lucide-react";
import { App } from "./App";
import logoUrl from "./assets/pp-logo-grad.png";
import { isSupabaseConfigured, supabase } from "./lib/supabase";

export function CommandCenterRoot() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!isSupabaseConfigured) return <App />;

  if (loading) {
    return (
      <div className="auth-screen">
        <LoaderCircle className="spin" size={32} />
        <p>Opening the Command Center…</p>
      </div>
    );
  }

  return session ? <App /> : <StaffLogin />;
}

function StaffLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setSending(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/command`,
        shouldCreateUser: true,
      },
    });

    setSending(false);
    setMessage(error ? error.message : "Check your email for your secure sign-in link.");
  };

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <img src={logoUrl} alt="Pascucci Prestige" />
        <span className="eyebrow">Staff access</span>
        <h1>PrestigeOS Command Center</h1>
        <p>Use your invited staff email to access fleet, customers, reservations, operations, and inspections.</p>
        <form onSubmit={sendMagicLink}>
          <label>
            Work email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@pascucciprestige.com"
              required
            />
          </label>
          <button className="primary-action" disabled={sending}>
            {sending ? <LoaderCircle className="spin" size={17} /> : <LogIn size={17} />}
            {sending ? "Sending link…" : "Email secure sign-in link"}
          </button>
        </form>
        {message && <div className="auth-message"><Check size={16} />{message}</div>}
        <div className="auth-security"><Shield size={16} /> Invitation-only staff access</div>
      </section>
    </main>
  );
}

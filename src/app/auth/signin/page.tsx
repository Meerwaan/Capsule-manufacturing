"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";

export default function SignInPage() {
  const [tab, setTab] = useState<"CLIENT" | "ADMIN">("CLIENT");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
      redirect: true,
    });
    if (res?.error) setError("Identifiants invalides.");
    setLoading(false);
  };

  const handleClientSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    const res = await signIn("email", {
      email,
      callbackUrl: "/client",
      redirect: false,
    });
    
    if (res?.error) {
      setError("Erreur lors de l'envoi du lien.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-charcoal-900)', padding: 'var(--space-4)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--color-charcoal-800)', padding: 'var(--space-10)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-charcoal-700)', boxShadow: 'var(--shadow-lg)' }}>
        
        <div style={{ display: 'flex', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-charcoal-700)' }}>
          <button 
            onClick={() => { setTab("CLIENT"); setError(""); setSuccess(false); }}
            style={{ flex: 1, padding: 'var(--space-3)', background: 'none', border: 'none', borderBottom: tab === "CLIENT" ? '2px solid var(--color-gold)' : '2px solid transparent', color: tab === "CLIENT" ? 'var(--color-gold)' : 'var(--color-charcoal-400)', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-sm)', transition: '0.2s' }}
          >
            Espace Client
          </button>
          <button 
            onClick={() => { setTab("ADMIN"); setError(""); setSuccess(false); }}
            style={{ flex: 1, padding: 'var(--space-3)', background: 'none', border: 'none', borderBottom: tab === "ADMIN" ? '2px solid var(--color-white)' : '2px solid transparent', color: tab === "ADMIN" ? 'var(--color-white)' : 'var(--color-charcoal-400)', cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-sm)', transition: '0.2s' }}
          >
            Atelier (Admin)
          </button>
        </div>

        <div style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
            {tab === "CLIENT" ? "Portail Marque" : "Accès Atelier"}
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)' }}>
            {tab === "CLIENT" ? "Connectez-vous pour suivre votre production." : "Pilotez l'usine."}
          </p>
        </div>

        {tab === "CLIENT" && (
          success ? (
            <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(39, 174, 96, 0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                Un lien magique vous a été envoyé par email !<br/><br/>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)' }}>(Check ton terminal console.log pour le test)</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleClientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <input
                  type="email"
                  required
                  style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-charcoal-500)', backgroundColor: 'var(--color-charcoal-900)', color: 'var(--color-white)', fontSize: 'var(--text-sm)', outline: 'none' }}
                  placeholder="Email de votre marque"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ marginTop: 'var(--space-2)', width: '100%', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-gold)', color: 'var(--color-charcoal-900)', fontWeight: 600, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: '0.2s' }}
              >
                {loading ? "Envoi en cours..." : "Recevoir mon lien de connexion"}
              </button>
            </form>
          )
        )}

        {tab === "ADMIN" && (
          <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <input
                type="email"
                required
                style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-charcoal-500)', backgroundColor: 'var(--color-charcoal-900)', color: 'var(--color-white)', fontSize: 'var(--text-sm)', outline: 'none' }}
                placeholder="Email Admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-charcoal-500)', backgroundColor: 'var(--color-charcoal-900)', color: 'var(--color-white)', fontSize: 'var(--text-sm)', outline: 'none' }}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', textAlign: 'center' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 'var(--space-2)', width: '100%', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-white)', color: 'var(--color-charcoal-900)', fontWeight: 600, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: '0.2s' }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

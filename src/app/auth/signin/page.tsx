"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/admin",
      redirect: true,
    });
    if (res?.error) setError("Identifiants invalides.");
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-charcoal-900)', padding: 'var(--space-4)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'var(--color-charcoal-800)', padding: 'var(--space-10)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-charcoal-700)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-white)', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
            Accès Atelier
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)' }}>
            Connectez-vous pour piloter votre production.
          </p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-charcoal-500)', backgroundColor: 'var(--color-charcoal-900)', color: 'var(--color-white)', fontSize: 'var(--text-sm)', outline: 'none' }}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-charcoal-500)', backgroundColor: 'var(--color-charcoal-900)', color: 'var(--color-white)', fontSize: 'var(--text-sm)', outline: 'none' }}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', textAlign: 'center', marginTop: 'var(--space-2)' }}>{error}</p>}

          <button
            type="submit"
            style={{ marginTop: 'var(--space-4)', width: '100%', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-white)', color: 'var(--color-charcoal-900)', fontWeight: 600, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

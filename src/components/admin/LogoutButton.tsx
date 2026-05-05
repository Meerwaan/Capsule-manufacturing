"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      style={{
        background: "none",
        border: "none",
        color: "var(--color-error, #e74c3c)",
        cursor: "pointer",
        fontSize: "var(--text-xs)",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        fontWeight: 600
      }}
    >
      Déconnexion
    </button>
  );
}

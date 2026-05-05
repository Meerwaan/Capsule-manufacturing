"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/client/client.module.css";

export default function PaymentButton({ quoteId }: { quoteId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Pour l'instant, on appelle l'API admin pour simuler le paiement. 
      // Dans une vraie app, on redirige vers Stripe Checkout ici.
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" })
      });

      if (!res.ok) throw new Error("Erreur lors du paiement");
      
      // On rafraîchit la page, le statut passera à PAID
      router.refresh();
      // On pourrait aussi rediriger vers /client/projects
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)', backgroundColor: 'rgba(196, 163, 90, 0.05)', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
      <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-gold)', marginBottom: 'var(--space-2)' }}>Paiement Sécurisé</h3>
      <p style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
        Votre devis est prêt. Vous pouvez procéder au paiement pour lancer la production immédiatement.
      </p>
      
      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-4)' }}>{error}</p>}
      
      <button 
        onClick={handlePayment} 
        disabled={loading}
        style={{ padding: 'var(--space-3) var(--space-8)', fontSize: 'var(--text-base)', backgroundColor: 'var(--color-gold)', color: 'var(--color-charcoal-900)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, width: '100%', maxWidth: '300px' }}
      >
        {loading ? "Traitement..." : "Payer par Carte Bancaire"}
      </button>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-400)', marginTop: 'var(--space-2)' }}>
        *Ceci est une simulation pour Capsule.
      </p>
    </div>
  );
}

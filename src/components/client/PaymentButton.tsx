"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/client/client.module.css";
import { CreditCard, ShieldCheck, Lock } from "lucide-react";

export default function PaymentButton({ quoteId }: { quoteId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" })
      });

      if (!res.ok) throw new Error("Erreur lors du paiement");
      
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.paymentBox}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        <div style={{ backgroundColor: 'rgba(196,163,90,0.1)', color: 'var(--color-gold)', padding: 'var(--space-4)', borderRadius: '50%' }}>
          <ShieldCheck size={32} />
        </div>
      </div>
      
      <h3 style={{ fontSize: '1.5rem', color: 'var(--color-white)', fontWeight: 400, marginBottom: 'var(--space-2)' }}>Confirmation & Paiement</h3>
      <p style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-base)', maxWidth: '500px', margin: '0 auto var(--space-8) auto', lineHeight: 1.5 }}>
        Le chiffrage est validé par notre atelier. Vous pouvez régler l'acompte par carte bancaire pour lancer immédiatement la préparation de votre collection.
      </p>
      
      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>{error}</p>}
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button 
          onClick={handlePayment} 
          disabled={loading}
          className={styles.primaryButton}
          style={{ width: '100%', maxWidth: '350px', padding: 'var(--space-4)', fontSize: '1.1rem' }}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: '16px', height: '16px', border: '2px solid var(--color-charcoal-900)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              Traitement Sécurisé...
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CreditCard size={20} /> Payer par Carte Bancaire
            </div>
          )}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-charcoal-400)', fontSize: 'var(--text-xs)' }}>
          <Lock size={12} />
          <span>Paiement crypté SSL. (Ceci est une simulation pour Capsule)</span>
        </div>
      </div>
    </div>
  );
}

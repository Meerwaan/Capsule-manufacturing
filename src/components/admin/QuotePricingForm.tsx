"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuotePricingForm({ 
  quoteId, 
  initialUnitPrice, 
  initialSetupFees, 
  initialLeadTime,
  quantity,
  status
}: { 
  quoteId: number;
  initialUnitPrice: number | null;
  initialSetupFees: number | null;
  initialLeadTime: string | null;
  quantity: number;
  status: string;
}) {
  const router = useRouter();
  const [unitPrice, setUnitPrice] = useState(initialUnitPrice?.toString() || "");
  const [setupFees, setSetupFees] = useState(initialSetupFees?.toString() || "");
  const [leadTime, setLeadTime] = useState(initialLeadTime || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValidate = async () => {
    if (!unitPrice || !leadTime) {
      setError("Veuillez renseigner le prix unitaire et le délai.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unitPrice: parseFloat(unitPrice),
          setupFees: setupFees ? parseFloat(setupFees) : 0,
          leadTime,
          status: "VALIDATED"
        })
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefuse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" })
      });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentUnitPrice = parseFloat(unitPrice) || 0;
  const currentSetupFees = parseFloat(setupFees) || 0;
  const total = (currentUnitPrice * quantity) + currentSetupFees;

  const isLocked = status === "VALIDATED" || status === "REJECTED";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)' }}>Prix Unitaire HT (€)</label>
          <input 
            type="number" 
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            disabled={isLocked || loading}
            style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-charcoal-900)', border: '1px solid var(--color-charcoal-700)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: 'var(--text-sm)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)' }}>Frais Techniques HT (€)</label>
          <input 
            type="number" 
            step="0.01"
            value={setupFees}
            onChange={(e) => setSetupFees(e.target.value)}
            disabled={isLocked || loading}
            style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-charcoal-900)', border: '1px solid var(--color-charcoal-700)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: 'var(--text-sm)', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)' }}>Délai estimé (ex: 4-6 semaines)</label>
          <input 
            type="text" 
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            disabled={isLocked || loading}
            style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-charcoal-900)', border: '1px solid var(--color-charcoal-700)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: 'var(--text-sm)', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(196, 163, 90, 0.05)', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>Total Estimé</p>
        <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-white)', fontFamily: 'monospace' }}>
          {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)', marginTop: 'var(--space-1)' }}>
          Soit {quantity} PCS × {currentUnitPrice}€ + {currentSetupFees}€ (Frais)
        </p>
      </div>

      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>{error}</p>}

      {!isLocked && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <button 
            onClick={handleRefuse}
            disabled={loading}
            style={{ flex: 1, padding: 'var(--space-3)', backgroundColor: 'var(--color-charcoal-800)', border: '1px solid var(--color-charcoal-700)', color: 'var(--color-white)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: '0.2s' }}
          >
            Refuser
          </button>
          <button 
            onClick={handleValidate}
            disabled={loading}
            style={{ flex: 2, padding: 'var(--space-3)', backgroundColor: 'var(--color-gold)', border: 'none', color: 'var(--color-charcoal-900)', fontWeight: 600, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: '0.2s' }}
          >
            Valider le Devis & Informer
          </button>
        </div>
      )}
      
      {isLocked && (
        <div style={{ padding: 'var(--space-4)', backgroundColor: status === "VALIDATED" ? 'rgba(39, 174, 96, 0.1)' : 'rgba(192, 57, 43, 0.1)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <p style={{ color: status === "VALIDATED" ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
            Ce devis a été {status === "VALIDATED" ? "validé" : "refusé"}.
          </p>
        </div>
      )}
    </div>
  );
}

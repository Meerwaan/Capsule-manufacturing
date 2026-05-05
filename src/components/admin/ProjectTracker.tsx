"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = [
  { value: "QUOTE_VALIDATED", label: "Devis Validé (Attente Lancement)" },
  { value: "AWAITING_MATERIAL", label: "En attente des matières" },
  { value: "MATERIAL_RECEIVED", label: "Matières reçues (Prêt à couper)" },
  { value: "CUTTING", label: "En cours de Coupe" },
  { value: "SEWING", label: "En cours de Couture" },
  { value: "QUALITY_CHECK", label: "Contrôle Qualité" },
  { value: "READY_TO_SHIP", label: "Prêt à expédier" },
  { value: "SHIPPED", label: "Expédié" },
  { value: "DELIVERED", label: "Livré" }
];

export default function ProjectTracker({ 
  projectId, 
  currentStatus 
}: { 
  projectId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Erreur de mise à jour");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>{error}</p>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {STATUSES.map((status, index) => {
          const isCurrent = currentStatus === status.value;
          const currentIndex = STATUSES.findIndex(s => s.value === currentStatus);
          const isPast = index < currentIndex;
          
          return (
            <div 
              key={status.value}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-4)',
                padding: 'var(--space-3)',
                backgroundColor: isCurrent ? 'rgba(196, 163, 90, 0.1)' : (isPast ? 'rgba(255,255,255,0.02)' : 'transparent'),
                border: isCurrent ? '1px solid var(--color-gold)' : '1px solid var(--color-charcoal-800)',
                borderRadius: 'var(--radius-sm)',
                opacity: (isPast || isCurrent) ? 1 : 0.5
              }}
            >
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: isCurrent ? 'var(--color-gold)' : (isPast ? 'var(--color-success)' : 'var(--color-charcoal-700)')
              }} />
              <div style={{ flex: 1, fontSize: 'var(--text-sm)', color: isCurrent ? 'var(--color-gold)' : 'var(--color-white)', fontWeight: isCurrent ? 600 : 400 }}>
                {status.label}
              </div>
              {!isCurrent && !isPast && index === currentIndex + 1 && (
                <button 
                  onClick={() => handleStatusChange(status.value)}
                  disabled={loading}
                  style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-xs)', backgroundColor: 'var(--color-white)', color: 'var(--color-charcoal-900)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Passer à cette étape
                </button>
              )}
              {isCurrent && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Étape Actuelle
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/client/client.module.css";
import { MapPin, Edit2, Save, X } from "lucide-react";

export default function ShippingAddressForm({ 
  projectId, 
  initialAddress, 
  isEditable 
}: { 
  projectId: number, 
  initialAddress: string | null,
  isEditable: boolean 
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!initialAddress);
  const [address, setAddress] = useState(initialAddress || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!address.trim()) {
      setError("L'adresse ne peut pas être vide.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const res = await fetch(`/api/client/projects/${projectId}/address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: address.trim() })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }
      
      setSuccess(true);
      setIsEditing(false);
      router.refresh();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card} style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '1.1rem', color: 'var(--color-white)', fontWeight: 500 }}>
          <MapPin size={18} color="var(--color-gold)" /> 
          Adresse de livraison
        </h3>
        
        {isEditable && !isEditing && initialAddress && (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', background: 'none', border: 'none', color: 'var(--color-charcoal-400)', cursor: 'pointer', fontSize: 'var(--text-xs)' }}
          >
            <Edit2 size={14} /> Modifier
          </button>
        )}
      </div>

      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>{error}</p>}
      {success && <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>Adresse mise à jour avec succès.</p>}

      {isEditing ? (
        <div>
          <textarea 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nom complet / Société&#10;Numéro et Rue&#10;Code postal et Ville&#10;Pays&#10;Téléphone"
            style={{
              width: '100%',
              minHeight: '100px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--color-gold)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)',
              color: 'var(--color-white)',
              fontSize: 'var(--text-sm)',
              resize: 'vertical',
              fontFamily: 'inherit',
              marginBottom: 'var(--space-4)'
            }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className={styles.primaryButton}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)' }}
            >
              {loading ? "Sauvegarde..." : <><Save size={16} /> Enregistrer</>}
            </button>
            {initialAddress && (
              <button 
                onClick={() => { setIsEditing(false); setAddress(initialAddress); setError(""); }} 
                className={styles.actionButton}
                style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)' }}
              >
                <X size={16} /> Annuler
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ whiteSpace: 'pre-line', color: 'var(--color-charcoal-200)', lineHeight: 1.6, fontSize: 'var(--text-sm)' }}>
            {initialAddress || "Aucune adresse renseignée."}
          </p>
        </div>
      )}
    </div>
  );
}

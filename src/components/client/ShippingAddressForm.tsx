"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/client/client.module.css";
import { MapPin, Edit2, Save, X, User, Home, Map, Phone } from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    street: "",
    zip: "",
    city: "",
    country: "France",
    phone: ""
  });

  useEffect(() => {
    if (initialAddress) {
      const lines = initialAddress.split('\n');
      if (lines.length >= 5) {
        const zipCity = lines[2].split(' ');
        setFormData({
          name: lines[0],
          street: lines[1],
          zip: zipCity[0] || "",
          city: zipCity.slice(1).join(' ') || "",
          country: lines[3],
          phone: lines[4] || ""
        });
      } else {
        setFormData(prev => ({ ...prev, street: initialAddress }));
      }
    }
  }, [initialAddress]);

  const handleSave = async () => {
    if (!formData.name || !formData.street || !formData.zip || !formData.city) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    
    const formattedAddress = `${formData.name.trim()}
${formData.street.trim()}
${formData.zip.trim()} ${formData.city.trim()}
${formData.country.trim()}
${formData.phone.trim()}`;

    try {
      const res = await fetch(`/api/client/projects/${projectId}/address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: formattedAddress })
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

  const inputStyle = {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3)',
    color: 'var(--color-white)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-charcoal-300)',
    marginBottom: 'var(--space-2)',
    fontWeight: 500
  };

  return (
    <div className={styles.card} style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '1.2rem', color: 'var(--color-white)', fontWeight: 500 }}>
          <div style={{ backgroundColor: 'rgba(196,163,90,0.1)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)' }}>
            <MapPin size={20} color="var(--color-gold)" />
          </div>
          Adresse de livraison
        </h3>
        
        {isEditable && !isEditing && initialAddress && (
          <button 
            onClick={() => setIsEditing(true)}
            className={styles.actionButton}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <Edit2 size={14} /> Modifier
          </button>
        )}
      </div>

      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>{error}</p>}
      {success && <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', backgroundColor: 'rgba(39, 174, 96, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>Adresse mise à jour avec succès.</p>}

      {isEditing ? (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <div>
            <label style={labelStyle}>Nom complet ou Société *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--color-charcoal-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{...inputStyle, paddingLeft: '36px'}} placeholder="Ex: Capsule Manufacturing" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Numéro et Rue *</label>
            <div style={{ position: 'relative' }}>
              <Home size={16} color="var(--color-charcoal-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} style={{...inputStyle, paddingLeft: '36px'}} placeholder="Ex: 123 Avenue des Champs-Élysées" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={labelStyle}>Code Postal *</label>
              <input type="text" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} style={inputStyle} placeholder="Ex: 75008" />
            </div>
            <div>
              <label style={labelStyle}>Ville *</label>
              <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={inputStyle} placeholder="Ex: Paris" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={labelStyle}>Pays</label>
              <div style={{ position: 'relative' }}>
                <Map size={16} color="var(--color-charcoal-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} style={{...inputStyle, paddingLeft: '36px'}} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Téléphone</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--color-charcoal-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{...inputStyle, paddingLeft: '36px'}} placeholder="Ex: 06 12 34 56 78" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <button 
              onClick={handleSave} 
              disabled={loading}
              className={styles.primaryButton}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)' }}
            >
              {loading ? "Sauvegarde..." : <><Save size={18} /> Enregistrer l'adresse</>}
            </button>
            {initialAddress && (
              <button 
                onClick={() => { setIsEditing(false); setError(""); }} 
                className={styles.actionButton}
                style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)' }}
              >
                <X size={18} /> Annuler
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'grid', gap: 'var(--space-2)' }}>
          <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--color-white)' }}>{formData.name}</div>
          <div style={{ color: 'var(--color-charcoal-200)', fontSize: 'var(--text-sm)' }}>{formData.street}</div>
          <div style={{ color: 'var(--color-charcoal-200)', fontSize: 'var(--text-sm)' }}>{formData.zip} {formData.city}</div>
          <div style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-sm)' }}>{formData.country}</div>
          {formData.phone && <div style={{ color: 'var(--color-gold)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Phone size={14}/> {formData.phone}</div>}
        </div>
      )}
    </div>
  );
}

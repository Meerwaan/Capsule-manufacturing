"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../app/client/client.module.css";
import { CreditCard, ShieldCheck, Lock, MapPin, User, Home, Map, Phone } from "lucide-react";

export default function PaymentButton({ quoteId }: { quoteId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    zip: "",
    city: "",
    country: "France",
    phone: ""
  });

  const isFormValid = formData.name.trim() && formData.street.trim() && formData.zip.trim() && formData.city.trim();

  const handlePayment = async () => {
    if (!isFormValid) {
      setError("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }

    setLoading(true);
    setError("");
    
    const formattedAddress = `${formData.name.trim()}
${formData.street.trim()}
${formData.zip.trim()} ${formData.city.trim()}
${formData.country.trim()}
${formData.phone.trim()}`;

    try {
      const res = await fetch(`/api/client/quotes/${quoteId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: formattedAddress })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors du paiement");
      }
      
      router.refresh();
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
    <div className={styles.paymentBox}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
        <div style={{ backgroundColor: 'rgba(196,163,90,0.1)', color: 'var(--color-gold)', padding: 'var(--space-4)', borderRadius: '50%' }}>
          <ShieldCheck size={32} />
        </div>
      </div>
      
      <h3 style={{ fontSize: '1.5rem', color: 'var(--color-white)', fontWeight: 400, marginBottom: 'var(--space-2)' }}>Confirmation & Paiement</h3>
      <p style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-base)', maxWidth: '500px', margin: '0 auto var(--space-6) auto', lineHeight: 1.5 }}>
        Le chiffrage est validé par notre atelier. Renseignez votre adresse d'expédition puis réglez l'acompte pour lancer la préparation.
      </p>
      
      {error && <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>{error}</p>}
      
      <div style={{ maxWidth: '450px', margin: '0 auto var(--space-8) auto', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.02)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '1.1rem', color: 'var(--color-white)', marginBottom: 'var(--space-4)', fontWeight: 500 }}>
          <MapPin size={18} color="var(--color-gold)" /> Adresse de livraison de la production
        </h4>
        
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
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
        <button 
          onClick={handlePayment} 
          disabled={loading || !isFormValid}
          className={styles.primaryButton}
          style={{ width: '100%', maxWidth: '350px', padding: 'var(--space-4)', fontSize: '1.1rem', opacity: (!isFormValid || loading) ? 0.7 : 1 }}
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

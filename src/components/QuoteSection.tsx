"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./QuoteSection.module.css";

gsap.registerPlugin(ScrollTrigger);

type Step = 1 | 2 | 3 | 4;

type FormData = {
  product: string;
  complexity: string;
  material: string;
  grammage: string;
  quantity: number;
  hasPatron: string; // 'yes' | 'no' (factory needed)
  brandName: string;
  contactName: string;
  email: string;
  phone: string;
  notes: string;
  files: {
    patron?: string;
    schema?: string;
    techPack?: string;
  };
};

const PRODUCTS = [
  { id: "tshirt", label: "T-Shirt", pricePerUnit: 8, grammages: ["160g", "180g", "220g (Premium)", "240g (Heavy)"] },
  { id: "hoodie", label: "Hoodie", pricePerUnit: 14, grammages: ["280g", "320g", "400g (Heavy)", "450g (Ultra)"] },
  { id: "veste", label: "Veste Zippée", pricePerUnit: 18, grammages: ["280g", "320g", "400g", "Softshell"] },
];

const COMPLEXITIES = [
  { id: "basic", label: "Basique", desc: "Impression ou broderie simple, sans finitions spéciales", multiplier: 1 },
  { id: "intermediate", label: "Intermédiaire", desc: "Étiquettes personnalisées, délavage, surpiqûres", multiplier: 1.25 },
  { id: "advanced", label: "Complexe", desc: "Broderie multizone, sérigraphie, pièces rapportées", multiplier: 1.5 },
];

const MATERIALS = [
  { id: "cotton", label: "Coton 100%", desc: "Doux, respirant, standard" },
  { id: "recycled", label: "Coton recyclé", desc: "Eco-responsable, même qualité" },
  { id: "mix", label: "Mix Coton/Polyester", desc: "Résistant, léger" },
  { id: "other", label: "Autre (à préciser)", desc: "Matière client personnalisée" },
];

const QUANTITY_STEPS = [50, 100, 250, 500, 1000];

function getEstimate(data: FormData): { unitPrice: number; total: number; serviceFees: number } | null {
  const prod = PRODUCTS.find((p) => p.id === data.product);
  const comp = COMPLEXITIES.find((c) => c.id === data.complexity);
  if (!prod || !comp || data.quantity < 50) return null;

  const qty = data.quantity;
  const volumeDiscount = qty >= 500 ? 0.85 : qty >= 250 ? 0.9 : qty >= 100 ? 0.95 : 1;
  
  // Grammage impact (simple logic)
  let grammageMultiplier = 1;
  if (data.grammage.includes("Heavy") || data.grammage.includes("Ultra")) grammageMultiplier = 1.15;

  const unitPrice = parseFloat((prod.pricePerUnit * comp.multiplier * volumeDiscount * grammageMultiplier).toFixed(2));
  
  // Service fees: Pattern creation if not provided
  const serviceFees = data.hasPatron === "no" ? 150 : 0;
  
  const total = parseFloat((unitPrice * qty + serviceFees).toFixed(2));

  return { unitPrice, total, serviceFees };
}

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    product: "",
    complexity: "",
    material: "",
    grammage: "",
    quantity: 50,
    hasPatron: "",
    brandName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
    files: {},
  });

  const estimate = getEstimate(form);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".quote-heading", {
          y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".quote-heading", start: "top 85%" },
        });
        gsap.from(".quote-form", {
          y: 50, autoAlpha: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".quote-form", start: "top 80%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const updateForm = (key: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    if (step < 4) setStep((s) => (s + 1) as Step);
  };
  const goPrev = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedProductData = PRODUCTS.find(p => p.id === form.product);

  return (
    <section
      ref={sectionRef}
      id="devis"
      className={`section ${styles.section}`}
      aria-labelledby="quote-heading"
    >
      <div className="container">
        <div className={`quote-heading ${styles.header}`}>
          <p className={`text-label ${styles.eyebrow}`}>Configurateur industriel</p>
          <h2 id="quote-heading" className={`text-headline ${styles.title}`}>
            Lancez votre production en{" "}
            <em className={styles.accent}>4 étapes.</em>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            Un outil professionnel pour estimer votre coût de confection (CMT). 
            Plus votre dossier est complet, plus notre équipe sera réactive.
          </p>
        </div>

        {submitted ? (
          <div className={`quote-form ${styles.successCard}`} role="alert">
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h3 className={styles.successTitle}>Dossier reçu !</h3>
            <p className={styles.successBody}>
              Merci <strong>{form.contactName}</strong>. Notre bureau d&apos;études 
              analyse vos pièces. Vous recevrez un devis détaillé sous 24h.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => { setSubmitted(false); setStep(1); setForm({ product: "", complexity: "", material: "", grammage: "", quantity: 50, hasPatron: "", brandName: "", contactName: "", email: "", phone: "", notes: "", files: {} }); }}
              id="quote-reset"
            >
              Nouveau projet
            </button>
          </div>
        ) : (
          <div className={`quote-form ${styles.formWrapper}`}>
            {/* Progress */}
            <div className={styles.progress} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={4} aria-label={`Étape ${step} sur 4`}>
              {([1, 2, 3, 4] as Step[]).map((s) => (
                <div key={s} className={`${styles.progressStep} ${step >= s ? styles.progressActive : ""}`}>
                  <span className={styles.progressNumber}>{s}</span>
                  <span className={styles.progressLabel}>
                    {s === 1 ? "Produit" : s === 2 ? "Technique" : s === 3 ? "Atouts" : "Contact"}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* STEP 1 — Product */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Type de pièce à confectionner</h3>
                  <div role="radiogroup" aria-label="Sélectionner un produit" className={styles.optionGrid}>
                      {PRODUCTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={form.product === p.id}
                          className={`${styles.optionCard} ${form.product === p.id ? styles.optionSelected : ""}`}
                          onClick={() => updateForm("product", p.id)}
                          id={`product-${p.id}`}
                        >
                          <span className={styles.optionLabel}>{p.label}</span>
                          <span className={styles.optionHint}>CMT à partir de {p.pricePerUnit}€</span>
                        </button>
                      ))}
                    </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.product} id="step1-next">
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 — Technique */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Spécifications techniques</h3>

                  {/* Grammage */}
                  <div className={styles.field}>
                    <p className={styles.fieldLabel} id="grammage-label">Grammage du tissu souhaité</p>
                    <div role="radiogroup" aria-labelledby="grammage-label" className={styles.optionGrid}>
                      {selectedProductData?.grammages.map((g) => (
                        <button
                          key={g}
                          type="button"
                          role="radio"
                          aria-checked={form.grammage === g}
                          className={`${styles.optionCard} ${form.grammage === g ? styles.optionSelected : ""}`}
                          onClick={() => updateForm("grammage", g)}
                          id={`grammage-${g.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                          <span className={styles.optionLabel}>{g}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Complexity */}
                  <div className={styles.field}>
                    <p className={styles.fieldLabel} id="complexity-label">Niveau de finition</p>
                    <div role="radiogroup" aria-labelledby="complexity-label" className={styles.optionGrid}>
                      {COMPLEXITIES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          role="radio"
                          aria-checked={form.complexity === c.id}
                          className={`${styles.optionCard} ${form.complexity === c.id ? styles.optionSelected : ""}`}
                          onClick={() => updateForm("complexity", c.id)}
                          id={`complexity-${c.id}`}
                        >
                          <span className={styles.optionLabel}>{c.label}</span>
                          <span className={styles.optionHint}>{c.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="quantity-input">
                      Volume de production (PCS)
                    </label>
                    <div className={styles.quantityRow}>
                      {QUANTITY_STEPS.map((q) => (
                        <button
                          type="button"
                          key={q}
                          className={`${styles.qtyBtn} ${form.quantity === q ? styles.qtyBtnActive : ""}`}
                          onClick={() => updateForm("quantity", q)}
                          id={`qty-${q}`}
                        >
                          {q >= 1000 ? "1 000+" : q}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      id="quantity-input"
                      min={50}
                      max={10000}
                      value={form.quantity}
                      onChange={(e) => updateForm("quantity", parseInt(e.target.value) || 50)}
                      className={styles.quantityInput}
                    />
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev} id="step2-prev">← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.grammage || !form.complexity} id="step2-next">
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Atouts Techniques */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Dossier de production</h3>
                  <p className={styles.stepBody}>
                    Avez-vous déjà les patrons et fiches techniques ou devons-nous les créer ?
                  </p>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Possédez-vous un patron (file .dxf, .pdf) ?</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={form.hasPatron === "yes"}
                        className={`${styles.optionCard} ${form.hasPatron === "yes" ? styles.optionSelected : ""}`}
                        onClick={() => updateForm("hasPatron", "yes")}
                      >
                        <span className={styles.optionLabel}>Oui, je fournis le patron</span>
                        <span className={styles.optionHint}>Pas de frais de développement</span>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={form.hasPatron === "no"}
                        className={`${styles.optionCard} ${form.hasPatron === "no" ? styles.optionSelected : ""}`}
                        onClick={() => updateForm("hasPatron", "no")}
                      >
                        <span className={styles.optionLabel}>Non, création par Capsule</span>
                        <span className={styles.optionHint}>Frais de modélisme à prévoir</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Schéma / Tech Pack (Optionnel)</label>
                      <div className={styles.fileUpload}>
                        <input type="file" id="file-schema" className="sr-only" onChange={(e) => updateForm("files", { ...form.files, schema: e.target.files?.[0]?.name })} />
                        <label htmlFor="file-schema" className={styles.fileLabel}>
                          {form.files.schema || "Choisir un fichier…"}
                        </label>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Photo de référence (Optionnel)</label>
                      <div className={styles.fileUpload}>
                        <input type="file" id="file-photo" className="sr-only" onChange={(e) => updateForm("files", { ...form.files, patron: e.target.files?.[0]?.name })} />
                        <label htmlFor="file-photo" className={styles.fileLabel}>
                          {form.files.patron || "Choisir un fichier…"}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev} id="step3-prev">← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.hasPatron} id="step3-next">
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 — Contact */}
              {step === 4 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Informations professionnelles</h3>

                  <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="brand-name">Nom de la marque / Société *</label>
                      <input
                        type="text"
                        id="brand-name"
                        className={styles.input}
                        value={form.brandName}
                        onChange={(e) => updateForm("brandName", e.target.value)}
                        required
                        placeholder="Ex : Apparel Co."
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="contact-name">Interlocuteur *</label>
                      <input
                        type="text"
                        id="contact-name"
                        className={styles.input}
                        value={form.contactName}
                        onChange={(e) => updateForm("contactName", e.target.value)}
                        required
                        placeholder="Prénom Nom"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="email">Email professionnel *</label>
                      <input
                        type="email"
                        id="email"
                        className={styles.input}
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        required
                        placeholder="pro@marque.com"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="phone">Téléphone *</label>
                      <input
                        type="tel"
                        id="phone"
                        className={styles.input}
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        required
                        placeholder="+33 6 ..."
                      />
                    </div>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.fieldLabel} htmlFor="notes">Commentaires (matières, coloris, labels...)</label>
                      <textarea
                        id="notes"
                        className={`${styles.input} ${styles.textarea}`}
                        value={form.notes}
                        onChange={(e) => updateForm("notes", e.target.value)}
                        rows={3}
                        placeholder="Précisions sur votre projet industriel..."
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  {estimate && (
                    <div className={styles.summary}>
                      <p className={styles.summaryTitle}>Récapitulatif prévisionnel</p>
                      <ul className={styles.summaryList}>
                        <li><span>Produit</span><span>{selectedProductData?.label} ({form.grammage})</span></li>
                        <li><span>Volume</span><span>{form.quantity} pièces</span></li>
                        <li><span>Estimation CMT</span><span>{estimate.unitPrice}€/pcs</span></li>
                        {estimate.serviceFees > 0 && (
                          <li><span>Frais développement</span><span>{estimate.serviceFees}€ (Patronage)</span></li>
                        )}
                        <li><span>Total estimé HT</span><span>{estimate.total.toLocaleString("fr")}€</span></li>
                      </ul>
                      <p className={styles.estimateNote} style={{ marginTop: '0.5rem' }}>
                        * Estimation hors transport et matières premières. Validée après étude du dossier technique.
                      </p>
                    </div>
                  )}

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev} id="step4-prev">← Retour</button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!form.brandName || !form.contactName || !form.email || !form.phone}
                      id="quote-submit"
                    >
                      Transmettre le dossier
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

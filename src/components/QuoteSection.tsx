"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./QuoteSection.module.css";

gsap.registerPlugin(ScrollTrigger);

type Step = 1 | 2 | 3;

type FormData = {
  product: string;
  complexity: string;
  material: string;
  quantity: number;
  brandName: string;
  contactName: string;
  email: string;
  phone: string;
  notes: string;
};

const PRODUCTS = [
  { id: "tshirt", label: "T-Shirt", pricePerUnit: 8 },
  { id: "hoodie", label: "Hoodie", pricePerUnit: 14 },
  { id: "veste", label: "Veste Zippée", pricePerUnit: 18 },
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

function getEstimate(data: FormData): { unitPrice: number; total: number } | null {
  const prod = PRODUCTS.find((p) => p.id === data.product);
  const comp = COMPLEXITIES.find((c) => c.id === data.complexity);
  if (!prod || !comp || data.quantity < 50) return null;

  const qty = data.quantity;
  const volumeDiscount = qty >= 500 ? 0.85 : qty >= 250 ? 0.9 : qty >= 100 ? 0.95 : 1;
  const unitPrice = parseFloat((prod.pricePerUnit * comp.multiplier * volumeDiscount).toFixed(2));
  const total = parseFloat((unitPrice * qty).toFixed(2));

  return { unitPrice, total };
}

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>({
    product: "",
    complexity: "",
    material: "",
    quantity: 50,
    brandName: "",
    contactName: "",
    email: "",
    phone: "",
    notes: "",
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

  const updateForm = (key: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
  };
  const goPrev = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to API route → email notification
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="devis"
      className={`section ${styles.section}`}
      aria-labelledby="quote-heading"
    >
      <div className="container">
        <div className={`quote-heading ${styles.header}`}>
          <p className={`text-label ${styles.eyebrow}`}>Configurateur de devis</p>
          <h2 id="quote-heading" className={`text-headline ${styles.title}`}>
            Une estimation en{" "}
            <em className={styles.accent}>3 étapes.</em>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            Obtenez un prix estimatif immédiat. Notre équipe vous contactera dans
            les 24h pour valider votre projet et affiner le devis.
          </p>
        </div>

        {submitted ? (
          <div className={`quote-form ${styles.successCard}`} role="alert">
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h3 className={styles.successTitle}>Demande envoyée !</h3>
            <p className={styles.successBody}>
              Merci <strong>{form.contactName}</strong>. Notre équipe vous contactera
              sous 24h au {form.phone} ou par email à {form.email} pour finaliser
              votre devis.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => { setSubmitted(false); setStep(1); setForm({ product: "", complexity: "", material: "", quantity: 50, brandName: "", contactName: "", email: "", phone: "", notes: "" }); }}
              id="quote-reset"
            >
              Nouvelle demande
            </button>
          </div>
        ) : (
          <div className={`quote-form ${styles.formWrapper}`}>
            {/* Progress */}
            <div className={styles.progress} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Étape ${step} sur 3`}>
              {([1, 2, 3] as Step[]).map((s) => (
                <div key={s} className={`${styles.progressStep} ${step >= s ? styles.progressActive : ""}`}>
                  <span className={styles.progressNumber}>{s}</span>
                  <span className={styles.progressLabel}>
                    {s === 1 ? "Produit" : s === 2 ? "Détails" : "Contact"}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              {/* STEP 1 — Product */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Quel type de pièce souhaitez-vous confectionner ?</h3>
                  <fieldset className={styles.fieldset}>
                    <legend className="sr-only">Sélectionner un produit</legend>
                    <div className={styles.optionGrid}>
                      {PRODUCTS.map((p) => (
                        <label key={p.id} className={`${styles.optionCard} ${form.product === p.id ? styles.optionSelected : ""}`} htmlFor={`product-${p.id}`}>
                          <input
                            type="radio"
                            id={`product-${p.id}`}
                            name="product"
                            value={p.id}
                            checked={form.product === p.id}
                            onChange={(e) => updateForm("product", e.target.value)}
                            className="sr-only"
                          />
                          <span className={styles.optionLabel}>{p.label}</span>
                          <span className={styles.optionHint}>à partir de {p.pricePerUnit}€/pcs*</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.product} id="step1-next">
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 — Détails */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Précisez votre projet</h3>

                  {/* Complexity */}
                  <div className={styles.field}>
                    <p className={styles.fieldLabel} id="complexity-label">Complexité de confection</p>
                    <div className={styles.optionGrid} role="radiogroup" aria-labelledby="complexity-label">
                      {COMPLEXITIES.map((c) => (
                        <label key={c.id} className={`${styles.optionCard} ${form.complexity === c.id ? styles.optionSelected : ""}`} htmlFor={`complexity-${c.id}`}>
                          <input
                            type="radio"
                            id={`complexity-${c.id}`}
                            name="complexity"
                            value={c.id}
                            checked={form.complexity === c.id}
                            onChange={(e) => updateForm("complexity", e.target.value)}
                            className="sr-only"
                          />
                          <span className={styles.optionLabel}>{c.label}</span>
                          <span className={styles.optionHint}>{c.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Material */}
                  <div className={styles.field}>
                    <p className={styles.fieldLabel} id="material-label">Type de matière</p>
                    <div className={styles.optionGrid} role="radiogroup" aria-labelledby="material-label">
                      {MATERIALS.map((m) => (
                        <label key={m.id} className={`${styles.optionCard} ${form.material === m.id ? styles.optionSelected : ""}`} htmlFor={`material-${m.id}`}>
                          <input
                            type="radio"
                            id={`material-${m.id}`}
                            name="material"
                            value={m.id}
                            checked={form.material === m.id}
                            onChange={(e) => updateForm("material", e.target.value)}
                            className="sr-only"
                          />
                          <span className={styles.optionLabel}>{m.label}</span>
                          <span className={styles.optionHint}>{m.desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="quantity-input">
                      Quantité souhaitée
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
                      aria-label="Quantité précise"
                    />
                    <p className={styles.fieldHelper}>Minimum 50 pièces par coloris</p>
                  </div>

                  {/* Estimation */}
                  {estimate && (
                    <div className={styles.estimate} role="status" aria-live="polite">
                      <p className={styles.estimateLabel}>Estimation indicative</p>
                      <div className={styles.estimateValues}>
                        <div className={styles.estimateItem}>
                          <span className={styles.estimateValue}>{estimate.unitPrice}€</span>
                          <span className={styles.estimateUnit}>/ pièce</span>
                        </div>
                        <div className={styles.estimateDivider} aria-hidden="true" />
                        <div className={styles.estimateItem}>
                          <span className={styles.estimateValue}>{estimate.total.toLocaleString("fr")}€</span>
                          <span className={styles.estimateUnit}>total</span>
                        </div>
                      </div>
                      <p className={styles.estimateNote}>
                        * Hors matière première et transport. Devis final après échange avec notre équipe.
                      </p>
                    </div>
                  )}

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev} id="step2-prev">← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.complexity || !form.material} id="step2-next">
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Contact */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Vos coordonnées</h3>
                  <p className={styles.stepBody}>
                    Un membre de notre équipe vous appellera sous 24h pour affiner votre devis et valider votre projet.
                  </p>

                  <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="brand-name">Nom de votre marque *</label>
                      <input
                        type="text"
                        id="brand-name"
                        name="brandName"
                        className={styles.input}
                        value={form.brandName}
                        onChange={(e) => updateForm("brandName", e.target.value)}
                        required
                        autoComplete="organization"
                        placeholder="Ex : Brand Studio…"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="contact-name">Votre prénom et nom *</label>
                      <input
                        type="text"
                        id="contact-name"
                        name="contactName"
                        className={styles.input}
                        value={form.contactName}
                        onChange={(e) => updateForm("contactName", e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="Jean Dupont…"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="email">Adresse e-mail *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.input}
                        value={form.email}
                        onChange={(e) => updateForm("email", e.target.value)}
                        required
                        autoComplete="email"
                        spellCheck={false}
                        placeholder="jean@brand.com…"
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="phone">Numéro de téléphone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className={styles.input}
                        value={form.phone}
                        onChange={(e) => updateForm("phone", e.target.value)}
                        required
                        autoComplete="tel"
                        placeholder="+33 6 00 00 00 00…"
                      />
                      <p className={styles.fieldHelper}>Notre équipe vous rappellera à ce numéro</p>
                    </div>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.fieldLabel} htmlFor="notes">Notes complémentaires</label>
                      <textarea
                        id="notes"
                        className={`${styles.input} ${styles.textarea}`}
                        value={form.notes}
                        onChange={(e) => updateForm("notes", e.target.value)}
                        rows={3}
                        placeholder="Précisions sur votre projet, date de lancement, coloris souhaités..."
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  {estimate && (
                    <div className={styles.summary}>
                      <p className={styles.summaryTitle}>Récapitulatif</p>
                      <ul className={styles.summaryList}>
                        <li><span>Produit</span><span>{PRODUCTS.find(p => p.id === form.product)?.label}</span></li>
                        <li><span>Quantité</span><span>{form.quantity} pièces</span></li>
                        <li><span>Estimation confection</span><span>{estimate.unitPrice}€/pcs · {estimate.total.toLocaleString("fr")}€ total</span></li>
                      </ul>
                    </div>
                  )}

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev} id="step3-prev">← Retour</button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!form.brandName || !form.contactName || !form.email || !form.phone}
                      id="quote-submit"
                    >
                      Envoyer ma demande
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

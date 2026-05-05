"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./QuoteSection.module.css";

gsap.registerPlugin(ScrollTrigger);

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type FormData = {
  product: string;
  quantity: number;
  materialType: string;
  grammage: string;
  branding: string;
  brandingLocations: number;
  neckLabel: string;
  hangtag: string;
  packaging: string;
  hasPatron: string;
  wantsPrototype: string;
  files: {
    patron?: File;
    schema?: File;
  };
  brandName: string;
  contactName: string;
  email: string;
  phone: string;
  notes: string;
};

const PRODUCTS = [
  { 
    id: "tshirt", label: "T-Shirt", cmt: 9, moq: 50, 
    allowedMaterials: ["jersey", "interlock"],
    grammages: [
      { label: "Léger", desc: "130-150 g/m²" }, 
      { label: "Standard", desc: "160-200 g/m²" }, 
      { label: "Lourd (Heavy)", desc: "210-250 g/m²" }
    ] 
  },
  { 
    id: "hoodie", label: "Hoodie", cmt: 17, moq: 50, 
    allowedMaterials: ["molleton", "interlock", "velours"],
    grammages: [
      { label: "Standard", desc: "300-350 g/m²" }, 
      { label: "Lourd", desc: "400-450 g/m²" }, 
      { label: "Ultra Lourd", desc: "500-600 g/m²" }
    ] 
  },
  { 
    id: "veste", label: "Veste Zippée", cmt: 22, moq: 50, 
    allowedMaterials: ["molleton", "ripstop", "velours", "denim"],
    grammages: [
      { label: "Léger", desc: "250-280 g/m²" }, 
      { label: "Standard", desc: "300-350 g/m²" }, 
      { label: "Lourd", desc: "400-450 g/m²" }
    ] 
  },
  { 
    id: "jogging", label: "Pantalon / Jogging", cmt: 16, moq: 50, 
    allowedMaterials: ["molleton", "ripstop", "velours"],
    grammages: [
      { label: "Standard", desc: "300-350 g/m²" }, 
      { label: "Lourd", desc: "400-450 g/m²" }, 
      { label: "Ultra Lourd", desc: "500-600 g/m²" }
    ] 
  },
];

const MATERIALS = [
  { id: "jersey", label: "Jersey Coton", multiplier: 1, desc: "160–240 g/m² · GOTS · OEKO-TEX" },
  { id: "molleton", label: "Molleton Gratté", multiplier: 1.15, desc: "320–450 g/m² · OEKO-TEX" },
  { id: "interlock", label: "Interlock Double Face", multiplier: 1.2, desc: "200–280 g/m² · GOTS" },
  { id: "ripstop", label: "Ripstop Technique", multiplier: 1.25, desc: "120–180 g/m² · Europe" },
  { id: "velours", label: "Velours Côtelé", multiplier: 1.3, desc: "270–380 g/m² · OEKO-TEX" },
  { id: "denim", label: "Denim Selvedge", multiplier: 1.4, desc: "10–14 oz · Japon/Tunisie" },
];

const BRANDING = [
  { id: "vierge", label: "Vierge", pricePerLoc: 0, setupFee: 0, desc: "Aucun marquage, prêt à teindre" },
  { id: "serigraphie", label: "Sérigraphie", pricePerLoc: 1.5, setupFee: 40, desc: "Durable, idéal pour les séries" },
  { id: "dtg", label: "Impression DTG", pricePerLoc: 3.5, setupFee: 0, desc: "Couleurs illimitées, pas de frais techniques" },
  { id: "broderie", label: "Broderie", pricePerLoc: 2.5, setupFee: 30, desc: "Premium, texturé, inaltérable" },
  { id: "dtf", label: "Transfert DTF", pricePerLoc: 1.8, setupFee: 0, desc: "Haute définition, très extensible" },
];

const QUANTITY_STEPS = [50, 100, 250, 500, 1000];

function getEstimate(data: FormData) {
  const prod = PRODUCTS.find((p) => p.id === data.product);
  const mat = MATERIALS.find((m) => m.id === data.materialType);
  const brand = BRANDING.find((b) => b.id === data.branding);
  
  if (!prod || !mat || !brand || data.quantity < prod.moq) return null;

  const qty = data.quantity;
  const volumeDiscount = qty >= 1000 ? 0.8 : qty >= 500 ? 0.85 : qty >= 250 ? 0.9 : qty >= 100 ? 0.95 : 1;

  let unitPrice = prod.cmt * mat.multiplier * volumeDiscount;

  const locations = data.branding !== "vierge" ? data.brandingLocations : 0;
  unitPrice += brand.pricePerLoc * locations;

  if (data.neckLabel === "tisse") unitPrice += 0.4;
  if (data.neckLabel === "imprime") unitPrice += 0.3;
  if (data.hangtag === "oui") unitPrice += 0.5;
  if (data.packaging === "polybag") unitPrice += 0.2;
  if (data.packaging === "custom") unitPrice += 1.0;

  unitPrice = parseFloat(unitPrice.toFixed(2));

  let setupFees = brand.setupFee * locations;
  if (data.neckLabel === "tisse" && qty < 500) setupFees += 30; // Frais de matrice
  if (data.hasPatron === "non") setupFees += 150; // Frais de patronage
  if (data.wantsPrototype === "oui") setupFees += 80; // Frais de proto

  const total = parseFloat((unitPrice * qty + setupFees).toFixed(2));

  let leadTimeWeeks = qty >= 1000 ? 6 : qty >= 500 ? 5 : 4;
  if (data.wantsPrototype === "oui") leadTimeWeeks += 2;
  if (data.hasPatron === "non") leadTimeWeeks += 1;

  return { 
    unitPrice, 
    total, 
    setupFees, 
    leadTime: `${leadTimeWeeks} à ${leadTimeWeeks + 2} semaines`
  };
}

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    product: "",
    quantity: 50,
    materialType: "",
    grammage: "",
    branding: "",
    brandingLocations: 1,
    neckLabel: "",
    hangtag: "",
    packaging: "",
    hasPatron: "",
    wantsPrototype: "",
    files: {},
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

  const updateForm = (key: keyof FormData, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Ajustement dynamique du MOQ si le produit change
      if (key === "product") {
        const prod = PRODUCTS.find(p => p.id === value);
        if (prod && next.quantity < prod.moq) next.quantity = prod.moq;
        next.materialType = ""; // Reset material
        next.grammage = ""; // Reset grammage
      }
      return next;
    });
  };

  const goNext = () => {
    if (step < 6) setStep((s) => (s + 1) as Step);
    // Scroll au top du formulaire
    const formEl = document.getElementById('quote-form-top');
    if (formEl) {
      const y = formEl.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  const goPrev = () => {
    if (step > 1) setStep((s) => (s - 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Ajout de tous les champs texte/nombre
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "files") {
          formData.append(key, String(value));
        }
      });

      // Ajout de l'estimation
      formData.append("estimate", JSON.stringify(estimate));

      // Ajout des fichiers
      if (form.files.schema) formData.append("file-schema", form.files.schema);
      if (form.files.patron) formData.append("file-patron", form.files.patron);

      const response = await fetch("/api/quote", {
        method: "POST",
        body: formData, // On envoie le FormData directement
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const error = await response.json();
        alert(error.error || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Impossible d'envoyer le devis. Vérifiez votre connexion.");
    } finally {
      setIsSubmitting(false);
    }
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
            Estimez votre production en{" "}
            <em className={styles.accent}>6 étapes.</em>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            Un outil ultra-complet pour chiffrer précisément votre production CMT, incluant 
            les finitions, le packaging et les délais de confection.
          </p>
        </div>

        {submitted ? (
          <div className={`quote-form ${styles.successCard}`} role="alert">
            <div className={styles.successIcon} aria-hidden="true">✓</div>
            <h3 className={styles.successTitle}>Dossier reçu !</h3>
            <p className={styles.successBody}>
              Merci <strong>{form.contactName}</strong>. Votre dossier de production est entre les mains de nos experts. 
              Nous reviendrons vers vous sous 24h pour valider les spécificités techniques et 
              finaliser le devis avec vous avant règlement.
            </p>
            <button
              className="btn btn-outline"
              onClick={() => { window.location.reload(); }}
              id="quote-reset"
            >
              Nouveau projet
            </button>
          </div>
        ) : (
          <div className={`quote-form ${styles.formWrapper}`} id="quote-form-top">
            {/* Progress */}
            <div className={styles.progressWrapper}>
              <div className={styles.progress} role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={6} aria-label={`Étape ${step} sur 6`}>
                {([1, 2, 3, 4, 5, 6] as Step[]).map((s) => (
                  <div key={s} className={`${styles.progressStep} ${step >= s ? styles.progressActive : ""}`}>
                    <span className={styles.progressNumber}>{s}</span>
                    <span className={styles.progressLabel}>
                      {s === 1 ? "Produit" : s === 2 ? "Matière" : s === 3 ? "Marquage" : s === 4 ? "Finitions" : s === 5 ? "Technique" : "Contact"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              
              {/* STEP 1 — Product */}
              {step === 1 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Produit & Volumes</h3>
                  
                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Type de pièce à confectionner</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      {PRODUCTS.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          role="radio"
                          aria-checked={form.product === p.id}
                          className={`${styles.optionCard} ${form.product === p.id ? styles.optionSelected : ""}`}
                          onClick={() => updateForm("product", p.id)}
                        >
                          <span className={styles.optionLabel}>{p.label}</span>
                          <span className={styles.optionHint}>CMT à partir de {p.cmt}€</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="quantity-input">
                      Volume de production (PCS)
                    </label>
                    <p className={styles.fieldHelper}>MOQ actuel : {selectedProductData?.moq || 50} pièces.</p>
                    <div className={styles.quantityRow}>
                      {QUANTITY_STEPS.map((q) => {
                        const min = selectedProductData?.moq || 50;
                        if (q < min) return null;
                        return (
                          <button
                            type="button"
                            key={q}
                            className={`${styles.qtyBtn} ${form.quantity === q ? styles.qtyBtnActive : ""}`}
                            onClick={() => updateForm("quantity", q)}
                          >
                            {q >= 1000 ? "1 000+" : q}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="number"
                      id="quantity-input"
                      min={selectedProductData?.moq || 50}
                      max={10000}
                      value={form.quantity}
                      onChange={(e) => updateForm("quantity", parseInt(e.target.value) || 50)}
                      className={styles.quantityInput}
                    />
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.product}>
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 — Materials */}
              {step === 2 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Matières & Tissus</h3>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Type de matière</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      {MATERIALS.filter(m => selectedProductData?.allowedMaterials?.includes(m.id)).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          role="radio"
                          aria-checked={form.materialType === m.id}
                          className={`${styles.optionCard} ${form.materialType === m.id ? styles.optionSelected : ""}`}
                          onClick={() => updateForm("materialType", m.id)}
                        >
                          <span className={styles.optionLabel}>{m.label}</span>
                          <span className={styles.optionHint}>{m.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Grammage souhaité</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      {selectedProductData?.grammages.map((g) => (
                        <button
                          key={g.label}
                          type="button"
                          role="radio"
                          aria-checked={form.grammage === g.label}
                          className={`${styles.optionCard} ${form.grammage === g.label ? styles.optionSelected : ""}`}
                          onClick={() => updateForm("grammage", g.label)}
                        >
                          <span className={styles.optionLabel}>{g.label}</span>
                          <span className={styles.optionHint}>{g.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev}>← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.materialType || !form.grammage}>
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Branding */}
              {step === 3 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Marquage & Personnalisation</h3>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Technique d'impression ou broderie</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      {BRANDING.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          role="radio"
                          aria-checked={form.branding === b.id}
                          className={`${styles.optionCard} ${form.branding === b.id ? styles.optionSelected : ""}`}
                          onClick={() => {
                            updateForm("branding", b.id);
                            if (b.id === "vierge") updateForm("brandingLocations", 0);
                            else if (form.brandingLocations === 0) updateForm("brandingLocations", 1);
                          }}
                        >
                          <span className={styles.optionLabel}>{b.label}</span>
                          <span className={styles.optionHint}>{b.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.branding && form.branding !== "vierge" && (
                    <div className={styles.field}>
                      <p className={styles.fieldLabel}>Nombre d'emplacements (Cœur, Dos, Manche...)</p>
                      <div className={styles.quantityRow}>
                        {[1, 2, 3, 4].map((loc) => (
                          <button
                            type="button"
                            key={loc}
                            className={`${styles.qtyBtn} ${form.brandingLocations === loc ? styles.qtyBtnActive : ""}`}
                            onClick={() => updateForm("brandingLocations", loc)}
                          >
                            {loc} {loc === 1 ? "emplacement" : "emplacements"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev}>← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.branding}>
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4 — Finishings */}
              {step === 4 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Finitions & Packaging</h3>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Étiquette de Col (Neck Label)</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      <button type="button" role="radio" aria-checked={form.neckLabel === "aucune"} className={`${styles.optionCard} ${form.neckLabel === "aucune" ? styles.optionSelected : ""}`} onClick={() => updateForm("neckLabel", "aucune")}>
                        <span className={styles.optionLabel}>Aucune (Étiquette usine)</span>
                      </button>
                      <button type="button" role="radio" aria-checked={form.neckLabel === "imprime"} className={`${styles.optionCard} ${form.neckLabel === "imprime" ? styles.optionSelected : ""}`} onClick={() => updateForm("neckLabel", "imprime")}>
                        <span className={styles.optionLabel}>Imprimée (Sérigraphie)</span>
                      </button>
                      <button type="button" role="radio" aria-checked={form.neckLabel === "tisse"} className={`${styles.optionCard} ${form.neckLabel === "tisse" ? styles.optionSelected : ""}`} onClick={() => updateForm("neckLabel", "tisse")}>
                        <span className={styles.optionLabel}>Tissée (Cousue)</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Hangtag (Étiquette cartonnée)</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      <button type="button" role="radio" aria-checked={form.hangtag === "non"} className={`${styles.optionCard} ${form.hangtag === "non" ? styles.optionSelected : ""}`} onClick={() => updateForm("hangtag", "non")}>
                        <span className={styles.optionLabel}>Non</span>
                      </button>
                      <button type="button" role="radio" aria-checked={form.hangtag === "oui"} className={`${styles.optionCard} ${form.hangtag === "oui" ? styles.optionSelected : ""}`} onClick={() => updateForm("hangtag", "oui")}>
                        <span className={styles.optionLabel}>Oui (Fournie par vous ou usine)</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Conditionnement (Packaging)</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      <button type="button" role="radio" aria-checked={form.packaging === "vrac"} className={`${styles.optionCard} ${form.packaging === "vrac" ? styles.optionSelected : ""}`} onClick={() => updateForm("packaging", "vrac")}>
                        <span className={styles.optionLabel}>En vrac</span>
                      </button>
                      <button type="button" role="radio" aria-checked={form.packaging === "polybag"} className={`${styles.optionCard} ${form.packaging === "polybag" ? styles.optionSelected : ""}`} onClick={() => updateForm("packaging", "polybag")}>
                        <span className={styles.optionLabel}>Polybag transparent individuel</span>
                      </button>
                      <button type="button" role="radio" aria-checked={form.packaging === "custom"} className={`${styles.optionCard} ${form.packaging === "custom" ? styles.optionSelected : ""}`} onClick={() => updateForm("packaging", "custom")}>
                        <span className={styles.optionLabel}>Packaging personnalisé (Boîte/Pochon)</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev}>← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.neckLabel || !form.hangtag || !form.packaging}>
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5 — Tech */}
              {step === 5 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Développement & Technique</h3>
                  
                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Possédez-vous déjà un patronage ?</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      <button type="button" role="radio" aria-checked={form.hasPatron === "oui"} className={`${styles.optionCard} ${form.hasPatron === "oui" ? styles.optionSelected : ""}`} onClick={() => updateForm("hasPatron", "oui")}>
                        <span className={styles.optionLabel}>Oui, je fournis le patron (.dxf, .pdf)</span>
                        <span className={styles.optionHint}>Gain de temps, pas de frais de modélisme</span>
                      </button>
                      <button type="button" role="radio" aria-checked={form.hasPatron === "non"} className={`${styles.optionCard} ${form.hasPatron === "non" ? styles.optionSelected : ""}`} onClick={() => updateForm("hasPatron", "non")}>
                        <span className={styles.optionLabel}>Non, création par Capsule</span>
                        <span className={styles.optionHint}>Frais de modélisme à prévoir (+150€)</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Souhaitez-vous un prototype avant la production en série ?</p>
                    <div role="radiogroup" className={styles.optionGrid}>
                      <button type="button" role="radio" aria-checked={form.wantsPrototype === "oui"} className={`${styles.optionCard} ${form.wantsPrototype === "oui" ? styles.optionSelected : ""}`} onClick={() => updateForm("wantsPrototype", "oui")}>
                        <span className={styles.optionLabel}>Oui, avec validation physique</span>
                        <span className={styles.optionHint}>Recommandé (+80€, ajoute 2 semaines)</span>
                      </button>
                      <button type="button" role="radio" aria-checked={form.wantsPrototype === "non"} className={`${styles.optionCard} ${form.wantsPrototype === "non" ? styles.optionSelected : ""}`} onClick={() => updateForm("wantsPrototype", "non")}>
                        <span className={styles.optionLabel}>Non, production directe</span>
                        <span className={styles.optionHint}>Délais raccourcis</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Tech Pack / Dossier Technique (Optionnel)</label>
                      <div className={styles.fileUpload}>
                        <input
                          type="file"
                          id="file-schema"
                          className="sr-only"
                          onChange={(e) => updateForm("files", { ...form.files, schema: e.target.files?.[0] })}
                        />
                        <label htmlFor="file-schema" className={styles.fileLabel}>
                          {form.files.schema ? form.files.schema.name : "Choisir un fichier…"}
                        </label>
                      </div>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Fichiers Graphiques / Patron (Optionnel)</label>
                      <div className={styles.fileUpload}>
                        <input
                          type="file"
                          id="file-patron"
                          className="sr-only"
                          onChange={(e) => updateForm("files", { ...form.files, patron: e.target.files?.[0] })}
                        />
                        <label htmlFor="file-patron" className={styles.fileLabel}>
                          {form.files.patron ? form.files.patron.name : "Choisir un fichier…"}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev}>← Retour</button>
                    <button type="button" className="btn btn-primary" onClick={goNext} disabled={!form.hasPatron || !form.wantsPrototype}>
                      Étape suivante →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6 — Contact */}
              {step === 6 && (
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Informations & Estimation</h3>

                  <div className={styles.fieldsGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="brand-name">Nom de la marque / Société *</label>
                      <input type="text" id="brand-name" className={styles.input} value={form.brandName} onChange={(e) => updateForm("brandName", e.target.value)} required placeholder="Ex : Apparel Co." />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="contact-name">Interlocuteur *</label>
                      <input type="text" id="contact-name" className={styles.input} value={form.contactName} onChange={(e) => updateForm("contactName", e.target.value)} required placeholder="Prénom Nom" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="email">Email professionnel *</label>
                      <input type="email" id="email" className={styles.input} value={form.email} onChange={(e) => updateForm("email", e.target.value)} required placeholder="pro@marque.com" />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="phone">Téléphone *</label>
                      <input type="tel" id="phone" className={styles.input} value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} required placeholder="+33 6 ..." />
                    </div>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.fieldLabel} htmlFor="notes">Commentaires & Demandes spécifiques</label>
                      <textarea id="notes" className={`${styles.input} ${styles.textarea}`} value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} rows={3} placeholder="Précisions sur les couleurs, tailles, matières..." />
                    </div>
                  </div>

                  {/* Summary */}
                  {estimate && (
                    <div className={styles.summary}>
                      <p className={styles.summaryTitle}>Estimation Prévisionnelle (Ex-Works)</p>
                      <ul className={styles.summaryList}>
                        <li><span>Produit</span><span>{selectedProductData?.label} ({form.grammage || "Standard"})</span></li>
                        <li><span>Volume</span><span>{form.quantity} pièces</span></li>
                        <li>
                          <span>Prix Unitaire (CMT + Marquage + Finitions)</span>
                          <span>{estimate.unitPrice.toLocaleString("fr")} €/pcs</span>
                        </li>
                        {estimate.setupFees > 0 && (
                          <li>
                            <span>Frais Techniques Fixes (Proto, Cadres, Matrices)</span>
                            <span>{estimate.setupFees.toLocaleString("fr")} €</span>
                          </li>
                        )}
                        <li className={styles.summaryTotal}>
                          <span>Total Estimé HT</span>
                          <span>{estimate.total.toLocaleString("fr")} €</span>
                        </li>
                      </ul>
                      
                      <div className={styles.leadTimeBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <div>
                          <p className={styles.leadTimeLabel}>Délai de production estimé</p>
                          <p className={styles.leadTimeValue}>{estimate.leadTime}</p>
                        </div>
                      </div>

                      <p className={styles.estimateNote}>
                        * L'estimation exclut la matière première si non standard, ainsi que les frais de transport (discutés lors de la validation).
                      </p>
                    </div>
                  )}

                  <div className={styles.stepActions}>
                    <button type="button" className="btn btn-outline" onClick={goPrev}>← Retour</button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || !form.brandName || !form.contactName || !form.email || !form.phone}
                      id="quote-submit"
                    >
                      {isSubmitting ? "Envoi en cours..." : "Transmettre le dossier"}
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

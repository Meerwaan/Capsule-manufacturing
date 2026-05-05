"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServicesSection.module.css";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// SVG icons — no emojis (ui-ux-pro-max: no-emoji-icons)
function IconTshirt() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 8l6-4h12l6 4-4 4v14H8V12L4 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 4c0 3.314 2.686 5 6 5s6-1.686 6-5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function IconHoodie() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 9l5-5h1c0 3.866 2.686 6 6 6s6-2.134 6-6h1l5 5-3 5H6L4 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 9v17h24V9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M14 10v16M18 10v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconJacket() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M4 9l5-5h1c0 3.866 2.686 6 6 6s6-2.134 6-6h1l5 5-3 5H6L4 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M4 9v17h24V9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M16 10v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="16" cy="14" r="1" fill="currentColor"/>
      <circle cx="16" cy="18" r="1" fill="currentColor"/>
      <circle cx="16" cy="22" r="1" fill="currentColor"/>
    </svg>
  );
}

const PRODUCTS = [
  {
    id: "tshirt",
    name: "T-Shirt Industriel",
    category: "Maille circulaire",
    moq: "50",
    delay: "2–3 sem.",
    features: ["Jersey 160g à 240g", "Colletage double aiguille", "Bande de propreté épaule", "Coupe personnalisée (CAO)"],
    Icon: IconTshirt,
  },
  {
    id: "hoodie",
    name: "Hoodie Premium",
    category: "Molleton",
    moq: "50",
    delay: "3–4 sem.",
    features: ["Molleton gratté ou bouclé", "Grammage 320g–450g", "Capuche doublée & surpiquée", "Finitions bord-côte élasthanne"],
    Icon: IconHoodie,
    featured: true,
  },
  {
    id: "veste-zipee",
    name: "Veste Zippée / Sweat",
    category: "Maille lourde",
    moq: "50",
    delay: "3–4 sem.",
    features: ["Zip YKK injecté ou métal", "Poches passepoilées", "Surpiqûres de renfort", "Traitement anti-pilling"],
    Icon: IconJacket,
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".services-heading", {
          y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".services-heading", start: "top 85%" },
        });
        // Fade only — no y movement to avoid breaking grid row height
        gsap.fromTo(
          ".product-card",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "opacity",
            scrollTrigger: { trigger: ".products-grid", start: "top 80%" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`section ${styles.section}`}
      aria-labelledby="services-heading"
    >
      <div className="container">
        <div className={`services-heading ${styles.header}`}>
          <p className={`text-label ${styles.eyebrow}`}>Nos produits — V1</p>
          <h2 id="services-heading" className={`text-headline ${styles.title}`}>
            Trois pièces.<br />
            <em className={styles.accent}>Infinies possibilités.</em>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            Nous avons volontairement limité notre catalogue pour maîtriser chaque
            détail de production. T-shirt, Hoodie, Veste — exécutés avec une
            rigueur d&apos;atelier haute couture.
          </p>
        </div>

        {/* Product Cards */}
        <div className={`products-grid ${styles.grid}`}>
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              id={`product-${product.id}`}
              className={`product-card ${styles.card} ${product.featured ? styles.cardFeatured : ""}`}
            >
              {product.featured && (
                <div className={styles.badge}>Plus populaire</div>
              )}
              {/* SVG icon replaces emoji */}
              <div className={styles.cardIcon}>
                <product.Icon />
              </div>
              <div className={styles.cardHeader}>
                <p className={`text-label ${styles.category}`}>{product.category}</p>
                <h3 className={styles.productName}>{product.name}</h3>
              </div>
              <ul className={styles.features} role="list" aria-label={`Caractéristiques ${product.name}`}>
                {product.features.map((f) => (
                  <li key={f} className={styles.feature}>
                    <span className={styles.featureCheck} aria-hidden="true">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  {/* tabular-nums for numeric columns */}
                  <span className={`${styles.metaValue} ${styles.tabularNums}`}>{product.moq}&nbsp;pcs</span>
                  <span className={styles.metaKey}>Minimum</span>
                </div>
                <div className={styles.metaDivider} aria-hidden="true" />
                <div className={styles.metaItem}>
                  <span className={`${styles.metaValue} ${styles.tabularNums}`}>{product.delay}</span>
                  <span className={styles.metaKey}>Production</span>
                </div>
              </div>
              {/* Fixed href: just #devis, product pre-selection handled by URL search param */}
              <Link
                href={`#devis`}
                className={`btn ${product.featured ? "btn-primary" : "btn-outline"} ${styles.cta}`}
                id={`cta-${product.id}`}
              >
                Obtenir un devis
              </Link>
            </article>
          ))}
        </div>

        {/* Bottom note */}
        <p className={styles.note}>
          Matières fournies par le client · Production certifiée ·{" "}
          <Link href="#devis" className={styles.noteLink}>
            Autres pièces sur demande →
          </Link>
        </p>
      </div>
    </section>
  );
}

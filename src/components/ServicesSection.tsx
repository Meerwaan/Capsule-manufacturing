"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServicesSection.module.css";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const PRODUCTS = [
  {
    id: "tshirt",
    name: "T-Shirt",
    category: "Maille circulaire",
    moq: "50",
    delay: "2–3 semaines",
    features: ["Col rond ou V", "Manches courtes / longues", "Coupe regular ou oversized", "100% coton, recyclé ou mix"],
    image: "👕",
  },
  {
    id: "hoodie",
    name: "Hoodie",
    category: "Molleton",
    moq: "50",
    delay: "3–4 semaines",
    features: ["Capuche simple ou double", "Poche kangourou", "Col zippé ou pull", "Grammage 280–400g/m²"],
    image: "🧥",
    featured: true,
  },
  {
    id: "veste-zipee",
    name: "Veste Zippée",
    category: "Maille / Tissu",
    moq: "50",
    delay: "3–4 semaines",
    features: ["Zip YKK premium", "Poches latérales", "Intérieur sherpa optionnel", "Coupe bomber ou classique"],
    image: "🧣",
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
        gsap.from(".product-card", {
          y: 60, autoAlpha: 0, duration: 0.8,
          stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".products-grid", start: "top 75%" },
        });
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
              <div className={styles.cardEmoji} aria-hidden="true">{product.image}</div>
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
                  <span className={styles.metaValue}>{product.moq} pcs</span>
                  <span className={styles.metaKey}>Minimum</span>
                </div>
                <div className={styles.metaDivider} aria-hidden="true" />
                <div className={styles.metaItem}>
                  <span className={styles.metaValue}>{product.delay}</span>
                  <span className={styles.metaKey}>Production</span>
                </div>
              </div>
              <Link
                href={`#devis?product=${product.id}`}
                className={`btn ${product.featured ? "btn-primary" : "btn-outline"}`}
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

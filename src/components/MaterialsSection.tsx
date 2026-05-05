"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./MaterialsSection.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Material {
  id: string;
  name: string;
  origin: string;
  weight: string;
  usages: string[];
  certif?: string;
  img: string;
  alt: string;
}

const IMG_VERSION = "v2"; // Increment this when you update images in public/fabrics

const MATERIALS: Material[] = [
  {
    id: "jersey",
    name: "Jersey Coton",
    origin: "Tunisie / Portugal",
    weight: "160 – 240 g/m²",
    usages: ["T-Shirts", "Polos", "Robes"],
    certif: "GOTS · OEKO-TEX",
    img: `/fabrics/jersey.png?v=${IMG_VERSION}`,
    alt: "Texture macro de jersey coton premium blanc naturel",
  },
  {
    id: "molleton",
    name: "Molleton Gratté",
    origin: "Tunisie",
    weight: "320 – 450 g/m²",
    usages: ["Hoodies", "Sweatshirts", "Joggings"],
    certif: "OEKO-TEX",
    img: `/fabrics/molleton.png?v=${IMG_VERSION}`,
    alt: "Texture macro de molleton gratté gris chiné",
  },
  {
    id: "interlock",
    name: "Interlock Double Face",
    origin: "Italie · Tunisie",
    weight: "200 – 280 g/m²",
    usages: ["Vestes légères", "Robes", "Ensembles"],
    certif: "GOTS",
    img: `/fabrics/interlock.png?v=${IMG_VERSION}`,
    alt: "Texture macro d'interlock double face écru",
  },
  {
    id: "ripstop",
    name: "Ripstop Technique",
    origin: "Europe",
    weight: "120 – 180 g/m²",
    usages: ["Vestes techniques", "Coupes-vent", "Streetwear"],
    img: `/fabrics/ripstop.png?v=${IMG_VERSION}`,
    alt: "Texture macro de tissu ripstop technique marine",
  },
  {
    id: "velours",
    name: "Velours Côtelé",
    origin: "Portugal · Turquie",
    weight: "270 – 380 g/m²",
    usages: ["Pantalons", "Vestes", "Accessoires"],
    certif: "OEKO-TEX",
    img: `/fabrics/velours.png?v=${IMG_VERSION}`,
    alt: "Texture macro de velours côtelé caramel",
  },
  {
    id: "denim",
    name: "Denim Selvedge",
    origin: "Japon · Tunisie",
    weight: "10 – 14 oz",
    usages: ["Jeans", "Vestes", "Chemises"],
    certif: "OEKO-TEX",
    img: `/fabrics/denim.png?v=${IMG_VERSION}`,
    alt: "Texture macro de denim selvedge indigo japonais",
  },
];

export default function MaterialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".mat-heading", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".mat-heading", start: "top 85%" },
        });
        gsap.fromTo(
          ".mat-card",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: { trigger: ".mat-grid", start: "top 80%" },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="matieres"
      className={`section ${styles.section}`}
      aria-labelledby="mat-heading"
    >
      <div className="container">
        {/* Header */}
        <div className={`mat-heading ${styles.header}`}>
          <p className={`text-label ${styles.eyebrow}`}>Bibliothèque Matières</p>
          <h2 id="mat-heading" className={`text-headline ${styles.title}`}>
            Des fibres sélectionnées,{" "}
            <em className={styles.accent}>des mains expertes.</em>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            Chaque tissu est sourcé auprès de filières certifiées. Nos techniciens
            maîtrisent les propriétés spécifiques de chaque matière pour garantir
            une confection parfaite, de la coupe au contrôle final.
          </p>
        </div>

        {/* Grid */}
        <div className={`mat-grid ${styles.grid}`}>
          {MATERIALS.map((mat) => (
            <article key={mat.id} className={`mat-card ${styles.card}`}>
              {/* Real fabric photo */}
              <div className={styles.swatch}>
                <Image
                  src={mat.img}
                  alt={mat.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.swatchImg}
                  style={{ objectFit: "cover" }}
                />
                {mat.certif && (
                  <span className={styles.certif}>{mat.certif}</span>
                )}
              </div>

              {/* Info */}
              <div className={styles.info}>
                <div className={styles.meta}>
                  <span className={styles.origin}>{mat.origin}</span>
                  <span className={styles.weight}>{mat.weight}</span>
                </div>
                <h3 className={styles.name}>{mat.name}</h3>
                <ul className={styles.usages} aria-label="Utilisations">
                  {mat.usages.map((u) => (
                    <li key={u} className={styles.usage}>
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom note */}
        <p className={styles.note}>
          Matières sur devis · Possibilité d&apos;apport client ·{" "}
          <a href="#devis" className={styles.noteLink}>
            Demander un échantillon →
          </a>
        </p>
      </div>
    </section>
  );
}

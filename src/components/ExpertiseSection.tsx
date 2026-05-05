"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ExpertiseSection.module.css";

gsap.registerPlugin(ScrollTrigger);

function IconModelisme() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 26l22-22v22H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 26v-4m5 4v-8m5 8v-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconSourcing() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 16c0-3.314 2.686-6 6-6m0 12c3.314 0 6-2.686 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 6v2m0 16v2m-10-10h2m16 0h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function IconQualite() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M20 20l6 6M11 14l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const EXPERTISES = [
  {
    id: "modelisme",
    title: "Modélisme & CAO",
    desc: "Développement de vos patrons sur Lectra/Gerber. Gradation multi-tailles et placement optimal pour minimiser les chutes de tissu.",
    details: ["Patronage numérique", "Gradation précise", "Placement optimisé"],
    Icon: IconModelisme
  },
  {
    id: "sourcing",
    title: "Sourcing Matières",
    desc: "Accès à notre réseau de tisseurs tunisiens et européens. Sélection de fils premium et tissus certifiés (GOTS, OEKO-TEX).",
    details: ["Mailles & Tissus", "Accessoires (YKK)", "Labels éthiques"],
    Icon: IconSourcing
  },
  {
    id: "qualite",
    title: "Contrôle Qualité",
    desc: "Chaque pièce subit un triple contrôle qualité selon les normes AQL 2.5. Finitions main pour les pièces haut de gamme.",
    details: ["Triple inspection", "Normes AQL 2.5", "Finition main"],
    Icon: IconQualite
  }
];

export default function ExpertiseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".expertise-heading", {
          y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".expertise-heading", start: "top 85%" },
        });
        gsap.from(".expertise-item", {
          y: 50, autoAlpha: 0, duration: 0.8,
          stagger: 0.2, ease: "power3.out",
          scrollTrigger: { trigger: ".expertise-grid", start: "top 80%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="expertise" className={`section ${styles.section}`}>
      <div className="container">
        <div className={`expertise-heading ${styles.header}`}>
          <p className="text-label">Expertise Industrielle</p>
          <h2 className="text-headline">
            Bien plus qu&apos;un <em className={styles.accent}>atelier de couture.</em>
          </h2>
          <p className="text-body">
            Nous mettons à votre disposition un bureau d&apos;études complet pour 
            transformer vos idées en productions prêtes pour le marché.
          </p>
        </div>

        <div className={`expertise-grid ${styles.grid}`}>
          {EXPERTISES.map((exp) => (
            <div key={exp.id} className={`expertise-item ${styles.item}`}>
              <div className={styles.icon}><exp.Icon /></div>
              <h3 className={styles.itemTitle}>{exp.title}</h3>
              <p className={styles.itemDesc}>{exp.desc}</p>
              <ul className={styles.details}>
                {exp.details.map(d => (
                  <li key={d} className={styles.detailItem}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

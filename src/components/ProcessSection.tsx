"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProcessSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    title: "Configurez & Estimez",
    body: "Renseignez votre projet en 4 étapes via notre configurateur industriel. Obtenez une estimation de coût CMT immédiate.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17.5 14v7M14 17.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Validation Humaine",
    body: "Notre équipe vous rappelle sous 24h pour affiner le devis, valider la faisabilité technique et confirmer les délais.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: "03",
    title: "Envoi de la Matière",
    body: "Vous expédiez vos tissus à notre atelier à Sfax. L'app génère votre bon de réception — à coller sur les colis.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M5 8h14l-1.5 9H6.5L5 8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M5 8L3 4H1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="9" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="20" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Confection & Suivi",
    body: "Suivez votre production en temps réel : Coupe → Confection → Contrôle Qualité. Notifications à chaque étape.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "05",
    title: "Livraison Express",
    body: "Vos pièces finies sont expédiées vers votre entrepôt en Europe. 24h par bateau depuis Sfax, 3h par avion.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M3 12l4-4m0 0l4 4m-4-4v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12l-4-4m0 0l-4 4m4-4v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".process-heading", {
          y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".process-heading", start: "top 85%" },
        });

        // Animate the connecting line
        gsap.from(".process-line", {
          scaleY: 0,
          transformOrigin: "top",
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".process-steps",
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        });

        gsap.from(".process-step", {
          x: -24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: { trigger: ".process-steps", start: "top 75%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className={`section ${styles.section}`}
      aria-labelledby="process-heading"
    >
      <div className="container">
        <div className={`process-heading ${styles.header}`}>
          <p className={`text-label ${styles.eyebrow}`}>Comment ça marche</p>
          <h2 id="process-heading" className={`text-headline ${styles.title}`}>
            De l&apos;idée à la livraison,{" "}
            <em className={styles.accent}>sans friction.</em>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            Un process digitalisé de bout en bout, avec un interlocuteur humain
            dédié à chaque étape clé.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Steps list */}
          <ol className={`process-steps ${styles.steps}`}>
            {/* Animated connecting line */}
            <div className={`process-line ${styles.line}`} aria-hidden="true" />

            {STEPS.map((step, i) => (
              <li key={step.num} className={`process-step ${styles.step}`}>
                <div className={styles.stepNum} aria-hidden="true">
                  <span className={styles.stepNumText}>{step.num}</span>
                  {i < STEPS.length - 1 && (
                    <div className={styles.stepConnector} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepIconWrap}>
                    {step.icon}
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Right side — CTA card */}
          <div className={styles.ctaCard}>
            <p className={`text-label ${styles.ctaEyebrow}`}>Prêt à démarrer ?</p>
            <p className={styles.ctaTitle}>
              Votre première collection mérite un atelier à la hauteur.
            </p>
            <ul className={styles.ctaChecks} role="list">
              {["Réponse sous 24h", "Devis sans engagement", "MOQ dès 50 pièces"].map((item) => (
                <li key={item} className={styles.ctaCheck}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#devis" className="btn btn-gold" id="process-cta">
              Obtenir un devis gratuit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

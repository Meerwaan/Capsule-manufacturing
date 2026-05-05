"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TunisieSection.module.css";

gsap.registerPlugin(ScrollTrigger);

const ARGUMENTS = [
  {
    icon: "✈",
    stat: "3h",
    title: "De Paris à Sfax",
    body: "L'Europe est à portée d'avion. Oubliez les délais asiatiques — votre production est dans votre fuseau horaire.",
  },
  {
    icon: "⚓",
    stat: "24h",
    title: "Par voie maritime",
    body: "Un bateau suffit. La Méditerranée est notre autoroute. Vos pièces arrivent dans les délais que vos clients exigent.",
  },
  {
    icon: "◈",
    stat: "40+",
    title: "Ans de tradition textile",
    body: "La Tunisie est l'une des capitales mondiales du textile. Nos ouvrières maîtrisent chaque point de couture depuis des décennies.",
  },
];

export default function TunisieSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Section heading reveal
        gsap.from(".tunisie-heading", {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tunisie-heading",
            start: "top 85%",
          },
        });

        // Cards stagger
        gsap.from(".tunisie-card", {
          y: 50,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tunisie-cards",
            start: "top 80%",
          },
        });

        // Horizontal line wipe
        gsap.from(".tunisie-line", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".tunisie-line",
            start: "top 90%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tunisie"
      className={`section ${styles.section}`}
      aria-labelledby="tunisie-heading"
    >
      <div className="container">
        {/* Header */}
        <div className={`tunisie-heading ${styles.header}`}>
          <p className={`text-label ${styles.eyebrow}`}>
            Pourquoi la Tunisie
          </p>
          <h2 id="tunisie-heading" className={`text-headline ${styles.title}`}>
            L&apos;excellence{" "}
            <em className={styles.accent}>méditerranéenne</em>,<br />
            à votre service.
          </h2>
          <span className={`tunisie-line ${styles.line}`} aria-hidden="true" />
          <p className={`text-body ${styles.subtitle}`}>
            Choisir la Tunisie, c&apos;est choisir la proximité, la réactivité et un
            savoir-faire reconnu dans le monde entier. C&apos;est aussi réduire votre
            empreinte carbone par rapport à la production asiatique.
          </p>
        </div>

        {/* Cards */}
        <ul
          className={`tunisie-cards ${styles.cards}`}
          role="list"
        >
          {ARGUMENTS.map((arg) => (
            <li key={arg.stat} className={`tunisie-card ${styles.card}`}>
              <div className={styles.cardTop}>
                <span className={styles.icon} aria-hidden="true">{arg.icon}</span>
                <span className={styles.stat}>{arg.stat}</span>
              </div>
              <h3 className={styles.cardTitle}>{arg.title}</h3>
              <p className={styles.cardBody}>{arg.body}</p>
            </li>
          ))}
        </ul>

        {/* Bottom quote */}
        <blockquote className={styles.quote}>
          <p>
            &ldquo;La Tunisie produit pour les plus grandes maisons de couture
            européennes depuis les années 1970. Capsule vous ouvre enfin ces
            portes, à votre échelle.&rdquo;
          </p>
          <footer className={styles.quoteFooter}>
            <span className={styles.quoteDash}>—</span>
            L&apos;équipe Capsule
          </footer>
        </blockquote>
      </div>
    </section>
  );
}

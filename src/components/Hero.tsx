"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "50", unit: "pcs", label: "Minimum de commande" },
  { value: "24h", unit: "", label: "Livraison maritime Europe" },
  { value: "3h", unit: "", label: "Distance en avion de Paris" },
  { value: "40+", unit: "ans", label: "D'expertise textile" },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as { reduceMotion: boolean; isDesktop: boolean };

          if (!reduceMotion) {
            // Staggered entrance for hero text
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.from(".hero-eyebrow", {
              y: 20,
              autoAlpha: 0,
              duration: 0.7,
              delay: 0.3,
            })
              .from(
                ".hero-title-line",
                { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.12 },
                "-=0.3"
              )
              .from(
                ".hero-divider",
                { scaleX: 0, transformOrigin: "left", duration: 0.6 },
                "-=0.5"
              )
              .from(
                ".hero-body",
                { y: 20, autoAlpha: 0, duration: 0.7 },
                "-=0.3"
              )
              .from(
                ".hero-actions",
                { y: 20, autoAlpha: 0, duration: 0.6 },
                "-=0.3"
              );

            // Stats stagger
            gsap.from(".hero-stat", {
              y: 30,
              autoAlpha: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power3.out",
              delay: 1.2,
            });

            // Parallax on scroll
            gsap.to(".hero-bg-text", {
              y: "-20%",
              ease: "none",
              scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className={`hero-section ${styles.hero}`}
      aria-labelledby="hero-heading"
    >
      {/* Background decorative text */}
      <span className={`hero-bg-text ${styles.bgText}`} aria-hidden="true">
        CAPSULE
      </span>

      {/* Vertical line ornament */}
      <div className={styles.verticalLine} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        {/* Left column */}
        <div className={styles.left}>
          <p className={`hero-eyebrow text-label ${styles.eyebrow}`}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            Confection Premium · Sfax, Tunisie
          </p>

          <h1 id="hero-heading" className={styles.title}>
            <span className={`hero-title-line ${styles.titleLine}`}>
              Votre collection
            </span>
            <span className={`hero-title-line ${styles.titleLineItalic}`}>
              naît ici.
            </span>
            <span className={`hero-title-line ${styles.titleLineSub}`}>
              Livrée partout.
            </span>
          </h1>

          <span className={`hero-divider ${styles.divider}`} aria-hidden="true" />

          <p className={`hero-body ${styles.body}`}>
            Marques indépendantes : lancez vos pièces en petite série dès{" "}
            <strong>50 exemplaires</strong>. Devis en ligne, validation humaine,
            production certifiée. Nous confectionnons, vous brillez.
          </p>

          <div className={`hero-actions ${styles.actions}`}>
            <Link href="#devis" className="btn btn-primary" id="hero-cta-primary">
              Obtenir un devis gratuit
            </Link>
            <Link href="#process" className="btn btn-outline" id="hero-cta-secondary">
              Voir le process
            </Link>
          </div>
        </div>

        {/* Right column — Stats */}
        <div className={styles.right}>
          <ul className={styles.stats} role="list">
            {STATS.map((stat) => (
              <li key={stat.label} className={`hero-stat ${styles.stat}`}>
                <div className={styles.statValue}>
                  {stat.value}
                  {stat.unit && (
                    <span className={styles.statUnit}>{stat.unit}</span>
                  )}
                </div>
                <p className={styles.statLabel}>{stat.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={`text-label ${styles.scrollText}`}>Découvrir</span>
      </div>
    </section>
  );
}

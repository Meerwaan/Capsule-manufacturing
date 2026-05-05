"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Navbar.module.css";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation
    gsap.fromTo(
      nav,
      { y: -20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );

    // Scroll-based background
    ScrollTrigger.create({
      start: "top-=80",
      onEnter: () => nav.classList.add(styles.scrolled),
      onLeaveBack: () => nav.classList.remove(styles.scrolled),
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <nav ref={navRef} className={styles.nav} role="navigation" aria-label="Navigation principale">
      <div className={styles.inner}>
        {/* Logo */}
        <Link ref={logoRef} href="/" className={styles.logo} aria-label="Capsule - Accueil">
          <span className={styles.logoText} translate="no">CAPSULE</span>
          <span className={styles.logoSub} translate="no">Tunisia</span>
        </Link>

        {/* Links */}
        <ul className={styles.links} role="list">
          <li>
            <Link href="#services" className={styles.link}>Services</Link>
          </li>
          <li>
            <Link href="#expertise" className={styles.link}>Expertise</Link>
          </li>
          <li>
            <Link href="#tunisie" className={styles.link}>Notre Atelier</Link>
          </li>
          <li>
            <Link href="#process" className={styles.link}>Process</Link>
          </li>
        </ul>

        {/* CTA */}
        <Link href="#devis" className={`btn btn-primary ${styles.cta}`} id="nav-cta">
          Obtenir un devis
        </Link>

        {/* Mobile menu toggle */}
        <button className={styles.menuToggle} aria-label="Ouvrir le menu" id="mobile-menu-toggle">
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
        </button>
      </div>
    </nav>
  );
}

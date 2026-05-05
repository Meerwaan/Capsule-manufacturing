"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./TrustBanner.module.css";

gsap.registerPlugin(ScrollTrigger);

const CERTS = [
  { name: "OEKO-TEX®", desc: "Standard 100", icon: "✓" },
  { name: "GOTS", desc: "Organic Textile", icon: "☘" },
  { name: "AQL 2.5", desc: "Quality Standard", icon: "🛡" },
  { name: "YKK®", desc: "Zippers Partner", icon: "⚓" },
];

export default function TrustBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".trust-item", {
        y: 20,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bannerRef.current,
          start: "top 90%",
        }
      });
    }, bannerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={bannerRef} className={`trust-banner ${styles.banner}`}>
      <div className="container">
        <div className={styles.grid}>
          {CERTS.map((cert) => (
            <div key={cert.name} className={`trust-item ${styles.item}`}>
              <span className={styles.icon} aria-hidden="true">{cert.icon}</span>
              <div className={styles.text}>
                <span className={styles.name}>{cert.name}</span>
                <span className={styles.desc}>{cert.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

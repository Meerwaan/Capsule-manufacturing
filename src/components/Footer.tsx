import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="Capsule - Retour accueil">
            <span className={styles.logoText}>CAPSULE</span>
            <span className={styles.logoSub}>Sfax · Tunisia</span>
          </Link>
          <p className={styles.tagline}>
            L&apos;atelier de demain, ancré dans la tradition textile
            méditerranéenne depuis des décennies.
          </p>
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Navigation footer">
          <div className={styles.navCol}>
            <p className={styles.navTitle}>Services</p>
            <ul role="list">
              <li><Link href="#services" className={styles.navLink}>Produits</Link></li>
              <li><Link href="#expertise" className={styles.navLink}>Expertise Technique</Link></li>
              <li><Link href="#devis" className={styles.navLink}>Obtenir un devis</Link></li>
            </ul>
          </div>
          <div className={styles.navCol}>
            <p className={styles.navTitle}>Atelier</p>
            <ul role="list">
              <li><Link href="#tunisie" className={styles.navLink}>Pourquoi la Tunisie</Link></li>
              <li><Link href="#process" className={styles.navLink}>Notre process</Link></li>
              <li><Link href="#tunisie" className={styles.navLink}>Logistique</Link></li>
            </ul>
          </div>
          <div className={styles.navCol}>
            <p className={styles.navTitle}>Contact</p>
            <ul role="list">
              <li>
                <a href="mailto:contact@capsule-mfg.com" className={styles.navLink}>
                  contact@capsule-mfg.com
                </a>
              </li>
              <li>
                <a href="tel:+21600000000" className={styles.navLink}>
                  +216 00 000 000
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {year} Capsule Manufacturing · Sfax, Tunisie
            </p>
            <div className={styles.legal}>
              <Link href="/privacy" className={styles.legalLink}>Confidentialité</Link>
              <Link href="/terms" className={styles.legalLink}>Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

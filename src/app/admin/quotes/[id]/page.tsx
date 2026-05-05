import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../admin.module.css";

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const quoteId = parseInt(resolvedParams.id);
  
  if (isNaN(quoteId)) notFound();

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
  });

  if (!quote) notFound();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <Link href="/admin/quotes" className={styles.backLink}>
            ← Retour aux devis
          </Link>
          <h2 className={styles.pageTitle}>{quote.brandName}</h2>
          <p className={styles.pageDescription}>Dossier technique reçu le {quote.createdAt.toLocaleDateString("fr-FR")}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnRefuse}>Refuser</button>
          <button className={styles.btnValidate}>Valider & Lancer Production</button>
        </div>
      </header>

      <div className={styles.detailGrid}>
        {/* Info Client */}
        <section className={styles.panel}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</h3>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Interlocuteur</p>
            <p className={styles.infoValue}>{quote.contactName}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Email</p>
            <p className={styles.infoValue}>{quote.email}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Téléphone</p>
            <p className={styles.infoValue}>{quote.phone}</p>
          </div>
        </section>

        {/* Info Produit */}
        <section className={styles.panel} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spécifications Confection</h3>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Produit / Modèle</p>
            <p className={`${styles.infoValue} ${styles.capitalize}`}>{quote.product}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Matière / Grammage</p>
            <p className={styles.infoValue}>{quote.materialType} — {quote.grammage}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Volume</p>
            <p className={styles.infoValue}>{quote.quantity} pièces</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Marquage</p>
            <p className={styles.infoValue}>{quote.branding} ({quote.brandingLocations} loc.)</p>
          </div>
        </section>

        {/* Fichiers */}
        <section className={styles.panel} style={{ gridColumn: '1 / -1' }}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dossier Technique & Fichiers</h3>
          <div>
            {quote.schemaFile ? (
              <a href={`/api/admin/download?file=${quote.schemaFile}`} className={styles.fileLink}>
                <span className={styles.fileLabel}>Tech Pack / Schéma</span>
                <span className={styles.fileAction}>Télécharger ↓</span>
              </a>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-500)', fontStyle: 'italic', marginBottom: 'var(--space-2)' }}>Aucun Tech Pack fourni.</p>
            )}
            {quote.patronFile ? (
              <a href={`/api/admin/download?file=${quote.patronFile}`} className={styles.fileLink}>
                <span className={styles.fileLabel}>Patron / Graphismes</span>
                <span className={styles.fileAction}>Télécharger ↓</span>
              </a>
            ) : (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-500)', fontStyle: 'italic' }}>Aucun patron fourni.</p>
            )}
          </div>
        </section>

        {/* Notes */}
        <section className={styles.panel} style={{ gridColumn: '1 / -1' }}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commentaires Client</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-100)', fontStyle: 'italic', lineHeight: 1.6 }}>
            {quote.notes || "Pas de notes spécifiques."}
          </p>
        </section>
      </div>
    </div>
  );
}

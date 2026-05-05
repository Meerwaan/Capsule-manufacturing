import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../admin.module.css";
import QuotePricingForm from "@/components/admin/QuotePricingForm";

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
          <p className={styles.pageDescription}>
            Dossier technique reçu le {quote.createdAt.toLocaleDateString("fr-FR")} 
            — Statut actuel: <span style={{ fontWeight: 600, color: quote.status === 'VALIDATED' ? 'var(--color-success)' : 'var(--color-gold)' }}>{quote.status}</span>
          </p>
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

        {/* Chiffrage & Décision */}
        <section className={styles.panel} style={{ gridRow: 'span 2' }}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottomColor: 'var(--color-charcoal-700)' }}>Chiffrage & Décision</h3>
          <QuotePricingForm 
            quoteId={quote.id}
            initialUnitPrice={quote.unitPrice}
            initialSetupFees={quote.setupFees}
            initialLeadTime={quote.leadTime}
            quantity={quote.quantity}
            status={quote.status}
          />
        </section>

        {/* Info Produit */}
        <section className={styles.panel} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
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
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Neck Label</p>
            <p className={styles.infoValue}>{quote.neckLabel === "yes" ? "Oui" : "Non"}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Hangtag (Étiquette cartonnée)</p>
            <p className={styles.infoValue}>{quote.hangtag === "yes" ? "Oui" : "Non"}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Emballage (Packaging)</p>
            <p className={styles.infoValue}>{quote.packaging === "yes" ? "Polybag individuel" : "Standard"}</p>
          </div>
        </section>

        {/* Conception & Fichiers */}
        <section className={styles.panel} style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conception & Fichiers Techniques</h3>
          </div>
          
          <div>
            <div className={styles.infoGroup}>
              <p className={styles.infoLabel}>Patron fourni par le client ?</p>
              <p className={styles.infoValue}>{quote.hasPatron === "yes" ? "Oui" : "Non (À créer par l'usine)"}</p>
            </div>
            <div className={styles.infoGroup}>
              <p className={styles.infoLabel}>Demande de prototype ?</p>
              <p className={styles.infoValue}>{quote.wantsPrototype === "yes" ? "Oui (Fortement recommandé)" : "Non (Validation sur photo)"}</p>
            </div>
          </div>

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
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-500)', fontStyle: 'italic' }}>Aucun fichier de patron ou graphisme fourni.</p>
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

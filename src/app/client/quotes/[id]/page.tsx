import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import styles from "../../client.module.css";
import PaymentButton from "@/components/client/PaymentButton";
import { ArrowLeft, CheckCircle2, Factory, PackageCheck } from "lucide-react";

export default async function ClientQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = parseInt(session.user.id);

  const resolvedParams = await params;
  const quoteId = parseInt(resolvedParams.id);
  
  if (isNaN(quoteId)) notFound();

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
  });

  if (!quote) notFound();

  if (quote.userId !== userId) {
    redirect("/client/quotes");
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <Link href="/client/quotes" style={{ color: 'var(--color-charcoal-400)', textDecoration: 'none', fontSize: 'var(--text-sm)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', transition: 'color 0.2s' }}>
          <ArrowLeft size={16} /> Retour aux devis
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className={styles.pageTitle} style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>Devis #{quote.id.toString().padStart(4, '0')}</h1>
            <p className={styles.pageDescription}>Émis le {quote.createdAt.toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <span className={`${styles.badge} ${
            quote.status === "PENDING" ? styles.badgePending : 
            quote.status === "PRICED" ? styles.badgePriced : 
            (quote.status === "PAID" || quote.status === "VALIDATED") ? styles.badgePaid : ''
          }`} style={{ fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-4)', alignSelf: 'center' }}>
            {quote.status}
          </span>
        </div>
      </div>

      <div className={styles.card} style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-10)' }}>
        
        <div className={styles.invoiceGrid}>
          {/* COLONNE GAUCHE: RECAP */}
          <div>
            <div className={styles.invoiceSection}>
              <h3 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <PackageCheck size={16} /> Spécifications Techniques
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                <div>
                  <div className={styles.invoiceLabel}>Modèle</div>
                  <div className={styles.invoiceValue} style={{ textTransform: 'capitalize' }}>{quote.product}</div>
                </div>
                <div>
                  <div className={styles.invoiceLabel}>Matière</div>
                  <div className={styles.invoiceValue}>{quote.materialType}</div>
                </div>
                <div>
                  <div className={styles.invoiceLabel}>Grammage</div>
                  <div className={styles.invoiceValue}>{quote.grammage}</div>
                </div>
                <div>
                  <div className={styles.invoiceLabel}>Marquage</div>
                  <div className={styles.invoiceValue}>{quote.branding} ({quote.brandingLocations} pos.)</div>
                </div>
              </div>
            </div>

            <div className={styles.invoiceSection}>
              <h3 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Factory size={16} /> Production
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                <div>
                  <div className={styles.invoiceLabel}>Délai estimé</div>
                  <div className={styles.invoiceValue}>{quote.leadTime || "En cours d'estimation"}</div>
                </div>
                <div>
                  <div className={styles.invoiceLabel}>Prototypage</div>
                  <div className={styles.invoiceValue}>{quote.wantsPrototype === 'yes' ? 'Oui' : 'Non (Validation photo)'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE: CHIFFRAGE */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-6)' }}>
              Détail Financier
            </h3>
            
            {quote.status === "PENDING" || quote.status === "CONTACTED" ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 'var(--space-4)', padding: 'var(--space-6) 0' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px dashed var(--color-charcoal-600)', animation: 'spin 4s linear infinite' }} />
                <p style={{ color: 'var(--color-charcoal-400)', fontSize: 'var(--text-sm)' }}>L'atelier étudie votre demande pour vous proposer le meilleur tarif.</p>
              </div>
            ) : (
              <div>
                <div className={styles.invoiceRow}>
                  <span style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-sm)' }}>Confection (x{quote.quantity})</span>
                  <span style={{ color: 'var(--color-white)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{quote.unitPrice?.toFixed(2)} € /u</span>
                </div>
                
                <div className={styles.invoiceRow}>
                  <span style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-sm)' }}>Frais techniques (Moules, etc.)</span>
                  <span style={{ color: 'var(--color-white)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{quote.setupFees?.toFixed(2) || "0.00"} €</span>
                </div>

                <div className={styles.invoiceTotal} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: 'var(--space-4)' }}>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>Total Estimé HT</span>
                  <span style={{ color: 'var(--color-white)', fontWeight: 700, fontSize: '1.8rem', fontFamily: 'monospace', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                    {quote.totalPrice?.toFixed(2)} €
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ZONE DE PAIEMENT */}
      {quote.status === "PRICED" && (
        <PaymentButton quoteId={quote.id} />
      )}

      {(quote.status === "PAID" || quote.status === "VALIDATED") && (
        <div style={{ padding: 'var(--space-8)', backgroundColor: 'rgba(39, 174, 96, 0.05)', border: '1px solid rgba(39, 174, 96, 0.2)', borderRadius: 'var(--radius-xl)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(39, 174, 96, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success)' }}>
            <CheckCircle2 size={32} />
          </div>
          <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-white)', fontWeight: 500 }}>Paiement Validé</h3>
          <p style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>
            Merci pour votre confiance. Votre production a officiellement rejoint les lignes de l'atelier.
          </p>
          <Link href="/client/projects" className={styles.primaryButton} style={{ marginTop: 'var(--space-2)', background: 'var(--color-success)', color: 'var(--color-white)', boxShadow: '0 4px 15px rgba(39, 174, 96, 0.2)' }}>
            Suivre ma production
          </Link>
        </div>
      )}
    </div>
  );
}

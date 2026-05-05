import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import styles from "../../client.module.css";
import PaymentButton from "@/components/client/PaymentButton";

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

  // Sécurité : Vérifier que le devis appartient bien au client connecté
  if (quote.userId !== userId) {
    redirect("/client/quotes");
  }

  return (
    <div>
      <div className={styles.pageHeader}>
        <Link href="/client/quotes" style={{ color: 'var(--color-charcoal-300)', textDecoration: 'none', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', display: 'inline-block' }}>
          ← Retour aux devis
        </Link>
        <h1 className={styles.pageTitle}>Devis de Production</h1>
        <p className={styles.pageDescription}>
          Demande du {quote.createdAt.toLocaleDateString("fr-FR")} pour {quote.quantity}x {quote.product}
        </p>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card} style={{ gridColumn: 'span 2' }}>
          <h2 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-charcoal-700)', paddingBottom: 'var(--space-2)' }}>
            Récapitulatif de la Commande
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-400)' }}>Modèle</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-white)', textTransform: 'capitalize', fontWeight: 500 }}>{quote.product}</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-400)' }}>Matière</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-white)', fontWeight: 500 }}>{quote.materialType} ({quote.grammage})</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-400)' }}>Marquage</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-white)', fontWeight: 500 }}>{quote.branding} ({quote.brandingLocations} positions)</p>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-400)' }}>Délai estimé</p>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-white)', fontWeight: 500 }}>{quote.leadTime || "En cours d'estimation"}</p>
            </div>
          </div>
        </div>

        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-charcoal-700)', paddingBottom: 'var(--space-2)' }}>
            Chiffrage
          </h2>
          
          {quote.status === "PENDING" || quote.status === "CONTACTED" ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p style={{ color: 'var(--color-charcoal-300)' }}>Notre atelier est en train d'étudier votre demande.</p>
              <span className={`${styles.badge} ${styles.badgePending}`}>En cours de chiffrage</span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span style={{ color: 'var(--color-charcoal-300)' }}>Prix unitaire HT</span>
                <span style={{ color: 'var(--color-white)', fontWeight: 500 }}>{quote.unitPrice?.toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span style={{ color: 'var(--color-charcoal-300)' }}>Quantité</span>
                <span style={{ color: 'var(--color-white)', fontWeight: 500 }}>x {quote.quantity}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-charcoal-700)' }}>
                <span style={{ color: 'var(--color-charcoal-300)' }}>Frais techniques (Moule, Cadres...)</span>
                <span style={{ color: 'var(--color-white)', fontWeight: 500 }}>{quote.setupFees?.toFixed(2) || "0.00"} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 'var(--text-xs)' }}>Total Estimé HT</span>
                <span style={{ color: 'var(--color-white)', fontWeight: 700, fontSize: 'var(--text-2xl)', fontFamily: 'monospace' }}>
                  {quote.totalPrice?.toFixed(2)} €
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {quote.status === "PRICED" && (
        <PaymentButton quoteId={quote.id} />
      )}

      {(quote.status === "PAID" || quote.status === "VALIDATED") && (
        <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)', backgroundColor: 'rgba(39, 174, 96, 0.05)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
          <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-success)', marginBottom: 'var(--space-2)' }}>Paiement Validé</h3>
          <p style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            Votre production est officiellement lancée dans notre atelier.
          </p>
          <Link href="/client/projects" className={styles.actionButton} style={{ backgroundColor: 'var(--color-success)', color: 'var(--color-white)' }}>
            Suivre ma production en cours
          </Link>
        </div>
      )}
    </div>
  );
}

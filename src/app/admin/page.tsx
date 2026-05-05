import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminDashboard() {
  const quotesCount = await prisma.quote.count();
  const pendingQuotes = await prisma.quote.count({ where: { status: "PENDING" } });
  
  const activeProjectsCount = await prisma.project.count({
    where: { status: { not: "DELIVERED" } }
  });

  const validatedQuotes = await prisma.quote.findMany({
    where: { 
      status: { in: ["VALIDATED", "PAID"] } 
    },
    select: { totalPrice: true }
  });
  
  const estimatedRevenue = validatedQuotes.reduce((acc, quote) => acc + (quote.totalPrice || 0), 0);

  const recentQuotes = await prisma.quote.findMany({
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Tableau de bord</h2>
          <p className={styles.pageDescription}>Suivi de l&apos;activité de l&apos;usine en temps réel.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className={styles.gridStats}>
        <StatCard title="Devis reçus" value={quotesCount.toString()} hint="Total historique" />
        <StatCard title="À chiffrer" value={pendingQuotes.toString()} hint="Action requise" highlight />
        <StatCard title="Projets actifs" value={activeProjectsCount.toString()} hint="En production" />
        <StatCard title="CA Estimé" value={`${estimatedRevenue.toLocaleString('fr-FR')} €`} hint="Base devis validés" />
      </div>

      <div className={styles.dashboardLayout}>
        {/* Recent Quotes */}
        <div className={styles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-charcoal-700)', paddingBottom: 'var(--space-3)' }}>
            <h3 className={styles.panelTitle} style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>Dernières demandes</h3>
            <Link href="/admin/quotes" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', textDecoration: 'none' }}>Voir tout →</Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recentQuotes.map(quote => (
              <Link key={quote.id} href={`/admin/quotes/${quote.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', backgroundColor: 'var(--color-charcoal-900)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', border: '1px solid var(--color-charcoal-700)', transition: 'border-color 0.2s' }}>
                <div>
                  <p style={{ color: 'var(--color-white)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>{quote.brandName}</p>
                  <p style={{ color: 'var(--color-charcoal-300)', fontSize: 'var(--text-xs)', textTransform: 'capitalize' }}>{quote.product} — {quote.quantity} pcs</p>
                </div>
                <div>
                  <span className={`${styles.statusBadge} ${quote.status === "PENDING" ? styles.statusPending : styles.statusValidated}`}>
                    {quote.status}
                  </span>
                </div>
              </Link>
            ))}
            {recentQuotes.length === 0 && (
              <div style={{ color: 'var(--color-charcoal-500)', fontStyle: 'italic', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-6)' }}>
                Aucune demande pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Actions rapides</h3>
            <div>
              <Link href="/admin/materials" style={{ textDecoration: 'none' }}>
                <button className={styles.actionButton}>+ Créer une fiche matière</button>
              </Link>
              <button className={styles.actionButton}>Générer rapport d'activité</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, hint, highlight = false }: { title: string, value: string, hint: string, highlight?: boolean }) {
  return (
    <div className={`${styles.statCard} ${highlight ? styles.statCardHighlight : ''}`}>
      <p className={styles.statTitle}>{title}</p>
      <h4 className={styles.statValue}>{value}</h4>
      <p className={styles.statHint}>{hint}</p>
    </div>
  );
}

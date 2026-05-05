import { prisma } from "@/lib/prisma";
import styles from "./admin.module.css";

export default async function AdminDashboard() {
  const quotesCount = await prisma.quote.count();
  const pendingQuotes = await prisma.quote.count({ where: { status: "PENDING" } });

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
        <StatCard title="Projets actifs" value="0" hint="En production" />
        <StatCard title="CA Estimé" value="0€" hint="Base devis validés" />
      </div>

      <div className={styles.dashboardLayout}>
        {/* Recent Quotes */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Dernières demandes</h3>
          {/* Table placeholder */}
          <div style={{ color: 'var(--color-charcoal-500)', fontStyle: 'italic', fontSize: 'var(--text-sm)' }}>
            Les données des devis apparaîtront ici...
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>Actions rapides</h3>
            <div>
              <button className={styles.actionButton}>+ Créer une fiche matière</button>
              <button className={styles.actionButton}>Envoyer un rapport hebdo</button>
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

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./client.module.css";

export default async function ClientDashboardPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = parseInt(session.user.id);

  const [activeProjectsCount, pendingQuotesCount, recentProjects] = await Promise.all([
    prisma.project.count({
      where: { userId, status: { not: "DELIVERED" } }
    }),
    prisma.quote.count({
      where: { userId, status: { in: ["PENDING", "CONTACTED", "PRICED"] } }
    }),
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 3
    })
  ]);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Bonjour, {session?.user?.name || 'Client'}</h1>
        <p className={styles.pageDescription}>Bienvenue sur votre espace de production Capsule.</p>
      </div>

      <div className={styles.dashboardGrid}>
        <Link href="/client/projects" className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Productions en cours</span>
            </div>
            <div className={styles.cardValue}>{activeProjectsCount}</div>
          </div>
        </Link>
        <Link href="/client/quotes" className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Devis en attente</span>
            </div>
            <div className={styles.cardValue}>{pendingQuotesCount}</div>
          </div>
        </Link>
      </div>

      <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-white)', marginBottom: 'var(--space-4)' }}>Vos productions récentes</h2>
      
      {recentProjects.length === 0 ? (
        <div className={styles.card}>
          <p style={{ color: 'var(--color-charcoal-400)', fontSize: 'var(--text-sm)' }}>Aucune production en cours pour le moment.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Référence</th>
                <th className={styles.th}>Produit</th>
                <th className={styles.th}>Statut</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id} className={styles.tr}>
                  <td className={styles.td} style={{ fontWeight: 600 }}>{project.reference}</td>
                  <td className={styles.td} style={{ textTransform: 'capitalize' }}>{project.product} ({project.quantity} pcs)</td>
                  <td className={styles.td}>
                    <span className={styles.badge} style={{ backgroundColor: 'rgba(196, 163, 90, 0.1)', color: 'var(--color-gold)', border: '1px solid rgba(196, 163, 90, 0.2)' }}>
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <Link href={`/client/projects/${project.id}`} className={styles.actionButton}>
                      Suivre
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

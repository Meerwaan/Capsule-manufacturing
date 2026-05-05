import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "./client.module.css";
import { PackageOpen, FileText, ArrowRight, Scissors } from "lucide-react";

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
      <div className={styles.heroBanner}>
        <h1 className={styles.pageTitle}>Bienvenue, <strong>{session?.user?.name || 'Client'}</strong></h1>
        <p className={styles.pageDescription}>
          Gérez vos collections, suivez vos productions en temps réel et consultez l'historique de vos devis depuis votre espace privilégié.
        </p>
      </div>

      <div className={styles.dashboardGrid}>
        <Link href="/client/projects" className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <PackageOpen size={20} />
              </div>
              <span className={styles.cardTitle}>Productions en cours</span>
            </div>
            <div className={styles.cardValue}>{activeProjectsCount}</div>
          </div>
        </Link>
        <Link href="/client/quotes" className={styles.cardLink}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon} style={{ color: 'var(--color-white)', background: 'rgba(255,255,255,0.1)' }}>
                <FileText size={20} />
              </div>
              <span className={styles.cardTitle}>Devis en attente</span>
            </div>
            <div className={styles.cardValue}>{pendingQuotesCount}</div>
          </div>
        </Link>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Vos productions récentes</h2>
        {recentProjects.length > 0 && (
          <Link href="/client/projects" className={styles.actionButton} style={{ border: 'none', color: 'var(--color-gold)' }}>
            Voir tout <ArrowRight size={16} />
          </Link>
        )}
      </div>
      
      {recentProjects.length === 0 ? (
        <div className={styles.emptyState}>
          <Scissors className={styles.emptyStateIcon} strokeWidth={1} />
          <h3 className={styles.emptyStateTitle}>L'atelier vous attend</h3>
          <p className={styles.emptyStateDesc}>Vous n'avez pas encore de production en cours. Confirmez un devis pour lancer la création de votre collection.</p>
          <Link href="/client/quotes" className={styles.primaryButton} style={{ marginTop: 'var(--space-4)' }}>
            Consulter mes devis
          </Link>
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
                    <span className={`${styles.badge} ${
                      project.status === "DELIVERED" ? styles.badgePaid : styles.badgeActive
                    }`}>
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <Link href={`/client/projects/${project.id}`} className={styles.actionButton}>
                      Suivre <ArrowRight size={14} />
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

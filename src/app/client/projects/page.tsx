import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../client.module.css";
import { PackageOpen, ArrowRight, Activity } from "lucide-react";

export default async function ClientProjectsPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = parseInt(session.user.id);

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.sectionHeader} style={{ marginBottom: 'var(--space-10)' }}>
        <div>
          <h1 className={styles.pageTitle}>Mes Productions</h1>
          <p className={styles.pageDescription}>Pilotez vos collections et suivez l'avancement de l'atelier en temps réel.</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <PackageOpen className={styles.emptyStateIcon} strokeWidth={1} />
          <h3 className={styles.emptyStateTitle}>Aucune production active</h3>
          <p className={styles.emptyStateDesc}>Dès que vous validerez un devis, vous pourrez suivre l'avancement de votre commande étape par étape ici.</p>
          <Link href="/client/quotes" className={styles.primaryButton} style={{ marginTop: 'var(--space-4)' }}>
            Voir mes devis
          </Link>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Référence</th>
                <th className={styles.th}>Produit</th>
                <th className={styles.th}>Quantité</th>
                <th className={styles.th}>Date de lancement</th>
                <th className={styles.th}>Statut Actuel</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className={styles.tr}>
                  <td className={styles.td} style={{ fontWeight: 600, letterSpacing: '0.05em', color: 'var(--color-gold)' }}>{project.reference}</td>
                  <td className={styles.td} style={{ textTransform: 'capitalize', fontWeight: 500 }}>{project.product}</td>
                  <td className={styles.td}>{project.quantity} pcs</td>
                  <td className={styles.td} style={{ color: 'var(--color-charcoal-300)' }}>
                    {project.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${
                      project.status === "DELIVERED" ? styles.badgePaid : styles.badgeActive
                    }`}>
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <Link href={`/client/projects/${project.id}`} className={styles.actionButton}>
                      <Activity size={14} /> Tracker
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

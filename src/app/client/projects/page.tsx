import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../client.module.css";

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
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mes Productions</h1>
        <p className={styles.pageDescription}>Suivez l'avancement de vos collections en temps réel.</p>
      </div>

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
                <td className={styles.td} style={{ fontWeight: 600 }}>{project.reference}</td>
                <td className={styles.td} style={{ textTransform: 'capitalize' }}>{project.product}</td>
                <td className={styles.td}>{project.quantity} pcs</td>
                <td className={styles.td}>{project.createdAt.toLocaleDateString('fr-FR')}</td>
                <td className={styles.td}>
                  <span className={`${styles.badge} ${
                    project.status === "DELIVERED" ? styles.badgePaid : styles.badgeActive
                  }`}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className={styles.td} style={{ textAlign: 'right' }}>
                  <Link href={`/client/projects/${project.id}`} className={styles.actionButton}>
                    Tracker
                  </Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.td} style={{ textAlign: 'center', color: 'var(--color-charcoal-400)' }}>
                  Vous n'avez aucune production en cours pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

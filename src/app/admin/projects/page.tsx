import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { user: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Production en cours</h2>
          <p className={styles.pageDescription}>Suivez l'avancement des commandes validées dans l'atelier.</p>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)' }}>
          {projects.length} projet{projects.length > 1 ? 's' : ''} actif{projects.length > 1 ? 's' : ''}
        </div>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client / Marque</th>
              <th>Produit</th>
              <th>Volume</th>
              <th>Étape Actuelle</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-gold)' }}>
                  {project.reference}
                </td>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--color-white)' }}>{project.user.brandName}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)' }}>{project.user.name}</div>
                </td>
                <td style={{ textTransform: 'capitalize' }}>
                  {project.product}
                </td>
                <td>
                  {project.quantity} PCS
                </td>
                <td>
                  <span className={styles.statusBadge} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-white)' }}>
                    {project.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link 
                    href={`/admin/projects/${project.id}`}
                    className={styles.tableActionBtn}
                  >
                    Gérer
                  </Link>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-charcoal-500)', fontStyle: 'italic' }}>
                  Aucun projet en production actuellement.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";

export default async function AdminMaterialsPage() {
  const materials = await prisma.material.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Stock Matières</h2>
          <p className={styles.pageDescription}>Gérez les réceptions de tissus et fournitures envoyés par vos clients.</p>
        </div>
        <button className={styles.btnValidate}>
          + Nouvelle Réception
        </button>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transporteur / Tracking</th>
              <th>Projet Associé</th>
              <th>Statut Livraison</th>
              <th>Date Réception</th>
              <th>Métrage / Qté</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id}>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--color-white)' }}>{material.carrier}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)', fontFamily: 'monospace' }}>{material.trackingNumber || "N/A"}</div>
                </td>
                <td>
                  <Link href={`/admin/projects/${material.projectId}`} style={{ color: 'var(--color-gold)', textDecoration: 'underline' }}>
                    {material.project.reference}
                  </Link>
                </td>
                <td>
                  {material.receivedAt ? (
                    <span className={styles.statusBadge} style={{ backgroundColor: 'rgba(39, 174, 96, 0.15)', color: 'var(--color-success)' }}>
                      REÇU
                    </span>
                  ) : (
                    <span className={styles.statusBadge} style={{ backgroundColor: 'rgba(196, 163, 90, 0.15)', color: 'var(--color-gold)' }}>
                      EN TRANSIT
                    </span>
                  )}
                </td>
                <td>
                  {material.receivedAt ? material.receivedAt.toLocaleDateString("fr-FR") : "En attente"}
                </td>
                <td>
                  {material.quantityMeters ? `${material.quantityMeters} m` : "Non défini"}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className={styles.tableActionBtn}>
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-charcoal-500)', fontStyle: 'italic' }}>
                  Aucun colis de matière enregistré.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

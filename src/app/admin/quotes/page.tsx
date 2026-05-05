import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";

export default async function AdminQuotesPage() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Devis reçus</h2>
          <p className={styles.pageDescription}>Gérez vos prospects et qualifiez les projets industriels.</p>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)' }}>
          {quotes.length} dossier{quotes.length > 1 ? 's' : ''} au total
        </div>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client / Marque</th>
              <th>Produit</th>
              <th>Volume</th>
              <th>Total Est.</th>
              <th>Statut</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td>
                  <div style={{ fontWeight: 500, color: 'var(--color-white)' }}>{quote.brandName}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-charcoal-300)' }}>{quote.contactName}</div>
                </td>
                <td style={{ textTransform: 'capitalize' }}>
                  {quote.product} <span style={{ color: 'var(--color-charcoal-500)' }}>({quote.materialType})</span>
                </td>
                <td>
                  {quote.quantity} PCS
                </td>
                <td style={{ fontFamily: 'monospace', color: 'var(--color-charcoal-100)' }}>
                  {quote.totalPrice?.toLocaleString("fr-FR")}€
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${quote.status === "PENDING" ? styles.statusPending : styles.statusValidated}`}>
                    {quote.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link 
                    href={`/admin/quotes/${quote.id}`}
                    className={styles.tableActionBtn}
                  >
                    Voir dossier
                  </Link>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-charcoal-500)', fontStyle: 'italic' }}>
                  Aucun devis reçu pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

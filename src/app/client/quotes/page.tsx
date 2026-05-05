import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../client.module.css";
import { FileText, ArrowRight, Eye } from "lucide-react";

export default async function ClientQuotesPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = parseInt(session.user.id);

  const quotes = await prisma.quote.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className={styles.sectionHeader} style={{ marginBottom: 'var(--space-10)' }}>
        <div>
          <h1 className={styles.pageTitle}>Mes Devis</h1>
          <p className={styles.pageDescription}>Retrouvez l'historique complet de vos demandes de chiffrage.</p>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className={styles.emptyState}>
          <FileText className={styles.emptyStateIcon} strokeWidth={1} />
          <h3 className={styles.emptyStateTitle}>Aucun devis pour le moment</h3>
          <p className={styles.emptyStateDesc}>Vous n'avez pas encore fait de demande de chiffrage auprès de l'atelier.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Date</th>
                <th className={styles.th}>Produit</th>
                <th className={styles.th}>Quantité</th>
                <th className={styles.th}>Total HT</th>
                <th className={styles.th}>Statut</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className={styles.tr}>
                  <td className={styles.td} style={{ color: 'var(--color-charcoal-300)' }}>
                    {quote.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={styles.td} style={{ textTransform: 'capitalize', fontWeight: 500 }}>{quote.product}</td>
                  <td className={styles.td}>{quote.quantity} pcs</td>
                  <td className={styles.td} style={{ fontFamily: 'monospace', fontSize: 'var(--text-base)' }}>
                    {quote.totalPrice ? `${quote.totalPrice.toFixed(2)} €` : '-'}
                  </td>
                  <td className={styles.td}>
                    <span className={`${styles.badge} ${
                      quote.status === "PENDING" ? styles.badgePending : 
                      quote.status === "PRICED" ? styles.badgePriced : 
                      (quote.status === "PAID" || quote.status === "VALIDATED") ? styles.badgePaid : ''
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <Link href={`/client/quotes/${quote.id}`} className={styles.actionButton}>
                      <Eye size={14} /> Voir
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

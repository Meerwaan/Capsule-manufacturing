import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import styles from "../client.module.css";

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
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Mes Devis</h1>
        <p className={styles.pageDescription}>Retrouvez l'historique de vos demandes de chiffrage.</p>
      </div>

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
                <td className={styles.td}>{quote.createdAt.toLocaleDateString('fr-FR')}</td>
                <td className={styles.td} style={{ textTransform: 'capitalize' }}>{quote.product}</td>
                <td className={styles.td}>{quote.quantity} pcs</td>
                <td className={styles.td}>{quote.totalPrice ? `${quote.totalPrice} €` : '-'}</td>
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
                    Voir le devis
                  </Link>
                </td>
              </tr>
            ))}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.td} style={{ textAlign: 'center', color: 'var(--color-charcoal-400)' }}>
                  Vous n'avez aucun devis en cours.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

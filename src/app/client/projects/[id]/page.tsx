import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import styles from "../../client.module.css";

const STATUSES = [
  { value: "QUOTE_VALIDATED", label: "Commande Validée" },
  { value: "AWAITING_MATERIAL", label: "Préparation des matières" },
  { value: "MATERIAL_RECEIVED", label: "Matières prêtes" },
  { value: "CUTTING", label: "Atelier Coupe" },
  { value: "SEWING", label: "Atelier Couture" },
  { value: "QUALITY_CHECK", label: "Contrôle Qualité" },
  { value: "READY_TO_SHIP", label: "Préparation logistique" },
  { value: "SHIPPED", label: "Expédié" },
  { value: "DELIVERED", label: "Livré" }
];

export default async function ClientProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = parseInt(session.user.id);

  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  
  if (isNaN(projectId)) notFound();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) notFound();

  // Sécurité
  if (project.userId !== userId) {
    redirect("/client/projects");
  }

  const currentStatusIndex = STATUSES.findIndex(s => s.value === project.status);

  return (
    <div>
      <div className={styles.pageHeader}>
        <Link href="/client/projects" style={{ color: 'var(--color-charcoal-300)', textDecoration: 'none', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)', display: 'inline-block' }}>
          ← Retour aux productions
        </Link>
        <h1 className={styles.pageTitle}>{project.reference}</h1>
        <p className={styles.pageDescription}>
          Démarré le {project.createdAt.toLocaleDateString("fr-FR")} — {project.quantity}x {project.product}
        </p>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
          <h2 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--color-charcoal-700)', paddingBottom: 'var(--space-2)' }}>
            Suivi en temps réel de votre collection
          </h2>
          
          <div className={styles.timeline}>
            {STATUSES.map((status, index) => {
              const isPast = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isFuture = index > currentStatusIndex;

              return (
                <div key={status.value} className={styles.timelineItem}>
                  <div className={styles.timelineIndicator}>
                    <div className={`${styles.timelineDot} ${isPast ? styles.timelineDotPast : ''} ${isCurrent ? styles.timelineDotActive : ''}`} />
                    {index < STATUSES.length - 1 && (
                      <div className={`${styles.timelineLine} ${isPast ? styles.timelineLineActive : ''}`} />
                    )}
                  </div>
                  <div className={styles.timelineContent}>
                    <h4 className={`${styles.timelineTitle} ${isFuture ? styles.timelineTitleMuted : ''}`}>
                      {status.label}
                    </h4>
                    {isCurrent && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Étape en cours
                      </span>
                    )}
                    {isPast && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 500 }}>
                        Terminé
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

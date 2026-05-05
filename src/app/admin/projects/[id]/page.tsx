import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../admin.module.css";
import ProjectTracker from "@/components/admin/ProjectTracker";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  
  if (isNaN(projectId)) notFound();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: true,
      quote: true
    }
  });

  if (!project) notFound();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.pageHeader}>
        <div>
          <Link href="/admin/projects" className={styles.backLink}>
            ← Retour à la production
          </Link>
          <h2 className={styles.pageTitle}>{project.reference}</h2>
          <p className={styles.pageDescription}>
            Démarré le {project.createdAt.toLocaleDateString("fr-FR")} 
            — Client: <span style={{ fontWeight: 600, color: 'var(--color-white)' }}>{project.user.brandName}</span>
          </p>
        </div>
      </header>

      <div className={styles.detailGrid}>
        {/* Résumé de production */}
        <section className={styles.panel}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Détails Fabrication</h3>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Produit / Modèle</p>
            <p className={`${styles.infoValue} ${styles.capitalize}`}>{project.product}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Volume à produire</p>
            <p className={styles.infoValue}>{project.quantity} pièces</p>
          </div>
          {project.quote && (
            <>
              <div className={styles.infoGroup}>
                <p className={styles.infoLabel}>Matière sélectionnée</p>
                <p className={styles.infoValue}>{project.quote.materialType} — {project.quote.grammage}</p>
              </div>
              <div className={styles.infoGroup}>
                <p className={styles.infoLabel}>Marquage / Impression</p>
                <p className={styles.infoValue}>{project.quote.branding} ({project.quote.brandingLocations} loc.)</p>
              </div>
              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-charcoal-700)' }}>
                <Link href={`/admin/quotes/${project.quote.id}`} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gold)', textDecoration: 'none' }}>
                  → Consulter le devis et fichiers techniques
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Tracker d'avancement */}
        <section className={styles.panel} style={{ gridRow: 'span 2' }}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottomColor: 'var(--color-charcoal-700)' }}>
            Suivi de Production (Timeline)
          </h3>
          <ProjectTracker projectId={project.id} currentStatus={project.status} />
        </section>
        
        {/* Logistique & Expédition */}
        <section className={styles.panel}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Logistique & Livraison
          </h3>
          {project.shipments && project.shipments.length > 0 ? (
            <>
              <div className={styles.infoGroup}>
                <p className={styles.infoLabel}>Adresse de Livraison</p>
                <p className={styles.infoValue} style={{ whiteSpace: 'pre-line', lineHeight: 1.5, backgroundColor: 'var(--color-charcoal-800)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginTop: 'var(--space-2)' }}>
                  {project.shipments[0].address || "Aucune adresse renseignée"}
                </p>
              </div>
              
              <div style={{ marginTop: 'var(--space-6)' }}>
                <Link href={`/admin/projects/${project.id}/delivery-slip`} target="_blank" className={styles.primaryButton} style={{ width: '100%', display: 'flex', justifyContent: 'center', textDecoration: 'none', background: 'var(--color-gold)', color: 'var(--color-charcoal-900)' }}>
                  📄 Générer le Bon de Livraison (PDF)
                </Link>
              </div>
            </>
          ) : (
            <div className={styles.infoGroup}>
              <p className={styles.infoLabel}>Adresse de Livraison</p>
              <p className={styles.infoValue} style={{ color: 'var(--color-charcoal-400)', fontStyle: 'italic' }}>En attente de saisie par le client.</p>
            </div>
          )}
        </section>

        {/* Contact Client */}
        <section className={styles.panel}>
          <h3 className={styles.panelTitle} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-charcoal-300)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Client</h3>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Interlocuteur</p>
            <p className={styles.infoValue}>{project.user.name}</p>
          </div>
          <div className={styles.infoGroup}>
            <p className={styles.infoLabel}>Email</p>
            <p className={styles.infoValue}>{project.user.email}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import styles from "../../client.module.css";
import { ArrowLeft, Check, Clock, PackageCheck } from "lucide-react";

import ShippingAddressForm from "@/components/client/ShippingAddressForm";

const STATUSES = [
  { value: "QUOTE_VALIDATED", label: "Commande Validée", desc: "La commande est officiellement enregistrée." },
  { value: "AWAITING_MATERIAL", label: "Préparation des matières", desc: "En attente de réception des tissus ou accessoires." },
  { value: "MATERIAL_RECEIVED", label: "Matières prêtes", desc: "Tout le matériel est validé en stock." },
  { value: "CUTTING", label: "Atelier Coupe", desc: "Découpe minutieuse selon les patrons." },
  { value: "SEWING", label: "Atelier Couture", desc: "Confection et assemblage sur nos lignes." },
  { value: "QUALITY_CHECK", label: "Contrôle Qualité", desc: "Inspection rigoureuse de chaque pièce." },
  { value: "READY_TO_SHIP", label: "Préparation logistique", desc: "Emballage et conditionnement." },
  { value: "SHIPPED", label: "Expédié", desc: "Colis remis au transporteur." },
  { value: "DELIVERED", label: "Livré", desc: "Réception confirmée par la marque." }
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
    include: { shipments: true }
  });

  if (!project) notFound();

  if (project.userId !== userId) {
    redirect("/client/projects");
  }

  const currentStatusIndex = STATUSES.findIndex(s => s.value === project.status);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <Link href="/client/projects" style={{ color: 'var(--color-charcoal-400)', textDecoration: 'none', fontSize: 'var(--text-sm)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', transition: 'color 0.2s' }}>
          <ArrowLeft size={16} /> Retour aux productions
        </Link>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1 className={styles.pageTitle} style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>
              Collection <strong style={{ letterSpacing: '0.05em' }}>{project.reference}</strong>
            </h1>
            <p className={styles.pageDescription}>
              Production de {project.quantity}x {project.product} — Démarrée le {project.createdAt.toLocaleDateString("fr-FR")}
            </p>
          </div>
          
          <div style={{ textAlign: 'right', alignSelf: 'center' }}>
            <span className={`${styles.badge} ${project.status === 'DELIVERED' ? styles.badgePaid : styles.badgeActive}`} style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-xs)' }}>
              {project.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>
      
      <ShippingAddressForm 
        projectId={project.id} 
        initialAddress={project.shipments && project.shipments.length > 0 ? project.shipments[0].address : null} 
        isEditable={project.status !== "SHIPPED" && project.status !== "DELIVERED"} 
      />

      <div className={styles.card} style={{ padding: 'var(--space-10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-10)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 'var(--space-4)' }}>
          <div style={{ backgroundColor: 'rgba(196,163,90,0.1)', color: 'var(--color-gold)', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            <PackageCheck size={24} />
          </div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--color-white)', fontWeight: 400 }}>
            Tracker Temps Réel
          </h2>
        </div>
        
        <div className={styles.timeline}>
          {STATUSES.map((status, index) => {
            const isPast = index < currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const isFuture = index > currentStatusIndex;

            return (
              <div key={status.value} className={styles.timelineItem} style={{ opacity: isFuture ? 0.4 : 1, transition: 'opacity 0.3s ease' }}>
                <div className={styles.timelineIndicator}>
                  <div className={`${styles.timelineDot} ${isPast ? styles.timelineDotPast : ''} ${isCurrent ? styles.timelineDotActive : ''}`}>
                    {isPast && <Check size={8} color="var(--color-charcoal-900)" style={{ margin: 'auto', display: 'block' }} strokeWidth={4} />}
                  </div>
                  {index < STATUSES.length - 1 && (
                    <div className={`${styles.timelineLine} ${isPast ? styles.timelineLineActive : ''}`} />
                  )}
                </div>
                <div className={styles.timelineContent}>
                  <h4 className={`${styles.timelineTitle} ${isCurrent ? styles.timelineTitleActive : ''} ${isFuture ? styles.timelineTitleMuted : ''}`}>
                    {status.label}
                  </h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: isCurrent ? 'var(--color-white)' : 'var(--color-charcoal-400)', marginTop: 'var(--space-1)', transition: 'color 0.3s ease' }}>
                    {status.desc}
                  </p>
                  
                  {isCurrent && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)', backgroundColor: 'rgba(196,163,90,0.1)', border: '1px solid rgba(196,163,90,0.3)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-full)', color: 'var(--color-gold)', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <Clock size={12} className={styles.animatePulse} />
                      Étape en cours
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function DeliverySlipPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectId = parseInt(resolvedParams.id);
  
  if (isNaN(projectId)) notFound();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: true,
      quote: true,
      shipments: true
    }
  });

  if (!project) notFound();

  const shipment = project.shipments && project.shipments.length > 0 ? project.shipments[0] : null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { background: white; color: black; -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
        body {
          background-color: #f0f0f0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: #333;
        }
        .a4-sheet {
          width: 210mm;
          min-height: 297mm;
          background: white;
          margin: 40px auto;
          padding: 20mm;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          box-sizing: border-box;
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #000;
          padding-bottom: 20px;
          margin-bottom: 40px;
        }
        .logo { font-size: 24px; font-weight: bold; letter-spacing: 2px; }
        .logo span { font-weight: 300; }
        .doc-title { font-size: 28px; text-transform: uppercase; font-weight: 800; color: #000; text-align: right; }
        
        .addresses {
          display: flex;
          justify-content: space-between;
          margin-bottom: 50px;
        }
        .address-block { width: 45%; }
        .address-title { font-size: 12px; text-transform: uppercase; color: #666; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .address-content { font-size: 14px; line-height: 1.6; white-space: pre-line; }
        
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        .info-table th { background: #f9f9f9; text-align: left; padding: 10px; font-size: 12px; text-transform: uppercase; color: #666; border: 1px solid #ddd; }
        .info-table td { padding: 12px 10px; font-size: 14px; border: 1px solid #ddd; font-weight: bold; }
        
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 60px;
        }
        .items-table th { background: #000; color: #fff; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; }
        .items-table td { padding: 15px 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        
        .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 80px;
        }
        .signature-box {
          width: 45%;
          border: 1px solid #000;
          height: 120px;
          padding: 10px;
          position: relative;
        }
        .signature-title { font-size: 12px; font-weight: bold; text-transform: uppercase; }
        
        .footer {
          position: absolute;
          bottom: 20mm;
          left: 20mm;
          right: 20mm;
          text-align: center;
          font-size: 10px;
          color: #999;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }
        
        .print-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #000;
          color: #fff;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          font-weight: bold;
          border-radius: 4px;
        }
      `}} />
      
      <button className="print-btn no-print" onClick={() => window.print()}>🖨️ Imprimer / Sauvegarder en PDF</button>

      <div className="a4-sheet">
        <div className="header">
          <div className="logo">CAPSULE <span>MANUFACTURING</span></div>
          <div className="doc-title">Bon de Livraison</div>
        </div>

        <div className="addresses">
          <div className="address-block">
            <div className="address-title">Expéditeur (Usine)</div>
            <div className="address-content">
              <strong>CAPSULE MANUFACTURING</strong><br/>
              123 Avenue de l'Industrie<br/>
              75001 Paris, FRANCE<br/>
              contact@capsule-manufacturing.com
            </div>
          </div>
          
          <div className="address-block">
            <div className="address-title">Destinataire (Client)</div>
            <div className="address-content">
              {shipment?.address || (
                <span style={{ color: 'red' }}>ATTENTION: AUCUNE ADRESSE RENSEIGNÉE</span>
              )}
            </div>
          </div>
        </div>

        <table className="info-table">
          <thead>
            <tr>
              <th>Référence Commande</th>
              <th>Date d'expédition</th>
              <th>Contact Client</th>
              <th>Transporteur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{project.reference}</td>
              <td>{new Date().toLocaleDateString('fr-FR')}</td>
              <td>{project.user.name || project.user.brandName}</td>
              <td>{shipment?.carrier || "Standard"}</td>
            </tr>
          </tbody>
        </table>

        <div className="address-title">Contenu de l'expédition</div>
        <table className="items-table">
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Matière & Spécifications</th>
              <th style={{ textAlign: 'center' }}>Quantité</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{project.product}</td>
              <td>
                {project.quote ? (
                  <>
                    {project.quote.materialType} ({project.quote.grammage})<br/>
                    <span style={{ fontSize: '12px', color: '#666' }}>Marquage: {project.quote.branding}</span>
                  </>
                ) : "Spécifications standard"}
              </td>
              <td style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>{project.quantity}</td>
            </tr>
          </tbody>
        </table>

        <div className="signatures">
          <div className="signature-box">
            <div className="signature-title">Signature Transporteur (Prise en charge)</div>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: '#999' }}>Date : __/__/____</div>
          </div>
          <div className="signature-box">
            <div className="signature-title">Signature Destinataire (Réception)</div>
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', color: '#999' }}>Date : __/__/____</div>
          </div>
        </div>

        <div className="footer">
          Capsule Manufacturing — Document généré automatiquement — Réf: {project.reference}
        </div>
      </div>
    </>
  );
}

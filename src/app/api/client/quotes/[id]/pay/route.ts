import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // @ts-ignore
    const userId = parseInt(session.user.id);

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const quote = await prisma.quote.findUnique({ where: { id } });
    if (!quote) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });

    // Vérifier que le devis appartient bien à ce client
    if (quote.userId !== userId) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Vérifier que le devis est bien au statut PRICED (attente de paiement)
    if (quote.status !== "PRICED") {
      return NextResponse.json({ error: "Ce devis ne peut pas être payé actuellement" }, { status: 400 });
    }

    // Simulation du paiement Stripe réussie...
    
    const body = await request.json().catch(() => ({}));
    const shippingAddress = body.shippingAddress || "Adresse non fournie";

    // 1. Mettre à jour le statut du devis
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: { status: "PAID" },
    });

    // 2. Créer le projet de production ET le bon d'expédition (Shipment)
    const ref = `PRJ-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
    
    let existingProject = await prisma.project.findUnique({ where: { quoteId: id } });
    if (!existingProject) {
      existingProject = await prisma.project.create({
        data: {
          userId: userId,
          quoteId: id,
          reference: ref,
          product: quote.product,
          quantity: quote.quantity,
          status: "QUOTE_VALIDATED",
          shipments: {
            create: {
              address: shippingAddress,
              type: "TO_CLIENT_WAREHOUSE"
            }
          }
        }
      });
    }

    return NextResponse.json(updatedQuote);
  } catch (error: any) {
    console.error("Erreur paiement devis client:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

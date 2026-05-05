import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const body = await request.json();
    const { unitPrice, setupFees, leadTime, status } = body;

    const quote = await prisma.quote.findUnique({ where: { id } });
    if (!quote) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });

    const totalPrice = status === "VALIDATED" && unitPrice !== undefined
      ? (unitPrice * quote.quantity) + (setupFees || 0)
      : quote.totalPrice;

    // Mise à jour du devis
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        unitPrice,
        setupFees,
        leadTime,
        totalPrice,
        status,
      },
    });

    // Si validé, on crée un Projet (Production)
    if (status === "VALIDATED" && quote.userId) {
      // On génère une référence unique type PROJ-2024-XXXX
      const ref = `PRJ-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
      
      // Vérifier si le projet existe déjà
      const existingProject = await prisma.project.findUnique({ where: { quoteId: id } });
      if (!existingProject) {
        await prisma.project.create({
          data: {
            userId: quote.userId,
            quoteId: id,
            reference: ref,
            product: quote.product,
            quantity: quote.quantity,
            status: "QUOTE_VALIDATED"
          }
        });
      }
    }

    return NextResponse.json(updatedQuote);
  } catch (error: any) {
    console.error("Erreur mise à jour devis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

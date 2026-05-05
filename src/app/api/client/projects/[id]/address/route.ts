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
    if (!session || session.user.role !== "CLIENT") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // @ts-ignore
    const userId = parseInt(session.user.id);

    const resolvedParams = await params;
    const projectId = parseInt(resolvedParams.id);
    if (isNaN(projectId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const body = await request.json();
    const { address } = body;

    if (!address || !address.trim()) {
      return NextResponse.json({ error: "L'adresse ne peut pas être vide" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { shipments: true }
    });

    if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

    // Vérifier que le projet appartient bien à ce client
    if (project.userId !== userId) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // Empêcher la modification si le statut est expédié
    if (project.status === "SHIPPED" || project.status === "DELIVERED") {
      return NextResponse.json({ error: "L'adresse ne peut plus être modifiée à cette étape" }, { status: 400 });
    }

    if (project.shipments && project.shipments.length > 0) {
      // Mettre à jour le shipment existant
      await prisma.shipment.update({
        where: { id: project.shipments[0].id },
        data: { address: address.trim() }
      });
    } else {
      // Créer un nouveau shipment
      await prisma.shipment.create({
        data: {
          projectId: project.id,
          address: address.trim(),
          type: "TO_CLIENT_WAREHOUSE"
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur mise à jour adresse:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

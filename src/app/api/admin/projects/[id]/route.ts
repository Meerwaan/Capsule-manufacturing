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
    const { status } = body;

    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(project);
  } catch (error: any) {
    console.error("Erreur mise à jour projet:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

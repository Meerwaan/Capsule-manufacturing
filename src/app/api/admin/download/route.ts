import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  // Protection stricte : Seul l'admin peut télécharger
  // @ts-ignore
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "uploads", fileName);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Fichier non trouvé" }, { status: 404 });
  }
}

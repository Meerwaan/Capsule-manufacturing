import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extraction des champs texte
    const product = formData.get("product") as string;
    const quantity = formData.get("quantity") as string;
    const materialType = formData.get("materialType") as string;
    const grammage = formData.get("grammage") as string;
    const branding = formData.get("branding") as string;
    const brandingLocations = formData.get("brandingLocations") as string;
    const neckLabel = formData.get("neckLabel") as string;
    const hangtag = formData.get("hangtag") as string;
    const packaging = formData.get("packaging") as string;
    const hasPatron = formData.get("hasPatron") as string;
    const wantsPrototype = formData.get("wantsPrototype") as string;
    const brandName = formData.get("brandName") as string;
    const contactName = formData.get("contactName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;
    
    // Extraction de l'estimation (JSON stringifié dans le FormData)
    const estimateStr = formData.get("estimate") as string;
    const estimate = JSON.parse(estimateStr);

    // Gestion des fichiers
    const schemaFile = formData.get("file-schema") as File | null;
    const patronFile = formData.get("file-patron") as File | null;

    let schemaPath = null;
    let patronPath = null;

    // Dossier de stockage PRIVÉ (hors du dossier public)
    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    if (schemaFile && schemaFile.size > 0) {
      const bytes = await schemaFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-schema-${schemaFile.name.replace(/\s+/g, "_")}`;
      schemaPath = filename;
      await writeFile(path.join(uploadDir, filename), buffer);
    }

    if (patronFile && patronFile.size > 0) {
      const bytes = await patronFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-patron-${patronFile.name.replace(/\s+/g, "_")}`;
      patronPath = filename;
      await writeFile(path.join(uploadDir, filename), buffer);
    }

    // Enregistrement dans la base de données
    const quote = await prisma.quote.create({
      data: {
        product,
        quantity: Number(quantity),
        materialType,
        grammage,
        branding,
        brandingLocations: Number(brandingLocations),
        neckLabel,
        hangtag,
        packaging,
        hasPatron,
        wantsPrototype,
        brandName,
        contactName,
        email,
        phone,
        notes,
        schemaFile: schemaPath,
        patronFile: patronPath,
        unitPrice: estimate?.unitPrice,
        totalPrice: estimate?.total,
        setupFees: estimate?.setupFees,
        leadTime: estimate?.leadTime,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, quoteId: quote.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création du devis" },
      { status: 500 }
    );
  }
}

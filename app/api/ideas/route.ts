import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";

interface Comentario {
  userId: string;
  texto: string;
  createdAt: Date;
}

interface IdeaDocument {
  titulo: string;
  descricao?: string;
  tags: string[];
  autorId: string;
  upvotes: string[];
  downvotes: string[];
  comentarios: Comentario[];
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { titulo, descricao, tags } = body;

    if (!titulo || typeof titulo !== "string" || titulo.trim().length === 0) {
      return NextResponse.json(
        { error: "Titulo is required" },
        { status: 400 }
      );
    }

    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: "Tags must be an array" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const ideasCollection = db.collection<IdeaDocument>("ideas");

    const newIdea: IdeaDocument = {
      titulo: titulo.trim(),
      descricao: descricao?.trim() || "",
      tags: tags || [],
      autorId: session.user.id,
      upvotes: [],
      downvotes: [],
      comentarios: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ideasCollection.insertOne(newIdea);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...newIdea,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

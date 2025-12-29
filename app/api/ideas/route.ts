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

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get("sortBy") || "newest";
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    const db = await getDb();
    const ideasCollection = db.collection<IdeaDocument>("ideas");

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === "popular") {
      sortOption = { upvotes: -1, createdAt: -1 };
    }

    const ideas = await ideasCollection
      .find({})
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .toArray();

    const total = await ideasCollection.countDocuments();

    const formattedIdeas = ideas.map((idea) => ({
      id: idea._id?.toString(),
      titulo: idea.titulo,
      descricao: idea.descricao,
      tags: idea.tags,
      autorId: idea.autorId,
      upvotes: idea.upvotes?.length || 0,
      downvotes: idea.downvotes?.length || 0,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
    }));

    return NextResponse.json(
      {
        data: formattedIdeas,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

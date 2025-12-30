import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

interface Comentario {
  userId: string;
  texto: string;
  createdAt: Date;
}

interface IdeaDocument {
  _id?: ObjectId;
  titulo: string;
  descricao?: string;
  tags: string[];
  autorId: string;
  autorName: string;
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
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (
      !descricao ||
      typeof descricao !== "string" ||
      descricao.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Description with content is required" },
        { status: 400 }
      );
    }

    if (!tags || !Array.isArray(tags) || tags.length < 3) {
      return NextResponse.json(
        { error: "At least 3 tags are required" },
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
      autorName: session.user.name || "Anonymous",
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

    let ideas;

    if (sortBy === "popular") {
      ideas = await ideasCollection
        .aggregate<IdeaDocument>([
          {
            $addFields: {
              score: {
                $subtract: [{ $size: "$upvotes" }, { $size: "$downvotes" }],
              },
            },
          },
          { $sort: { score: -1, createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ])
        .toArray();
    } else {
      ideas = await ideasCollection
        .find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    const total = await ideasCollection.countDocuments();

    const formattedIdeas = ideas.map((idea) => ({
      id: idea._id?.toString(),
      titulo: idea.titulo,
      descricao: idea.descricao,
      tags: idea.tags,
      autorId: idea.autorId,
      autorName: idea.autorName || "Anonymous",
      upvotes: idea.upvotes?.length || 0,
      downvotes: idea.downvotes?.length || 0,
      didUpvote: session.user?.id
        ? idea.upvotes?.includes(session.user.id) || false
        : false,
      didDownvote: session.user?.id
        ? idea.downvotes?.includes(session.user.id) || false
        : false,
      comentarios: idea.comentarios || [],
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

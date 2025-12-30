import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    const ideasCollection = db.collection("ideas");

    const idea = await ideasCollection.findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const formattedIdea = {
      id: idea._id.toString(),
      titulo: idea.titulo,
      descricao: idea.descricao,
      tags: idea.tags,
      autorId: idea.autorId,
      autorName: idea.autorName || "Anonymous",
      upvotes: idea.upvotes?.length || 0,
      downvotes: idea.downvotes?.length || 0,
      didUpvote: idea.upvotes?.includes(session.user.id) || false,
      didDownvote: idea.downvotes?.includes(session.user.id) || false,
      commentCount: idea.comentarios?.length || 0,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
    };

    return NextResponse.json(formattedIdea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

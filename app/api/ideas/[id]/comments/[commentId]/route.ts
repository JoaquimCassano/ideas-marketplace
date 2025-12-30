import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

interface Comment {
  _id: ObjectId;
  userId: string;
  userName: string;
  texto: string;
  parentCommentId?: string;
  depth: number;
  upvotes: string[];
  downvotes: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, commentId } = await params;

    if (!ObjectId.isValid(id) || !ObjectId.isValid(commentId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await getDb();
    const ideasCollection = db.collection("ideas");

    const idea = await ideasCollection.findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const commentIndex = idea.comentarios?.findIndex(
      (c: Comment) => c._id.toString() === commentId
    );

    if (commentIndex === -1 || commentIndex === undefined) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    const comment = idea.comentarios[commentIndex];

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    await ideasCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          [`comentarios.${commentIndex}.isDeleted`]: true,
          [`comentarios.${commentIndex}.texto`]: "[deleted]",
          [`comentarios.${commentIndex}.updatedAt`]: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

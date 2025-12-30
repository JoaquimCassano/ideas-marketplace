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

export async function PUT(
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

    const body = await request.json();
    const { voteType } = body;

    if (!["upvote", "downvote"].includes(voteType)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
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
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const comment = idea.comentarios[commentIndex];
    const hasUpvoted = comment.upvotes?.includes(session.user.id) || false;
    const hasDownvoted = comment.downvotes?.includes(session.user.id) || false;

    const updateOperation: Record<string, unknown> = {
      $set: { [`comentarios.${commentIndex}.updatedAt`]: new Date() },
    };

    if (voteType === "upvote") {
      if (hasUpvoted) {
        updateOperation.$pull = {
          [`comentarios.${commentIndex}.upvotes`]: session.user.id,
        };
      } else {
        updateOperation.$addToSet = {
          [`comentarios.${commentIndex}.upvotes`]: session.user.id,
        };
        if (hasDownvoted) {
          updateOperation.$pull = {
            [`comentarios.${commentIndex}.downvotes`]: session.user.id,
          };
        }
      }
    } else {
      if (hasDownvoted) {
        updateOperation.$pull = {
          [`comentarios.${commentIndex}.downvotes`]: session.user.id,
        };
      } else {
        updateOperation.$addToSet = {
          [`comentarios.${commentIndex}.downvotes`]: session.user.id,
        };
        if (hasUpvoted) {
          updateOperation.$pull = {
            [`comentarios.${commentIndex}.upvotes`]: session.user.id,
          };
        }
      }
    }

    await ideasCollection.updateOne({ _id: new ObjectId(id) }, updateOperation);

    const updatedIdea = await ideasCollection.findOne({
      _id: new ObjectId(id),
    });
    const updatedComment = updatedIdea?.comentarios[commentIndex];

    return NextResponse.json({
      upvotes: updatedComment.upvotes?.length || 0,
      downvotes: updatedComment.downvotes?.length || 0,
      didUpvote: updatedComment.upvotes?.includes(session.user.id) || false,
      didDownvote: updatedComment.downvotes?.includes(session.user.id) || false,
    });
  } catch (error) {
    console.error("Error voting on comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

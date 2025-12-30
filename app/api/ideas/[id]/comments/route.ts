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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    const db = await getDb();
    const ideasCollection = db.collection("ideas");

    const idea = await ideasCollection.findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const allComments = idea.comentarios || [];
    const totalComments = allComments.length;
    const paginatedComments = allComments.slice(skip, skip + limit);

    const formattedComments = paginatedComments.map((comment: Comment) => ({
      id: comment._id.toString(),
      userId: comment.userId,
      userName: comment.userName,
      texto: comment.texto,
      parentCommentId: comment.parentCommentId,
      depth: comment.depth,
      upvotes: comment.upvotes?.length || 0,
      downvotes: comment.downvotes?.length || 0,
      didUpvote: session.user?.id
        ? comment.upvotes?.includes(session.user.id) || false
        : false,
      didDownvote: session.user?.id
        ? comment.downvotes?.includes(session.user.id) || false
        : false,
      isDeleted: comment.isDeleted || false,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return NextResponse.json({
      comments: formattedComments,
      total: totalComments,
      hasMore: skip + limit < totalComments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json();
    const { texto, parentCommentId } = body;

    if (!texto || typeof texto !== "string" || texto.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    if (texto.length > 10000) {
      return NextResponse.json(
        { error: "Comment too long (max 10,000 characters)" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const ideasCollection = db.collection("ideas");

    const idea = await ideasCollection.findOne({ _id: new ObjectId(id) });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    let depth = 0;
    if (parentCommentId) {
      const parentComment = idea.comentarios?.find(
        (c: Comment) => c._id.toString() === parentCommentId
      );

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }

      depth = parentComment.depth + 1;

      if (depth > 6) {
        return NextResponse.json(
          { error: "Maximum nesting depth reached" },
          { status: 400 }
        );
      }
    }

    const newComment = {
      _id: new ObjectId(),
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      texto: texto.trim(),
      parentCommentId: parentCommentId || null,
      depth,
      upvotes: [],
      downvotes: [],
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ideasCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { comentarios: newComment as unknown as never },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json(
      {
        id: newComment._id.toString(),
        userId: newComment.userId,
        userName: newComment.userName,
        texto: newComment.texto,
        parentCommentId: newComment.parentCommentId,
        depth: newComment.depth,
        upvotes: 0,
        downvotes: 0,
        didUpvote: false,
        didDownvote: false,
        isDeleted: false,
        createdAt: newComment.createdAt,
        updatedAt: newComment.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

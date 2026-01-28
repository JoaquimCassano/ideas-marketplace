import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { voteType } = body;

    if (voteType !== "upvote" && voteType !== "downvote") {
      return NextResponse.json(
        { error: "Vote type must be 'upvote' or 'downvote'" },
        { status: 400 },
      );
    }

    const { id: ideaId } = await params;
    if (!ObjectId.isValid(ideaId)) {
      return NextResponse.json({ error: "Invalid idea ID" }, { status: 400 });
    }

    const db = await getDb();
    const ideasCollection = db.collection("ideas");

    const idea = await ideasCollection.findOne({ _id: new ObjectId(ideaId) });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const upvotes = idea.upvotes || [];
    const downvotes = idea.downvotes || [];

    const hasUpvoted = upvotes.includes(userId);
    const hasDownvoted = downvotes.includes(userId);

    // Prepare DB update operations
    let updateOperation: Record<string, unknown> = {};
    let creditsOperation: Record<string, unknown> = {};

    if (voteType === "upvote") {
      if (hasUpvoted) {
        // Toggle off upvote
        updateOperation = {
          $pull: { upvotes: userId },
          $set: { updatedAt: new Date() },
        };
        // Removing an upvote should decrement author's credits
        creditsOperation = { $inc: { credits: -1 } };
      } else {
        // Add upvote (and remove potential downvote)
        updateOperation = {
          $addToSet: { upvotes: userId },
          $pull: { downvotes: userId },
          $set: { updatedAt: new Date() },
        };
        // Adding an upvote should increase author's credits
        creditsOperation = { $inc: { credits: 1 } };
      }
    } else {
      // voteType === "downvote"
      if (hasDownvoted) {
        // Toggle off downvote
        updateOperation = {
          $pull: { downvotes: userId },
          $set: { updatedAt: new Date() },
        };
        // Removing a downvote should restore author's credits
        creditsOperation = { $inc: { credits: 1 } };
      } else {
        // Add downvote (and remove potential upvote)
        updateOperation = {
          $addToSet: { downvotes: userId },
          $pull: { upvotes: userId },
          $set: { updatedAt: new Date() },
        };
        // Adding a downvote should decrement author's credits
        creditsOperation = { $inc: { credits: -1 } };
      }
    }

    // Apply idea vote update
    if (Object.keys(updateOperation).length > 0) {
      await ideasCollection.updateOne(
        { _id: new ObjectId(ideaId) },
        updateOperation,
      );
    }

    // Apply credits update for the idea author only if we have a meaningful operation
    if (Object.keys(creditsOperation).length > 0 && idea.autorId) {
      const usersCollection = db.collection("users");
      const authorId =
        typeof idea.autorId === "string" ? new ObjectId(idea.autorId) : idea.autorId;
      await usersCollection.updateOne({ _id: authorId }, creditsOperation);
    }

    const updatedIdea = await ideasCollection.findOne({
      _id: new ObjectId(ideaId),
    });

    return NextResponse.json(
      {
        id: updatedIdea?._id.toString(),
        upvotes: updatedIdea?.upvotes || [],
        downvotes: updatedIdea?.downvotes || [],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating vote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

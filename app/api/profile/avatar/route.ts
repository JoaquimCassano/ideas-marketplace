import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getUsersCollection } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { avatarBase64 } = await request.json();

    if (!avatarBase64 || typeof avatarBase64 !== "string") {
      return NextResponse.json(
        { error: "Avatar base64 is required" },
        { status: 400 }
      );
    }

    if (!avatarBase64.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    const sizeInBytes = Math.ceil((avatarBase64.length * 3) / 4);
    const maxSize = 500 * 1024;

    if (sizeInBytes > maxSize) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 500KB" },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();

    const result = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { avatarBase64, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Avatar updated successfully",
      avatarBase64,
    });
  } catch (error) {
    console.error("Avatar update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await getUsersCollection();

    const result = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      { $unset: { avatarBase64: "" }, $set: { updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Avatar removed successfully",
    });
  } catch (error) {
    console.error("Avatar delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

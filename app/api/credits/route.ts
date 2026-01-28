import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getDb } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const credits = user.credits || 0;

    return NextResponse.json({ credits });
  } catch (error) {
    console.error("Error fetching credits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

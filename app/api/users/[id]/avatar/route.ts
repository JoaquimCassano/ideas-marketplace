import { NextResponse } from "next/server";
import { getUsersCollection } from "@/app/lib/mongodb";
import { ObjectId } from "mongodb";
import { getGravatarUrl } from "@/app/lib/avatar";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const users = await getUsersCollection();
    const user = await users.findOne(
      { _id: new ObjectId(id) },
      { projection: { avatarBase64: 1, email: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const avatarUrl =
      user.avatarBase64 || getGravatarUrl(user.email || "", 200);

    return NextResponse.json(
      {
        avatarUrl,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=0, must-revalidate",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user avatar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

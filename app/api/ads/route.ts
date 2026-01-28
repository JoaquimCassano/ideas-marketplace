import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { ObjectId } from "mongodb";
import { getDb } from "@/app/lib/mongodb";

type Ad = {
  _id: ObjectId;
  imageUrl?: string;
  linkUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  remaningViews: number;
  type: "banner" | "square";
};

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const adsCollection = db.collection("ads");
    // aggregate ads by type (we need to get 2 squared ads and one banner)
    const bannerAd = await adsCollection
      .aggregate<Ad>([
        { $match: { type: "banner", remaningViews: { $gt: 0 } } },
        { $sample: { size: 1 } },
      ])
      // doesnt make much sense but it works so who cares right
      .toArray();

    const squareAds = await adsCollection
      .aggregate<Ad>([
        { $match: { type: "square", remaningViews: { $gt: 0 } } },
        { $sample: { size: 2 } },
      ])
      .toArray();
    const ads = [...bannerAd, ...squareAds];

    // update remaningViews for the fetched ads
    const adIds = ads.map((ad) => ad._id);
    await adsCollection.updateMany(
      { _id: { $in: adIds.map((id) => new ObjectId(id)) } },
      { $inc: { remaningViews: -1 } },
    );

    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { imageUrl, linkUrl, type, creditsSpent } = body;
    if (!imageUrl || !linkUrl || !type || !creditsSpent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const db = await getDb();
    const adsCollection = db.collection("ads");
    const usersCollection = db.collection("users");

    const userId = session.user.id;
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if ((user.credits || 0) < creditsSpent) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 400 },
      );
    }
    let availableViews: number;
    // the banners are shown earlier, so they get more attention
    switch (type) {
      case "banner":
        availableViews = creditsSpent * 5;
        break;
      case "square":
        availableViews = creditsSpent * 10;
        break;
      default:
        return NextResponse.json({ error: "Invalid ad type" }, { status: 400 });
    }

    // create the ad
    const newAd: Partial<Ad> = {
      imageUrl,
      linkUrl,
      type,
      remaningViews: availableViews,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await adsCollection.insertOne(newAd);

    // deduct user credits
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { credits: -creditsSpent } },
    );

    return NextResponse.json({ message: "Ad created successfully" });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

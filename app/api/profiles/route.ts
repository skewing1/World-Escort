import { NextResponse } from "next/server";
import { createProfile, listProfiles } from "@/lib/db/profiles";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const featured = searchParams.get("featured") === "true";
    const verification = searchParams.get("verification");
    const maxRate = searchParams.get("maxRate");
    const availableOnly = searchParams.get("availableOnly") === "true";
    const search = searchParams.get("search");

    const profiles = await listProfiles({
      country,
      featured: featured || undefined,
      verification,
      maxRate: maxRate ? Number(maxRate) : undefined,
      availableOnly: availableOnly || undefined,
      search,
    });

    return NextResponse.json({ profiles, total: profiles.length });
  } catch (error) {
    console.error("GET /api/profiles failed:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, country, city, rate, bio, photoId } = body;

    if (!name || !age || !country || !city || !rate || !bio || !photoId) {
      return NextResponse.json({ error: "Missing required profile fields" }, { status: 400 });
    }

    const profile = await createProfile(body);
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error("POST /api/profiles failed:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

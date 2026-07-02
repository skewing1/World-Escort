import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api/auth";
import { getProfileById, updateProfile } from "@/lib/db/profiles";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const profileId = Number(id);

    if (Number.isNaN(profileId)) {
      return NextResponse.json({ error: "Invalid profile id" }, { status: 400 });
    }

    const profile = await getProfileById(profileId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("GET /api/profiles/[id] failed:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiRole(["admin"]);
    if (auth.error) return auth.error;

    const { id } = await params;
    const profileId = Number(id);

    if (Number.isNaN(profileId)) {
      return NextResponse.json({ error: "Invalid profile id" }, { status: 400 });
    }

    const body = await request.json();
    const profile = await updateProfile(profileId, body);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("PATCH /api/profiles/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

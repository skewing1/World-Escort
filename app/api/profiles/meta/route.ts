import { NextResponse } from "next/server";
import { getProfileById, listProfileMeta } from "@/lib/db/profiles";

export async function GET() {
  try {
    const meta = await listProfileMeta();
    return NextResponse.json(meta);
  } catch (error) {
    console.error("GET /api/profiles/meta failed:", error);
    return NextResponse.json({ error: "Failed to fetch profile metadata" }, { status: 500 });
  }
}

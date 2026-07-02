import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api/auth";
import { listMembers } from "@/lib/db/members";

export async function GET() {
  try {
    const auth = await requireApiRole(["admin"]);
    if (auth.error) return auth.error;

    const members = await listMembers();
    return NextResponse.json({ members, total: members.length });
  } catch (error) {
    console.error("GET /api/members failed:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

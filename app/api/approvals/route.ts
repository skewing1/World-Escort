import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api/auth";
import { listPendingApprovals } from "@/lib/db/approvals";

export async function GET() {
  try {
    const auth = await requireApiRole(["admin"]);
    if (auth.error) return auth.error;

    const approvals = await listPendingApprovals();
    return NextResponse.json({ approvals, total: approvals.length });
  } catch (error) {
    console.error("GET /api/approvals failed:", error);
    return NextResponse.json({ error: "Failed to fetch approvals" }, { status: 500 });
  }
}

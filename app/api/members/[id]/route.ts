import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api/auth";
import { getMemberById, getMemberRequests, toggleMemberStatus } from "@/lib/db/members";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiRole(["admin"]);
    if (auth.error) return auth.error;

    const { id } = await params;
    const memberId = Number(id);

    if (Number.isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
    }

    const member = await getMemberById(memberId);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const requests = await getMemberRequests(memberId);
    return NextResponse.json({ member, requests });
  } catch (error) {
    console.error("GET /api/members/[id] failed:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

export async function PATCH(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiRole(["admin"]);
    if (auth.error) return auth.error;

    const { id } = await params;
    const memberId = Number(id);

    if (Number.isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
    }

    const member = await toggleMemberStatus(memberId);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error("PATCH /api/members/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

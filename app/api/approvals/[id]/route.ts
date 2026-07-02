import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api/auth";
import { removeApproval } from "@/lib/db/approvals";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiRole(["admin"]);
    if (auth.error) return auth.error;

    const { id } = await params;
    const approvalId = Number(id);

    if (Number.isNaN(approvalId)) {
      return NextResponse.json({ error: "Invalid approval id" }, { status: 400 });
    }

    const removed = await removeApproval(approvalId);
    if (!removed) {
      return NextResponse.json({ error: "Approval not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Approval removed" });
  } catch (error) {
    console.error("DELETE /api/approvals/[id] failed:", error);
    return NextResponse.json({ error: "Failed to remove approval" }, { status: 500 });
  }
}

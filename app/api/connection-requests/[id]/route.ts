import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api/auth";
import { updateConnectionRequestStatus } from "@/lib/db/connection-requests";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireApiRole(["admin"]);
    if (auth.error) return auth.error;

    const { id } = await params;
    const requestId = Number(id);

    if (Number.isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid request id" }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const connectionRequest = await updateConnectionRequestStatus(requestId, status);
    if (!connectionRequest) {
      return NextResponse.json({ error: "Connection request not found or invalid status" }, { status: 404 });
    }

    return NextResponse.json({ request: connectionRequest });
  } catch (error) {
    console.error("PATCH /api/connection-requests/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update connection request" }, { status: 500 });
  }
}

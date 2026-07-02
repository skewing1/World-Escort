import { NextResponse } from "next/server";
import { getSessionUserId, requireApiRole } from "@/lib/api/auth";
import {
  createConnectionRequest,
  listConnectionRequests,
} from "@/lib/db/connection-requests";

export async function GET(request: Request) {
  try {
    const auth = await requireApiRole(["admin", "male"]);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const memberIdParam = searchParams.get("memberId");

    let memberId: number | undefined;
    if (auth.session!.user.role === "male") {
      memberId = getSessionUserId(auth.session!) ?? undefined;
    } else if (memberIdParam) {
      memberId = Number(memberIdParam);
    }

    const requests = await listConnectionRequests({ status, memberId });
    return NextResponse.json({ requests, total: requests.length });
  } catch (error) {
    console.error("GET /api/connection-requests failed:", error);
    return NextResponse.json({ error: "Failed to fetch connection requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireApiRole(["male"]);
    if (auth.error) return auth.error;

    const memberId = getSessionUserId(auth.session!);
    if (!memberId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const body = await request.json();
    const { profileId, message } = body;

    if (!profileId || !message) {
      return NextResponse.json({ error: "profileId and message are required" }, { status: 400 });
    }

    const connectionRequest = await createConnectionRequest({
      memberId,
      profileId: Number(profileId),
      message,
    });

    if (!connectionRequest) {
      return NextResponse.json({ error: "Failed to create connection request" }, { status: 400 });
    }

    return NextResponse.json({ request: connectionRequest }, { status: 201 });
  } catch (error) {
    console.error("POST /api/connection-requests failed:", error);
    return NextResponse.json({ error: "Failed to create connection request" }, { status: 500 });
  }
}

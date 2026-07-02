import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      service: "global-dating",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/health failed:", error);
    return NextResponse.json(
      {
        status: "degraded",
        service: "global-dating",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

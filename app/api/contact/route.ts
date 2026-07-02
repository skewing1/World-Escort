import { NextResponse } from "next/server";
import type { ContactRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function mapContactRole(role: string): ContactRole {
  const map: Record<string, ContactRole> = {
    gentleman: "GENTLEMAN",
    female: "FEMALE",
    prospect: "PROSPECT",
  };
  return map[role.toLowerCase()] ?? "PROSPECT";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, role, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const ticket = await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase(),
        subject,
        role: mapContactRole(role ?? "prospect"),
        message,
      },
    });

    return NextResponse.json({
      message: "Contact message received",
      ticket: {
        id: ticket.id,
        name: ticket.name,
        email: ticket.email,
        subject: ticket.subject,
        role: ticket.role,
        receivedAt: ticket.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("POST /api/contact failed:", error);
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}

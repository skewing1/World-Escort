import {
  MembershipPlan,
  PrismaClient,
  RequestStatus,
  VerificationLevel,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CONN_REQS_INIT,
  MEMBERS_INIT,
  PENDING_APPROVALS_INIT,
  PLANS_DATA,
  PROFILES_INIT,
} from "../lib/mock-data";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "password123";

function verificationFromLabel(label: string): VerificationLevel {
  const map: Record<string, VerificationLevel> = {
    Verified: "VERIFIED",
    "Premium Verified": "PREMIUM_VERIFIED",
    "VIP Verified": "VIP_VERIFIED",
  };
  return map[label] ?? "VERIFIED";
}

function planFromLabel(label: string): MembershipPlan {
  const map: Record<string, MembershipPlan> = {
    Bronze: "BRONZE",
    Premium: "PREMIUM",
    Elite: "ELITE",
  };
  return map[label] ?? "PREMIUM";
}

function parseSpend(spend: string): number {
  const digits = spend.replace(/[^0-9]/g, "");
  return Number(digits) * 100;
}

function requestsLimitForPlan(plan: MembershipPlan): number {
  switch (plan) {
    case "BRONZE":
      return 5;
    case "PREMIUM":
      return 20;
    case "ELITE":
      return -1;
  }
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.connectionRequest.deleteMany();
  await prisma.billingRecord.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.profileApproval.deleteMany();
  await prisma.femaleProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.planConfig.deleteMany();

  for (const plan of PLANS_DATA) {
    await prisma.planConfig.create({
      data: {
        name: planFromLabel(plan.name),
        monthlyPriceCents: plan.monthly * 100,
        annualPriceCents: plan.annual * 100,
        requestsLimit: plan.requests === "Unlimited" ? -1 : plan.requests,
      },
    });
  }

  for (const profile of PROFILES_INIT) {
    await prisma.femaleProfile.create({
      data: {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        country: profile.country,
        city: profile.city,
        languages: profile.languages,
        verification: verificationFromLabel(profile.verification),
        rate: profile.rate,
        bio: profile.bio,
        available: profile.available,
        featured: profile.featured,
        suspended: profile.suspended ?? false,
        photoId: profile.photoId,
        photos: profile.photos ?? [profile.photoId],
        tags: profile.tags,
        height: profile.height,
        nationality: profile.nationality,
        education: profile.education,
        travel: profile.travel ?? [],
      },
    });
  }

  for (const member of MEMBERS_INIT) {
    const [firstName, ...rest] = member.name.split(" ");
    const lastName = rest.join(" ");
    const plan = planFromLabel(member.plan);

    const user = await prisma.user.create({
      data: {
        id: member.id,
        email: member.email,
        passwordHash,
        role: "MALE",
        status: member.status === "Active" ? "ACTIVE" : "SUSPENDED",
        firstName,
        lastName,
        country: member.country,
      },
    });

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        plan,
        billingCycle: "MONTHLY",
        status: "ACTIVE",
        requestsUsed: Math.min(member.requests, requestsLimitForPlan(plan) === -1 ? member.requests : requestsLimitForPlan(plan)),
        requestsLimit: requestsLimitForPlan(plan),
        totalSpendCents: parseSpend(member.spend),
        currentPeriodEnd: periodEnd,
      },
    });

    await prisma.billingRecord.create({
      data: {
        membershipId: membership.id,
        description: `${member.plan} Membership`,
        amountCents: PLANS_DATA.find((p) => p.name === member.plan)!.monthly * 100,
        status: "PAID",
      },
    });
  }

  for (const req of CONN_REQS_INIT) {
    const statusMap: Record<string, RequestStatus> = {
      pending: "PENDING",
      approved: "APPROVED",
      rejected: "REJECTED",
    };

    await prisma.connectionRequest.create({
      data: {
        memberId: req.memberId,
        profileId: req.profileId,
        message: req.message,
        status: statusMap[req.status] ?? "PENDING",
      },
    });
  }

  for (const approval of PENDING_APPROVALS_INIT) {
    await prisma.profileApproval.create({
      data: {
        id: approval.id,
        name: approval.name,
        age: approval.age,
        country: approval.country,
        city: approval.city,
        docsVerified: approval.docs,
        selfieVerified: approval.selfie,
      },
    });
  }

  await prisma.user.create({
    data: {
      email: "admin@aurum-private.com",
      passwordHash,
      role: "ADMIN",
      status: "ACTIVE",
      firstName: "Admin",
      lastName: "User",
    },
  });

  await prisma.user.create({
    data: {
      email: "female@aurum-private.com",
      passwordHash,
      role: "FEMALE",
      status: "ACTIVE",
      firstName: "Sofia",
      lastName: "Marchetti",
      femaleProfile: {
        connect: { id: 1 },
      },
    },
  });

  await prisma.$executeRawUnsafe(`
    SELECT setval(pg_get_serial_sequence('"FemaleProfile"', 'id'), COALESCE((SELECT MAX(id) FROM "FemaleProfile"), 1));
    SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE((SELECT MAX(id) FROM "User"), 1));
    SELECT setval(pg_get_serial_sequence('"ProfileApproval"', 'id'), COALESCE((SELECT MAX(id) FROM "ProfileApproval"), 1));
  `);

  console.log("Seed completed.");
  console.log(`Demo password for all users: ${DEMO_PASSWORD}`);
  console.log("Admin: admin@aurum-private.com");
  console.log("Female: female@aurum-private.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

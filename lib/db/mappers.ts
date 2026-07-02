import type {
  ConnectionRequest as ConnectionRequestRow,
  FemaleProfile,
  MembershipPlan,
  PlanConfig,
  ProfileApproval,
  RequestStatus,
  User,
  VerificationLevel,
} from "@prisma/client";
import type {
  ConnectionRequest,
  Member,
  PendingApproval,
  Profile,
} from "@/lib/types";
import {
  abbreviateName,
  formatJoinedDate,
  formatRelativeSubmitted,
  formatSpend,
  formatSubmitted,
} from "@/lib/db/format";

const VERIFICATION_LABEL: Record<VerificationLevel, Profile["verification"]> = {
  VERIFIED: "Verified",
  PREMIUM_VERIFIED: "Premium Verified",
  VIP_VERIFIED: "VIP Verified",
};

const PLAN_LABEL: Record<MembershipPlan, string> = {
  BRONZE: "Bronze",
  PREMIUM: "Premium",
  ELITE: "Elite",
};

const REQUEST_STATUS_LABEL: Record<RequestStatus, ConnectionRequest["status"]> = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const PROFILE_VERIFICATIONS = ["All", "Verified", "Premium Verified", "VIP Verified"] as const;

export function planLabelFromEnum(plan: MembershipPlan): string {
  return PLAN_LABEL[plan];
}

export function planEnumFromLabel(label: string): MembershipPlan | null {
  const map: Record<string, MembershipPlan> = {
    Bronze: "BRONZE",
    Premium: "PREMIUM",
    Elite: "ELITE",
  };
  return map[label] ?? null;
}

export function toProfileDto(row: FemaleProfile): Profile {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    country: row.country,
    city: row.city,
    languages: row.languages,
    verification: VERIFICATION_LABEL[row.verification],
    rate: row.rate,
    bio: row.bio,
    available: row.available,
    featured: row.featured,
    photoId: row.photoId,
    tags: row.tags,
    height: row.height ?? undefined,
    nationality: row.nationality ?? undefined,
    education: row.education ?? undefined,
    travel: row.travel,
    photos: row.photos,
    suspended: row.suspended,
  };
}

export function toMemberDto(user: User & { membership: { plan: MembershipPlan; requestsUsed: number; totalSpendCents: number } | null }): Member {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return {
    id: user.id,
    name: name || user.email,
    email: user.email,
    plan: user.membership ? PLAN_LABEL[user.membership.plan] : "Premium",
    joined: formatJoinedDate(user.createdAt),
    status: user.status === "ACTIVE" ? "Active" : "Suspended",
    spend: formatSpend(user.membership?.totalSpendCents ?? 0),
    country: user.country ?? "",
    requests: user.membership?.requestsUsed ?? 0,
  };
}

export function toMemberRequestDto(row: ConnectionRequestRow & { profile: FemaleProfile }) {
  return {
    profile: row.profile.name,
    date: formatJoinedDate(row.createdAt),
    status: REQUEST_STATUS_LABEL[row.status],
  };
}

export function toConnectionRequestDto(
  row: ConnectionRequestRow & { member: User; profile: FemaleProfile },
): ConnectionRequest {
  return {
    id: row.id,
    from: abbreviateName(row.member.firstName, row.member.lastName),
    memberId: row.memberId,
    profileId: row.profileId,
    profile: row.profile.name,
    submitted: formatSubmitted(row.createdAt),
    status: REQUEST_STATUS_LABEL[row.status],
    message: row.message,
  };
}

export function toPendingApprovalDto(row: ProfileApproval): PendingApproval {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    country: row.country,
    city: row.city,
    submitted: formatRelativeSubmitted(row.createdAt),
    docs: row.docsVerified,
    selfie: row.selfieVerified,
  };
}

export interface PlanDto {
  name: string;
  monthly: number;
  annual: number;
  requests: number | "Unlimited";
}

export function toPlanDto(row: PlanConfig): PlanDto {
  return {
    name: PLAN_LABEL[row.name],
    monthly: row.monthlyPriceCents / 100,
    annual: row.annualPriceCents / 100,
    requests: row.requestsLimit === -1 ? "Unlimited" : row.requestsLimit,
  };
}

export function parseVerificationLevel(value: string): VerificationLevel | null {
  const map: Record<string, VerificationLevel> = {
    Verified: "VERIFIED",
    "Premium Verified": "PREMIUM_VERIFIED",
    "VIP Verified": "VIP_VERIFIED",
  };
  return map[value] ?? null;
}

export function parseRequestStatus(value: string): RequestStatus | null {
  const map: Record<string, RequestStatus> = {
    pending: "PENDING",
    approved: "APPROVED",
    rejected: "REJECTED",
  };
  return map[value.toLowerCase()] ?? null;
}

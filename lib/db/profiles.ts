import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseVerificationLevel, PROFILE_VERIFICATIONS, toProfileDto } from "@/lib/db/mappers";
import type { Profile } from "@/lib/types";

export interface ProfileFilters {
  country?: string | null;
  featured?: boolean;
  verification?: string | null;
  maxRate?: number;
  availableOnly?: boolean;
  search?: string | null;
}

export async function listProfiles(filters: ProfileFilters = {}): Promise<Profile[]> {
  const where: Prisma.FemaleProfileWhereInput = {
    suspended: false,
  };

  if (filters.country && filters.country !== "All") {
    where.country = filters.country;
  }

  if (filters.featured) {
    where.featured = true;
  }

  if (filters.verification && filters.verification !== "All") {
    const level = parseVerificationLevel(filters.verification);
    if (level) where.verification = level;
  }

  if (filters.maxRate !== undefined) {
    where.rate = { lte: filters.maxRate };
  }

  if (filters.availableOnly) {
    where.available = true;
  }

  if (filters.search) {
    const q = filters.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
    ];
  }

  const rows = await prisma.femaleProfile.findMany({
    where,
    orderBy: { name: "asc" },
  });

  return rows.map(toProfileDto);
}

export async function getProfileById(id: number): Promise<Profile | null> {
  const row = await prisma.femaleProfile.findUnique({ where: { id } });
  if (!row || row.suspended) return null;
  return toProfileDto(row);
}

export async function createProfile(data: {
  name: string;
  age: number;
  country: string;
  city: string;
  languages?: string[];
  verification?: string;
  rate: number;
  bio: string;
  photoId: string;
  tags?: string[];
  height?: string;
  nationality?: string;
  education?: string;
  travel?: string[];
  photos?: string[];
  available?: boolean;
  featured?: boolean;
}): Promise<Profile> {
  const row = await prisma.femaleProfile.create({
    data: {
      name: data.name,
      age: data.age,
      country: data.country,
      city: data.city,
      languages: data.languages ?? [],
      verification: data.verification ? parseVerificationLevel(data.verification) ?? "VERIFIED" : "VERIFIED",
      rate: data.rate,
      bio: data.bio,
      photoId: data.photoId,
      tags: data.tags ?? [],
      height: data.height,
      nationality: data.nationality,
      education: data.education,
      travel: data.travel ?? [],
      photos: data.photos ?? [data.photoId],
      available: data.available ?? true,
      featured: data.featured ?? false,
    },
  });

  return toProfileDto(row);
}

export async function updateProfile(
  id: number,
  data: Partial<Omit<Profile, "id">>,
): Promise<Profile | null> {
  try {
    const row = await prisma.femaleProfile.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.age !== undefined ? { age: data.age } : {}),
        ...(data.country !== undefined ? { country: data.country } : {}),
        ...(data.city !== undefined ? { city: data.city } : {}),
        ...(data.languages !== undefined ? { languages: data.languages } : {}),
        ...(data.verification !== undefined
          ? { verification: parseVerificationLevel(data.verification) ?? undefined }
          : {}),
        ...(data.rate !== undefined ? { rate: data.rate } : {}),
        ...(data.bio !== undefined ? { bio: data.bio } : {}),
        ...(data.available !== undefined ? { available: data.available } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.suspended !== undefined ? { suspended: data.suspended } : {}),
        ...(data.photoId !== undefined ? { photoId: data.photoId } : {}),
        ...(data.tags !== undefined ? { tags: data.tags } : {}),
        ...(data.height !== undefined ? { height: data.height } : {}),
        ...(data.nationality !== undefined ? { nationality: data.nationality } : {}),
        ...(data.education !== undefined ? { education: data.education } : {}),
        ...(data.travel !== undefined ? { travel: data.travel } : {}),
        ...(data.photos !== undefined ? { photos: data.photos } : {}),
      },
    });
    return toProfileDto(row);
  } catch {
    return null;
  }
}

export async function listProfileCountries(): Promise<string[]> {
  const rows = await prisma.femaleProfile.findMany({
    where: { suspended: false },
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });
  return ["All", ...rows.map((row) => row.country)];
}

export async function listProfileMeta() {
  return {
    countries: await listProfileCountries(),
    verifications: [...PROFILE_VERIFICATIONS],
  };
}

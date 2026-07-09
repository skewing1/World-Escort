import { listProfiles } from "@/lib/db/profiles";
import type { Profile } from "@/lib/types";
import type { CountryGroup } from "@/components/ThreeDGlobe";
import { getCountryData } from "@/utils/countries";
import { PROFILES_INIT } from "@/lib/mock-data";

export interface HomePageStats {
  totalProfiles: number;
  totalCountries: number;
}

export interface HomePageData {
  featured: Profile[];
  stats: HomePageStats;
  countryGroups: CountryGroup[];
}

function buildCountryGroups(profiles: Profile[]): CountryGroup[] {
  const groupsMap = new Map<string, CountryGroup>();

  for (const profile of profiles) {
    const countryInfo = getCountryData(profile.country);
    if (!countryInfo) continue;

    const profileData = {
      id: String(profile.id),
      name: profile.name,
    };

    const existing = groupsMap.get(profile.country);
    if (existing) {
      existing.profiles.push(profileData);
    } else {
      groupsMap.set(profile.country, {
        countryCode: profile.country,
        countryName: countryInfo.name,
        flag: countryInfo.flag,
        lat: countryInfo.lat ?? 0,
        lng: countryInfo.lng ?? 0,
        profiles: [profileData],
      });
    }
  }

  return Array.from(groupsMap.values());
}

function buildFromProfiles(profiles: Profile[]): HomePageData {
  const featured = profiles.filter((p) => p.featured && !p.suspended);
  const countries = new Set(profiles.map((p) => p.country));

  return {
    featured,
    stats: {
      totalProfiles: profiles.length,
      totalCountries: countries.size,
    },
    countryGroups: buildCountryGroups(profiles),
  };
}

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const profiles = await listProfiles();
    return buildFromProfiles(profiles);
  } catch (error) {
    console.error("getHomePageData: database unavailable, using fallback data:", error);
    return buildFromProfiles(PROFILES_INIT.filter((p) => !p.suspended));
  }
}

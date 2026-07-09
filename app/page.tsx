import { HomePage } from "@/components/site/pages";
import { getHomePageData } from "@/lib/db/home-page";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = await getHomePageData();

  return (
    <HomePage
      featured={data.featured}
      stats={data.stats}
      countryGroups={data.countryGroups}
    />
  );
}

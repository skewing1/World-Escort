export const routes = {
  home: "/",
  browse: "/browse",
  about: "/about",
  membership: "/membership",
  contact: "/contact",
  purchase: "/purchase",
  profile: (id: number) => `/profiles/${id}`,
  maleDashboard: "/dashboard/male",
  femaleDashboard: "/dashboard/female",
  admin: "/admin",
} as const;

export function purchaseUrl(plan?: string) {
  return plan ? `${routes.purchase}?plan=${encodeURIComponent(plan)}` : routes.purchase;
}

import type { ConnectionRequest, Member, PendingApproval, Profile } from "./types";

export const PROFILES_INIT: Profile[] = [
  { id: 1, name: "Sofia Marchetti", age: 27, country: "Italy", city: "Milan", languages: ["Italian", "English", "French"], verification: "VIP Verified", rate: 500, available: true, featured: true, suspended: false, height: "5'9\"", nationality: "Italian", education: "Bocconi University — MBA", travel: ["Europe", "USA", "Middle East"], bio: "Model and entrepreneur based in Milan. Passionate about contemporary art, fashion weeks, and Mediterranean cuisine. Available for introductions across Europe and internationally upon request.", photoId: "1529626455594-4ff0802cfb7e", tags: ["Modeling", "Travel", "Art"], photos: ["1529626455594-4ff0802cfb7e", "1524504388940-b1c1722653e0", "1488426862026-3ee34a7d66df"] },
  { id: 2, name: "Amélie Fontaine", age: 29, country: "France", city: "Paris", languages: ["French", "English", "Spanish"], verification: "Premium Verified", rate: 400, available: true, featured: true, suspended: false, height: "5'7\"", nationality: "French", education: "Sciences Po, Paris", travel: ["Europe", "North Africa"], bio: "Interior designer with a deep love for Parisian culture, wine tasting, and weekend escapes to the countryside. Sophisticated and worldly.", photoId: "1524504388940-b1c1722653e0", tags: ["Design", "Wine", "Culture"], photos: ["1524504388940-b1c1722653e0", "1529626455594-4ff0802cfb7e"] },
  { id: 3, name: "Natasha Volkov", age: 25, country: "Russia", city: "Moscow", languages: ["Russian", "English"], verification: "VIP Verified", rate: 450, available: true, featured: true, suspended: false, height: "5'10\"", nationality: "Russian", education: "Moscow Conservatory", travel: ["Europe", "Asia"], bio: "Classical pianist and graduate of the Moscow Conservatory. Elegant, refined, and equally at home in concert halls as intimate settings.", photoId: "1488426862026-3ee34a7d66df", tags: ["Music", "Arts", "Culture"], photos: ["1488426862026-3ee34a7d66df"] },
  { id: 4, name: "Valentina Cruz", age: 31, country: "Brazil", city: "São Paulo", languages: ["Portuguese", "English", "Spanish"], verification: "Premium Verified", rate: 350, available: false, featured: false, suspended: false, height: "5'6\"", nationality: "Brazilian", education: "FGV São Paulo", travel: ["South America", "Europe"], bio: "Fashion consultant and lifestyle blogger. Loves dancing, coastal retreats, and vibrant city life.", photoId: "1524638431109-93d95c968f03", tags: ["Fashion", "Lifestyle", "Dance"], photos: ["1524638431109-93d95c968f03"] },
  { id: 5, name: "Yuki Tanaka", age: 26, country: "Japan", city: "Tokyo", languages: ["Japanese", "English", "Korean"], verification: "Verified", rate: 380, available: true, featured: false, suspended: false, height: "5'4\"", nationality: "Japanese", education: "University of Tokyo — Fine Arts", travel: ["Asia", "Europe"], bio: "UX designer and tea ceremony practitioner. Combines modern sensibility with deep respect for tradition.", photoId: "1517841905240-472988babdf9", tags: ["Design", "Culture", "Travel"], photos: ["1517841905240-472988babdf9"] },
  { id: 6, name: "Layla Al-Rashid", age: 28, country: "UAE", city: "Dubai", languages: ["Arabic", "English", "French"], verification: "VIP Verified", rate: 600, available: true, featured: true, suspended: false, height: "5'8\"", nationality: "Emirati", education: "London School of Economics", travel: ["Global"], bio: "Entrepreneur and philanthropist with interests in luxury real estate and sustainable fashion. Educated in London, based in Dubai.", photoId: "1531746020798-e6953c6e8e04", tags: ["Business", "Philanthropy", "Fashion"], photos: ["1531746020798-e6953c6e8e04"] },
  { id: 7, name: "Isabella Santos", age: 30, country: "Spain", city: "Madrid", languages: ["Spanish", "English", "Italian"], verification: "Premium Verified", rate: 420, available: true, featured: false, suspended: false, height: "5'7\"", nationality: "Spanish", education: "Politécnica de Madrid — Architecture", travel: ["Europe", "Latin America"], bio: "Architect and flamenco enthusiast. Passionate about heritage buildings and spontaneous weekend trips.", photoId: "1534528741775-53994a69daeb", tags: ["Architecture", "Dance", "Travel"], photos: ["1534528741775-53994a69daeb"] },
  { id: 8, name: "Chloe Bennett", age: 24, country: "Australia", city: "Sydney", languages: ["English", "Mandarin"], verification: "Verified", rate: 300, available: true, featured: false, suspended: false, height: "5'6\"", nationality: "Australian", education: "University of Sydney — Marine Biology", travel: ["Asia-Pacific", "Europe"], bio: "Marine biologist and ocean advocate. Sun-soaked lifestyle with intellectual depth.", photoId: "1494790108377-be9c29b29330", tags: ["Science", "Ocean", "Fitness"], photos: ["1494790108377-be9c29b29330"] },
  { id: 9, name: "Elena Petrova", age: 27, country: "Ukraine", city: "Kyiv", languages: ["Ukrainian", "Russian", "English"], verification: "Premium Verified", rate: 360, available: true, featured: false, suspended: false, height: "5'8\"", nationality: "Ukrainian", education: "Kyiv Polytechnic — Journalism", travel: ["Europe", "Middle East"], bio: "Journalist and documentary photographer. Deep thinker with a gift for storytelling. Traveled to 40 countries.", photoId: "1506956191951-7a88da4435e5", tags: ["Photography", "Travel", "Writing"], photos: ["1506956191951-7a88da4435e5"] },
  { id: 10, name: "Camille Dubois", age: 33, country: "Switzerland", city: "Geneva", languages: ["French", "German", "English", "Italian"], verification: "VIP Verified", rate: 700, available: true, featured: true, suspended: false, height: "5'9\"", nationality: "Swiss", education: "Graduate Institute Geneva", travel: ["Global"], bio: "Senior diplomat and four-language polyglot. Opera devotee and collector of 20th century sculpture.", photoId: "1539571696357-5a69c17a67c6", tags: ["Diplomacy", "Opera", "Art"], photos: ["1539571696357-5a69c17a67c6"] },
  { id: 11, name: "Priya Sharma", age: 28, country: "India", city: "Mumbai", languages: ["Hindi", "English", "Bengali"], verification: "Verified", rate: 280, available: true, featured: false, suspended: false, height: "5'5\"", nationality: "Indian", education: "Mumbai University — Performing Arts", travel: ["Asia", "Europe"], bio: "Bollywood choreographer and dance academy founder. Vivacious, creative, and deeply connected to India's rich artistic traditions.", photoId: "1485893086445-ed75865251e0", tags: ["Dance", "Arts", "Entrepreneurship"], photos: ["1485893086445-ed75865251e0"] },
  { id: 12, name: "Astrid Eriksson", age: 30, country: "Sweden", city: "Stockholm", languages: ["Swedish", "English", "Norwegian", "Danish"], verification: "Premium Verified", rate: 390, available: false, featured: false, suspended: false, height: "5'10\"", nationality: "Swedish", education: "KTH Royal Institute — Architecture", travel: ["Europe", "North America"], bio: "Award-winning architect specializing in sustainable design. Lover of Nordic wilderness and jazz.", photoId: "1508214751196-bcfd4ca60f91", tags: ["Architecture", "Design", "Nature"], photos: ["1508214751196-bcfd4ca60f91"] },
];

export const MEMBERS_INIT: Member[] = [
  { id: 1, name: "Michael Harrison", email: "m.harrison@email.com", plan: "Elite", joined: "Jan 12, 2025", status: "Active", spend: "$2,840", country: "USA", requests: 8 },
  { id: 2, name: "James Keller", email: "j.keller@email.com", plan: "Premium", joined: "Feb 3, 2025", status: "Active", spend: "$1,200", country: "UK", requests: 14 },
  { id: 3, name: "Robert Mayfair", email: "r.mayfair@email.com", plan: "Elite", joined: "Mar 18, 2025", status: "Active", spend: "$4,150", country: "Germany", requests: 21 },
  { id: 4, name: "David Laurent", email: "d.laurent@email.com", plan: "Bronze", joined: "Apr 5, 2025", status: "Active", spend: "$340", country: "France", requests: 3 },
  { id: 5, name: "Alexander Petrov", email: "a.petrov@email.com", plan: "Premium", joined: "Apr 22, 2025", status: "Suspended", spend: "$890", country: "Russia", requests: 5 },
  { id: 6, name: "Thomas Bradford", email: "t.bradford@email.com", plan: "Elite", joined: "May 1, 2025", status: "Active", spend: "$3,200", country: "Australia", requests: 17 },
  { id: 7, name: "William Tanaka", email: "w.tanaka@email.com", plan: "Premium", joined: "May 14, 2025", status: "Active", spend: "$680", country: "Japan", requests: 6 },
];

export const MEMBER_REQUESTS: Record<number, { profile: string; date: string; status: string }[]> = {
  1: [{ profile: "Sofia Marchetti", date: "Jun 10, 2025", status: "approved" }, { profile: "Layla Al-Rashid", date: "May 28, 2025", status: "approved" }, { profile: "Natasha Volkov", date: "May 14, 2025", status: "rejected" }],
  2: [{ profile: "Amélie Fontaine", date: "Jun 15, 2025", status: "approved" }, { profile: "Elena Petrova", date: "Jun 2, 2025", status: "pending" }],
  3: [{ profile: "Camille Dubois", date: "Jun 18, 2025", status: "approved" }, { profile: "Isabella Santos", date: "Jun 5, 2025", status: "approved" }, { profile: "Sofia Marchetti", date: "May 20, 2025", status: "approved" }],
  4: [{ profile: "Chloe Bennett", date: "Jun 12, 2025", status: "pending" }],
  5: [{ profile: "Valentina Cruz", date: "Apr 30, 2025", status: "rejected" }],
  6: [{ profile: "Layla Al-Rashid", date: "Jun 20, 2025", status: "approved" }, { profile: "Natasha Volkov", date: "Jun 8, 2025", status: "approved" }],
  7: [{ profile: "Yuki Tanaka", date: "Jun 16, 2025", status: "pending" }],
};

export const PENDING_APPROVALS_INIT: PendingApproval[] = [
  { id: 101, name: "Mei Lin Chen", age: 24, country: "Singapore", city: "Singapore", submitted: "2 hours ago", docs: true, selfie: true },
  { id: 102, name: "Roxana Ionescu", age: 29, country: "Romania", city: "Bucharest", submitted: "5 hours ago", docs: true, selfie: false },
  { id: 103, name: "Carmen Reyes", age: 31, country: "Mexico", city: "Mexico City", submitted: "8 hours ago", docs: false, selfie: true },
  { id: 104, name: "Hana Nakamura", age: 25, country: "Japan", city: "Osaka", submitted: "11 hours ago", docs: true, selfie: true },
  { id: 105, name: "Fatima Al-Sayed", age: 27, country: "Kuwait", city: "Kuwait City", submitted: "1 day ago", docs: true, selfie: true },
];

export const CONN_REQS_INIT: ConnectionRequest[] = [
  { id: 1, from: "James K.", memberId: 2, profileId: 2, profile: "Amélie Fontaine", submitted: "Today, 14:32", status: "pending", message: "I'd love a formal introduction. I travel to Paris frequently for business." },
  { id: 2, from: "Robert M.", memberId: 3, profileId: 3, profile: "Natasha Volkov", submitted: "Today, 09:17", status: "pending", message: "I'm an avid classical music enthusiast. I'd be honored to be introduced." },
  { id: 3, from: "Michael H.", memberId: 1, profileId: 6, profile: "Layla Al-Rashid", submitted: "Yesterday", status: "approved", message: "We share interests in sustainable development." },
  { id: 4, from: "David L.", memberId: 4, profileId: 2, profile: "Amélie Fontaine", submitted: "Yesterday", status: "rejected", message: "Paris is my second home." },
  { id: 5, from: "William T.", memberId: 7, profileId: 10, profile: "Camille Dubois", submitted: "2 days ago", status: "pending", message: "Longtime supporter of the arts. Very interested in an introduction." },
];

export const PLAN_LIMITS: Record<string, number | string> = { Bronze: 5, Premium: 20, Elite: "Unlimited" };

export const PLANS_DATA = [
  { name: "Bronze", monthly: 49, annual: 39, requests: 5 },
  { name: "Premium", monthly: 149, annual: 119, requests: 20 },
  { name: "Elite", monthly: 299, annual: 239, requests: "Unlimited" as const },
];

export const CRYPTO_WALLETS = [
  { coin: "Bitcoin", symbol: "BTC", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin Mainnet", rate: 65000 },
  { coin: "Ethereum", symbol: "ETH", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", network: "ERC-20", rate: 3200 },
  { coin: "USDT", symbol: "USDT", address: "TGyzqeQFAMDTZhHdtYELAovk3Y5yzDvqZR", network: "TRC-20", rate: 1 },
  { coin: "USDC", symbol: "USDC", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", network: "ERC-20", rate: 1 },
];

export const COUNTRIES = ["All", "Australia", "Brazil", "France", "India", "Italy", "Japan", "Russia", "Spain", "Sweden", "Switzerland", "UAE", "Ukraine"];
export const VERIFICATIONS = ["All", "Verified", "Premium Verified", "VIP Verified"];

export function getProfileById(id: number): Profile | undefined {
  return PROFILES_INIT.find((p) => p.id === id);
}

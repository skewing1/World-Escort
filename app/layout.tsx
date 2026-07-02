import type { Metadata } from "next";
import { AppProvider } from "@/components/providers/app-provider";
import { Nav } from "@/components/site/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium Dating Marketplace",
  description:
    "Provides detailed profiles, dashboards for women and admins, and streamlined contact support with tiered response times for efficient membership management.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AppProvider>
          <Nav />
          <main>{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}

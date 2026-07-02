"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PurchasePage } from "@/components/site/pages";

function PurchasePageContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") ?? "Premium";
  return <PurchasePage selectedPlan={plan} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-16 min-h-screen bg-background" />}>
      <PurchasePageContent />
    </Suspense>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, CheckCircle2, FileText, RefreshCw, Search, UserCheck, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/site/admin/admin-page-header";
import type { PendingApproval } from "@/lib/types";
import { PENDING_APPROVALS_INIT } from "@/lib/mock-data";
import { inp } from "@/lib/ui-styles";

type DocumentFilter = "all" | "complete" | "incomplete" | "missing-id" | "missing-selfie";

const DOCUMENT_FILTERS: { value: DocumentFilter; label: string }[] = [
  { value: "all", label: "All submissions" },
  { value: "complete", label: "Complete" },
  { value: "incomplete", label: "Incomplete" },
  { value: "missing-id", label: "Missing ID" },
  { value: "missing-selfie", label: "Missing selfie" },
];

function matchesDocumentFilter(item: PendingApproval, filter: DocumentFilter) {
  switch (filter) {
    case "complete":
      return item.docs && item.selfie;
    case "incomplete":
      return !item.docs || !item.selfie;
    case "missing-id":
      return !item.docs;
    case "missing-selfie":
      return !item.selfie;
    default:
      return true;
  }
}

export function AdminVerificationsPage() {
  const [pending, setPending] = useState<PendingApproval[]>(PENDING_APPROVALS_INIT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [documentFilter, setDocumentFilter] = useState<DocumentFilter>("all");
  const [removingId, setRemovingId] = useState<number | null>(null);

  const loadApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/approvals");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to load verifications");
      }
      const data = await res.json();
      if (Array.isArray(data.approvals)) {
        setPending(data.approvals);
      }
    } catch (err) {
      setPending(PENDING_APPROVALS_INIT);
      setError(err instanceof Error ? err.message : "Failed to load verifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApprovals();
  }, [loadApprovals]);

  const countries = useMemo(
    () => [...new Set(pending.map((p) => p.country))].sort((a, b) => a.localeCompare(b)),
    [pending],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pending.filter((p) => {
      if (countryFilter !== "all" && p.country !== countryFilter) return false;
      if (!matchesDocumentFilter(p, documentFilter)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        String(p.age).includes(q)
      );
    });
  }, [pending, search, countryFilter, documentFilter]);

  const hasActiveFilters = search.trim() !== "" || countryFilter !== "all" || documentFilter !== "all";

  async function handleDecision(id: number) {
    setRemovingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/approvals/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update verification");
      }
      setPending((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update verification");
    } finally {
      setRemovingId(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setCountryFilter("all");
    setDocumentFilter("all");
  }

  return (
    <>
      <AdminPageHeader eyebrow="Administration" title="Profile Verifications" />
      <div className="p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xs font-medium tracking-widests uppercase text-muted-foreground flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" />
            Verification Queue ({pending.length})
          </h2>
          <button
            type="button"
            onClick={() => void loadApprovals()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer disabled:opacity-50 self-start lg:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              placeholder="Search by name, city, country, or age…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inp} pl-9 py-2.5 w-full`}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className={`${inp} py-2.5 min-w-[160px]`}
            >
              <option value="all">All countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <select
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value as DocumentFilter)}
              className={`${inp} py-2.5 min-w-[180px]`}
            >
              {DOCUMENT_FILTERS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="border border-rose-800/50 bg-rose-950 px-5 py-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        {!loading && pending.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Showing {filtered.length} of {pending.length} submission{pending.length === 1 ? "" : "s"}
          </div>
        )}

        {loading && pending.length === 0 ? (
          <div className="border border-border bg-card p-10 text-center text-muted-foreground text-sm">
            Loading verification queue…
          </div>
        ) : pending.length === 0 ? (
          <div className="border border-border bg-card p-10 text-center text-muted-foreground">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
            <p className="text-sm">All applications reviewed</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border bg-card p-10 text-center text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No submissions match your search or filters</p>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="mt-4 text-xs text-primary hover:brightness-110 cursor-pointer">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div key={p.id} className="border border-border bg-card p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-secondary border border-border flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                      <span className="text-sm font-medium text-foreground">{p.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.age} · {p.city}, {p.country} · {p.submitted}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase px-2 py-1 border ${p.docs ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" : "bg-rose-950 text-rose-400 border-rose-800/40"}`}>
                        <FileText className="w-2.5 h-2.5" /> ID {p.docs ? "✓" : "✗"}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase px-2 py-1 border ${p.selfie ? "bg-emerald-950 text-emerald-400 border-emerald-800/40" : "bg-rose-950 text-rose-400 border-rose-800/40"}`}>
                        <Camera className="w-2.5 h-2.5" /> Selfie {p.selfie ? "✓" : "✗"}
                      </span>
                      {(!p.docs || !p.selfie) && (
                        <span className="text-[10px] text-amber-400">⚠ Incomplete</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={removingId === p.id}
                    onClick={() => void handleDecision(p.id)}
                    className="px-4 py-2 text-[10px] uppercase bg-emerald-950 border border-emerald-700/50 text-emerald-400 cursor-pointer disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={removingId === p.id}
                    onClick={() => void handleDecision(p.id)}
                    className="px-4 py-2 text-[10px] uppercase bg-rose-950 border border-rose-800/50 text-rose-400 cursor-pointer disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

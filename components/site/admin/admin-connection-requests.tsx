"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle, RefreshCw, Search } from "lucide-react";
import { adminRoutes } from "@/lib/admin-routes";
import type { ConnectionRequest } from "@/lib/types";
import { inp, statusBadge } from "@/lib/ui-styles";

export function AdminConnectionRequests() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/connection-requests");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to load connection requests");
      }
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load connection requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  async function updateStatus(id: number, status: "approved" | "rejected") {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/connection-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update request");
      }
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: data.request.status } : r)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update request");
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.from.toLowerCase().includes(q) ||
        r.profile.toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q),
    );
  }, [requests, search]);

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search requests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inp} pl-9 py-2.5`}
          />
        </div>
        <button
          type="button"
          onClick={() => void loadRequests()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="border border-rose-800/50 bg-rose-950 px-5 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MessageCircle className="w-4 h-4 text-primary" />
        {pendingCount} pending · {requests.length} total
      </div>

      {loading && requests.length === 0 ? (
        <div className="border border-border bg-card p-10 text-center text-muted-foreground text-sm">
          Loading connection requests…
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-border bg-card p-10 text-center text-muted-foreground">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">{search ? "No requests match your search" : "No connection requests yet"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="border border-border bg-card p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <Link
                    href={adminRoutes.member(r.memberId)}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {r.from}
                  </Link>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <Link
                    href={adminRoutes.profile(r.profileId)}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {r.profile}
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground italic font-light border-l-2 border-border pl-3 mb-2">
                  &ldquo;{r.message}&rdquo;
                </p>
                <div className="text-[10px] text-muted-foreground">{r.submitted}</div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-[10px] tracking-widests uppercase px-2 py-1 border ${statusBadge[r.status] ?? statusBadge.Active}`}>
                  {r.status}
                </span>
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={updatingId === r.id}
                      onClick={() => void updateStatus(r.id, "approved")}
                      className="px-3 py-1.5 text-[10px] uppercase bg-emerald-950 border border-emerald-700/50 text-emerald-400 cursor-pointer disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === r.id}
                      onClick={() => void updateStatus(r.id, "rejected")}
                      className="px-3 py-1.5 text-[10px] uppercase bg-rose-950 border border-rose-800/50 text-rose-400 cursor-pointer disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

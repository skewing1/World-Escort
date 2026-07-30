"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Mail, RefreshCw, Search } from "lucide-react";
import type { ContactMessage } from "@/lib/types";
import { inp } from "@/lib/ui-styles";

export function AdminContacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to load contact messages");
      }
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q),
    );
  }, [messages, search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inp} pl-9 py-2.5`}
          />
        </div>
        <button
          type="button"
          onClick={() => void loadMessages()}
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

      <div className="border border-border bg-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["From", "Email", "Role", "Subject", "Received", ""].map((h) => (
                <th
                  key={h || "actions"}
                  className="text-left px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && messages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Loading contact messages…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">{search ? "No messages match your search" : "No contact messages yet"}</p>
                </td>
              </tr>
            ) : (
              filtered.map((m) => {
                const expanded = expandedId === m.id;
                return (
                  <Fragment key={m.id}>
                    <tr className="hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-foreground">{m.name}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted-foreground">{m.email}</td>
                      <td className="px-5 py-4">
                        <span className="text-[10px] tracking-widests uppercase px-2 py-1 border border-border text-muted-foreground">
                          {m.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-foreground">{m.subject}</td>
                      <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{m.submitted}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedId(expanded ? null : m.id)}
                          className="inline-flex items-center gap-1 text-[10px] uppercase text-primary hover:brightness-110 cursor-pointer"
                        >
                          {expanded ? "Hide" : "View"}
                          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr className="bg-secondary/20">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-2">Message</div>
                          <p className="text-sm text-foreground font-light whitespace-pre-wrap leading-relaxed border-l-2 border-primary/40 pl-4">
                            {m.message}
                          </p>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Showing {filtered.length} of {messages.length} message{messages.length === 1 ? "" : "s"}
        </div>
      )}
    </div>
  );
}

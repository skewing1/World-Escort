"use client";

import { useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Crown, Eye, Star, X } from "lucide-react";
import { dashboardPathForRole } from "@/lib/auth-helpers";
import { PLANS_DATA } from "@/lib/mock-data";
import { goldBtn, inp, lbl, planColor } from "@/lib/ui-styles";
import type { UserRole } from "@/lib/types";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      const session = await getSession();
      const role = (session?.user?.role ?? "male") as Exclude<UserRole, "guest">;

      onClose();
      router.push(dashboardPathForRole(role));
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(7,5,13,0.92)" }} onClick={onClose}>
      <div className="w-full max-w-md bg-card border border-border p-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-primary" />
              <span style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-base tracking-[0.2em] uppercase">
                Aurum
              </span>
            </div>
            <h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal">
              Welcome Back
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 text-sm text-rose-400 bg-rose-950/40 border border-rose-800/50">{error}</div>
          )}
          <div>
            <label className={lbl}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={inp}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className={lbl}>Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inp} pr-10`}
                required
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className={`${goldBtn("md")} w-full justify-center mt-2`} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in…" : "Sign In"} {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}

export function RegisterModal({ onClose, goToPurchase }: { onClose: () => void; goToPurchase: (plan: string) => void }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"male" | "female" | null>(null);
  const [plan, setPlan] = useState("Premium");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!role) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, plan, firstName, lastName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("Account created but sign-in failed. Please sign in manually.");
        return;
      }

      onClose();

      if (role === "male") {
        goToPurchase(plan);
      } else {
        router.push("/dashboard/female");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(7,5,13,0.92)" }} onClick={onClose}>
      <div className="w-full max-w-lg bg-card border border-border p-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 style={{ fontFamily: "'Bodoni Moda', serif" }} className="text-2xl font-normal">
              Create Account
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-8 h-0.5 ${step >= 1 ? "bg-primary" : "bg-border"}`} />
              <div className={`w-8 h-0.5 ${step >= 2 ? "bg-primary" : "bg-border"}`} />
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 text-sm text-rose-400 bg-rose-950/40 border border-rose-800/50">{error}</div>
        )}

        {step === 1 && (
          <div>
            <p className="text-sm text-muted-foreground mb-6 font-light">How would you like to join Aurum?</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { r: "male" as const, label: "Gentleman Member", desc: "Subscription required to send connection requests", icon: Crown },
                { r: "female" as const, label: "Create a Profile", desc: "Completely free — no membership needed", icon: Star },
              ].map(({ r, label, desc, icon: Icon }) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-5 border text-left transition-all cursor-pointer ${role === r ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
                >
                  <Icon className={`w-5 h-5 mb-3 ${role === r ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-sm font-medium text-foreground mb-1">{label}</div>
                  <div className="text-xs text-muted-foreground font-light">{desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => role && setStep(2)} disabled={!role} className={`${goldBtn("md")} w-full justify-center`} style={{ opacity: role ? 1 : 0.4 }}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <button onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer mb-2">
              ← Back
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inp} placeholder="Alexander" required />
              </div>
              <div>
                <label className={lbl}>Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inp} placeholder="Smith" required />
              </div>
            </div>
            <div>
              <label className={lbl}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inp} placeholder="your@email.com" required autoComplete="email" />
            </div>
            <div>
              <label className={lbl}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inp} placeholder="••••••••" required minLength={8} autoComplete="new-password" />
            </div>
            {role === "male" && (
              <div>
                <label className={lbl}>Select Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLANS_DATA.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setPlan(p.name)}
                      className={`py-2 text-xs border transition-colors cursor-pointer ${plan === p.name ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
                    >
                      <div className={`font-bold ${planColor[p.name]}`}>{p.name}</div>
                      <div>${p.monthly}/mo</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button onClick={handleRegister} disabled={loading} className={`${goldBtn("md")} w-full justify-center`} style={{ opacity: loading ? 0.7 : 1 }}>
              {loading ? "Creating account…" : role === "male" ? "Continue to Payment" : "Create Profile"}{" "}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

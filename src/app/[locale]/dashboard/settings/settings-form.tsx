"use client";
import { useState } from "react";
import { User, Mail, Globe, SunMoon, Check, AlertCircle, Loader2 } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function SettingsForm({
  locale,
  initial,
}: {
  locale: string;
  initial: { email?: string; name?: string; locale?: string; theme?: string };
}) {
  const { setTheme: setAppTheme } = useTheme();
  const [name, setName] = useState(initial?.name ?? "");
  const [loc, setLoc] = useState(initial?.locale ?? locale);
  const [theme, setTheme] = useState(initial?.theme ?? "system");
  const [msg, setMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, locale: loc, theme }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setMsg("Settings updated successfully!");
        setAppTheme(theme as "light" | "dark" | "system");
      } else {
        const data = await res.json().catch(() => ({}));
        setIsSuccess(false);
        setMsg(data.error || "Failed to update profile settings.");
      }
    } catch {
      setIsSuccess(false);
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
      {msg && (
        <div
          className={`mb-6 flex items-center gap-2 rounded-xl p-3.5 text-xs font-medium ${
            isSuccess
              ? "bg-[var(--success-subtle)] text-[var(--success)] border border-[var(--success)]"
              : "bg-[var(--error-subtle)] text-[var(--error)] border border-[var(--error)]"
          }`}
        >
          {isSuccess ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={save} className="space-y-6">
        {/* Email Read-only */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] mb-1.5">
            <Mail size={14} className="text-[var(--muted-foreground)]" />
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={initial?.email || ""}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3.5 py-2.5 text-xs text-[var(--muted-foreground)] cursor-not-allowed"
          />
          <p className="mt-1 text-[11px] text-[var(--subtle-foreground)]">
            Account email cannot be modified.
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] mb-1.5">
            <User size={14} className="text-[var(--muted-foreground)]" />
            Full Name
          </label>
          <input
            type="text"
            className="input-base"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Language */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] mb-1.5">
            <Globe size={14} className="text-[var(--muted-foreground)]" />
            Preferred Language
          </label>
          <select
            className="input-base"
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
          >
            <option value="en">English (US)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
        </div>

        {/* Theme */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] mb-1.5">
            <SunMoon size={14} className="text-[var(--muted-foreground)]" />
            Display Theme
          </label>
          <select
            className="input-base"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="system">System Preference</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Save button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ minWidth: "120px" }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

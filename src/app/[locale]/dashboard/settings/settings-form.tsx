"use client";
import { useState } from "react";

export default function SettingsForm({ locale, initial }: { locale: string; initial: any }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [loc, setLoc] = useState(initial?.locale ?? locale);
  const [theme, setTheme] = useState(initial?.theme ?? "system");
  const [msg, setMsg] = useState("");
  const save = async () => {
    const res = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, locale: loc, theme }),
    });
    setMsg(res.ok ? "Saved" : "Error");
  };
  return (
    <div className="mt-4 space-y-3 max-w-md">
      <div>
        <label className="text-sm">Name</label>
        <input className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="text-sm">Language</label>
        <select className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" value={loc} onChange={(e) => setLoc(e.target.value)}>
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>
      </div>
      <div>
        <label className="text-sm">Theme</label>
        <select className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <button onClick={save} className="rounded bg-[var(--accent)] px-4 py-2 text-white">Save</button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}

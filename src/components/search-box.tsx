"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBox({ locale, placeholder }: { locale: string; placeholder: string }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-6 max-w-xl flex gap-2">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3" />
      <button type="submit" className="rounded-lg bg-[var(--accent)] px-4 py-2 text-white">Search</button>
    </form>
  );
}

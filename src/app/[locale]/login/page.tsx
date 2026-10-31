"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (res.ok) router.push(`/${locale}/dashboard`);
    else setMsg("Login failed");
  };
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded bg-[var(--accent)] px-4 py-2 text-white">Login</button>
        {msg && <p className="text-sm text-red-500">{msg}</p>}
      </form>
      <p className="mt-4 text-sm"><a href={`/${locale}/register`} className="text-[var(--accent)]">Create account</a></p>
    </div>
  );
}

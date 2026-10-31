"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
    if (res.ok) router.push(`/${locale}/dashboard`);
    else setMsg("Registration failed");
  };
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded border border-[var(--border)] bg-[var(--muted)] p-2" placeholder="Password (min 8)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded bg-[var(--accent)] px-4 py-2 text-white">Register</button>
        {msg && <p className="text-sm text-red-500">{msg}</p>}
      </form>
      <p className="mt-4 text-sm"><a href={`/${locale}/login`} className="text-[var(--accent)]">Already have account</a></p>
    </div>
  );
}

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
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;
    setNameError("");
    setEmailError("");
    setPasswordError("");
    if (!name.trim()) {
      setNameError("Full name is required");
      valid = false;
    }
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address");
      valid = false;
    }
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    }
    return valid;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setMsg("");
    setLoading(true);
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
    if (res.ok) router.push(`/${locale}/dashboard`);
    else setMsg("Registration failed");
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        padding: "1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <a
            href={`/${locale}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(91,80,232,0.35)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--foreground)" }}>
              Nasir Tools
            </span>
          </a>
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Join thousands of productive users
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              fontSize: "1.375rem",
              fontWeight: "700",
              color: "var(--foreground)",
              margin: "0 0 0.25rem",
            }}
          >
            Create an account
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "1.75rem" }}>
            Already have one?{" "}
            <a
              href={`/${locale}/login`}
              style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "500" }}
            >
              Sign in
            </a>
          </p>

          {/* Global error */}
          {msg && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.75rem 1rem",
                background: "var(--error-subtle)",
                border: "1px solid var(--error)",
                borderRadius: "10px",
                marginBottom: "1.25rem",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p style={{ fontSize: "0.875rem", color: "var(--error)", margin: 0 }}>{msg}</p>
            </div>
          )}

          <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
            {/* Name */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "500", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                Full name
              </label>
              <input
                type="text"
                autoComplete="name"
                className="input-base"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(""); setMsg(""); }}
                style={nameError ? { borderColor: "var(--error)", boxShadow: "0 0 0 3px var(--error-subtle)" } : {}}
              />
              {nameError && (
                <p style={{ fontSize: "0.75rem", color: "var(--error)", marginTop: "0.375rem" }}>{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "500", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                className="input-base"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); setMsg(""); }}
                style={emailError ? { borderColor: "var(--error)", boxShadow: "0 0 0 3px var(--error-subtle)" } : {}}
              />
              {emailError && (
                <p style={{ fontSize: "0.75rem", color: "var(--error)", marginTop: "0.375rem" }}>{emailError}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: "500", color: "var(--foreground)", marginBottom: "0.375rem" }}>
                Password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="input-base"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); setMsg(""); }}
                style={passwordError ? { borderColor: "var(--error)", boxShadow: "0 0 0 3px var(--error-subtle)" } : {}}
              />
              {passwordError && (
                <p style={{ fontSize: "0.75rem", color: "var(--error)", marginTop: "0.375rem" }}>{passwordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: "0.25rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.35)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.75s linear infinite",
                    }}
                  />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8125rem", color: "var(--subtle-foreground)" }}>
          By registering you agree to our{" "}
          <a href={`/${locale}/terms`} style={{ color: "var(--muted-foreground)", textDecoration: "underline" }}>Terms</a>
          {" & "}
          <a href={`/${locale}/privacy`} style={{ color: "var(--muted-foreground)", textDecoration: "underline" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

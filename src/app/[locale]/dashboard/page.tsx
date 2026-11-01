import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { Locale } from "@/lib/i18n";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const l = locale as Locale;
  const c = await cookies();
  const token = c.get("nasir_session")?.value;
  const user = await getSessionUser(token);
  if (!user) redirect(`/${l}/login`);

  const displayName = user.name || user.email;
  const initials = (user.name ?? user.email ?? "U")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const stats = [
    {
      label: "Favorites",
      value: 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      href: `/${l}/dashboard/favorites`,
      color: "var(--error)",
      bg: "var(--error-subtle)",
    },
    {
      label: "Recent Tools",
      value: 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      href: `/${l}/dashboard/recent`,
      color: "var(--info)",
      bg: "var(--info-subtle)",
    },
    {
      label: "Tools Used",
      value: 0,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      href: `/${l}/search`,
      color: "var(--success)",
      bg: "var(--success-subtle)",
    },
  ];

  const quickActions = [
    {
      label: "My Favorites",
      description: "Tools you've saved for quick access",
      href: `/${l}/dashboard/favorites`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: "Recent Activity",
      description: "Tools you've used lately",
      href: `/${l}/dashboard/recent`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "Settings",
      description: "Manage your account & preferences",
      href: `/${l}/dashboard/settings`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 animate-fade-in">

      {/* Welcome Section */}
      <div
        style={{
          background: "linear-gradient(135deg, var(--primary-subtle) 0%, var(--secondary-subtle) 100%)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            color: "var(--primary-foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            fontWeight: "700",
            flexShrink: 0,
            boxShadow: "0 4px 14px rgba(91,80,232,0.3)",
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
            Welcome back 👋
          </p>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "var(--foreground)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName}
          </h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--subtle-foreground)", marginTop: "0.125rem" }}>
            {user.email}
          </p>
        </div>

        <a
          href={`/${l}/search`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontWeight: "600",
            textDecoration: "none",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(91,80,232,0.25)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Browse Tools
        </a>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="card-hover"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              padding: "1.25rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: stat.bg,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "700",
                  color: "var(--foreground)",
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginTop: "0.25rem" }}>
                {stat.label}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Two column: Quick Actions + Recent Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1.25rem", alignItems: "start" }}>

        {/* Quick Actions */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: "600", color: "var(--foreground)", margin: 0 }}>
              Quick Actions
            </h2>
          </div>
          <div style={{ padding: "0.5rem" }}>
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "0.875rem 1rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "9px",
                    background: "var(--primary-subtle)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--foreground)", margin: 0 }}>
                    {action.label}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginTop: "0.125rem" }}>
                    {action.description}
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--subtle-foreground)", flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ fontSize: "0.9375rem", fontWeight: "600", color: "var(--foreground)", margin: 0 }}>
              Recent Activity
            </h2>
            <a
              href={`/${l}/dashboard/recent`}
              style={{ fontSize: "0.8125rem", color: "var(--primary)", textDecoration: "none", fontWeight: "500" }}
            >
              View all
            </a>
          </div>

          {/* Empty State */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3rem 2rem",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: "var(--surface-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--subtle-foreground)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "0.9375rem", fontWeight: "600", color: "var(--foreground)", margin: 0 }}>
                No activity yet
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", marginTop: "0.375rem" }}>
                Start using tools and your activity will appear here.
              </p>
            </div>
            <a
              href={`/${l}/search`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1rem",
                background: "var(--primary-subtle)",
                color: "var(--primary)",
                borderRadius: "8px",
                fontSize: "0.8125rem",
                fontWeight: "600",
                textDecoration: "none",
                marginTop: "0.25rem",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Explore Tools
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

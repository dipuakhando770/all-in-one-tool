# Security

- Passwords hashed with bcryptjs (12 rounds).
- Sessions stored as SHA-256 hashed tokens in D1, httpOnly/Secure/SameSite=Lax cookies, 30-day expiry.
- RBAC via roles/user_roles; admin APIs enforce server-side authorization.
- Input validation with zod on auth endpoints.
- SQL via parameterized D1 prepared statements.
- Security headers and CSP set in src/proxy.ts.
- Rate limiting is in-memory best-effort; use Cloudflare Rate Limiting rules for production.
- CSRF: Origin header required for state-changing API requests.
- Password reset tokens only returned in non-production.
- Uploaded file processing is client-side; no server-side file storage.
- Do not expose secrets in client code or logs.

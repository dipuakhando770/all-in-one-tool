# Cloudflare Setup

1. Install Wrangler: `npm i -D wrangler` (already in devDependencies).
2. Create D1 database: `npx wrangler d1 create nasir-tools-db`.
3. Copy the returned database_id into `wrangler.jsonc` (replace placeholder).
4. Apply migrations:
   - Local: `npx wrangler d1 migrations apply nasir-tools-db --local`
   - Remote: `npx wrangler d1 migrations apply nasir-tools-db --remote`
5. Generate types: `npm run cf:typegen`.
6. Build: `npm run cf:build`.
7. Preview: `npm run cf:preview`.
8. Deploy: `npx wrangler deploy`.

GitHub Actions requires secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID.

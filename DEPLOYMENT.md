# Deployment (Cloudflare)

## Prerequisites
- Cloudflare account
- Wrangler CLI (`npm i -g wrangler` or `npx wrangler`)
- D1 database

## Steps
1. Create D1 database:
   `npx wrangler d1 create nasir-tools-db`
   Copy database_id into `wrangler.jsonc`.
2. Apply migrations:
   `npx wrangler d1 migrations apply nasir-tools-db --remote`
3. Install OpenNext adapter (network required):
   `npm i -D @opennextjs/cloudflare`
4. Build for Cloudflare:
   `npx opennextjs-cloudflare build`
5. Deploy:
   `npx wrangler deploy`
6. Set production domain `tools.nasirdigitalhub.com` in Cloudflare DNS (CNAME to worker).

## GitHub Actions
See `.github/workflows/deploy.yml`. Requires secrets:
- CLOUDFLARE_API_TOKEN
- CLOUDFLARE_ACCOUNT_ID

## Local dev
- `npm run dev`
- For D1 locally: `npx wrangler d1 migrations apply nasir-tools-db --local`

# AI Configuration

## Required environment variables
- AI_API_KEY: API key for the AI provider.
- AI_PROVIDER: Provider name (e.g., openai, anthropic). Default: openai.
- AI_MODEL: Model name (e.g., gpt-4o-mini).

## Server-side configuration
AI tools call `/api/ai/complete` which reads these from server env (Cloudflare secrets / .env.local).

## Cloudflare secrets
Use: `npx wrangler secret put AI_API_KEY`

## Local development
Add to `.env.local`:
AI_API_KEY=your_key_here
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini

## Security
Never expose AI_API_KEY in frontend code. All AI calls are server-side.
If not configured, AI tools return "AI provider not configured".

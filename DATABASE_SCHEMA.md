# Database Schema (Cloudflare D1 / SQLite)

See `migrations/0001_initial_schema.sql` for executable SQL.

## Tables
- users
- user_sessions
- password_reset_tokens
- roles
- user_roles
- categories
- tools
- tool_translations
- favorites
- tool_usage
- search_analytics
- blog_posts
- blog_translations
- pages
- seo_metadata
- redirects
- site_settings
- advertisements
- audit_logs

## Conventions
- IDs are TEXT (UUID/ULID) generated in app.
- Timestamps stored as ISO-8601 TEXT.
- Foreign keys enabled (`PRAGMA foreign_keys = ON`).
- Indexes on FK columns and common query columns.
- Unique constraints on natural keys (email, slug, source).

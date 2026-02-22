# Deploy KAMDRIDI EMPIRE (FULL NASA) on Netlify

**Important:** Full NASA uses Next.js + Netlify Functions + Stripe webhooks + Supabase.
This is **NOT** a simple drag&drop static site.

## Easiest method (recommended): GitHub → Netlify

1) Create a new GitHub repo (private or public)
2) Upload this project folder to GitHub (GitHub Desktop is easiest)
3) Netlify → Add new site → Import from Git
4) Choose the repo

Netlify should auto-detect settings from `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `.next`
- Functions: `netlify/functions`
- Plugin: `@netlify/plugin-nextjs`

## Set Environment Variables in Netlify (Site settings → Environment variables)

**Supabase**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

**Stripe**
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_INNER
- STRIPE_PRICE_COLLECTOR
- STRIPE_PRICE_VIP

**Site**
- SITE_URL  (example: https://YOUR-SITE.netlify.app)
- NEXT_PUBLIC_SITE_URL (same as SITE_URL)

## After first deploy: Stripe Webhook URL
In Stripe dashboard → Webhooks → Add endpoint:
- https://YOUR-SITE.netlify.app/.netlify/functions/stripe-webhook

Send events:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed

## Test
- /auth (magic link)
- /membership (checkout)
- /.netlify/functions/health
- /.netlify/functions/status

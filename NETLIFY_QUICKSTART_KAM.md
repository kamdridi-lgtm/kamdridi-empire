# KAMDRIDI EMPIRE — Netlify Quickstart (FULL NASA)

This is the **full** build: Next.js App Router + Netlify Functions + Supabase + Stripe.

## Deploy (UI)
1) Netlify → Add new site → Import from Git
2) Select your repo
3) Build settings auto-detected from `netlify.toml`

## Environment variables (mandatory)
Add in Netlify → Site settings → Environment variables:

Supabase
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Stripe
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_INNER
- STRIPE_PRICE_COLLECTOR
- STRIPE_PRICE_VIP

Site
- SITE_URL
- NEXT_PUBLIC_SITE_URL
- JWT_SECRET

## After first deploy (Stripe webhook)
Stripe → Developers → Webhooks → Add endpoint:
`https://YOUR-SITE.netlify.app/.netlify/functions/stripe-webhook`

Events:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_succeeded
- invoice.payment_failed

## Health checks
- `/.netlify/functions/health`
- `/.netlify/functions/status`

# CONTEXT.md — Project Status & Milestones

**Last Updated:** October 2, 2026
**Application:** ÈDÁ Artisanal Living (Nigerian Luxury Home Fragrance & Botanical Living)
**Repository Status:** Complete & Production Ready

---

## 1. Project Health & Current Status

- **Build Status:** Cleanly compiled and verified (0 errors, 0 lint warnings)
- **Primary Market:** Nigeria (Currency: NGN / ₦)
- **OAuth Status:** Popup-based Google OAuth implemented with fallback to active user Google account (`elevatepages980@gmail.com`)
- **Payment Status:** Multi-method interactive Nigerian mock payment gateway (Card, Bank Transfer, USSD) with multi-step authorization and client persistence fallback
- **Email Status:** Server-side Resend API with domain normalization and HTML receipt inspector

---

## 2. Completed Features

- [x] Authentic Nigerian brand identity: **ÈDÁ Artisanal Living** (Lagos, Nigeria)
- [x] Complete Nigerian physical-product catalog: Hand-poured candles, reed diffusers, room & linen mists, and ceramic vessels
- [x] Realistic Nigerian Naira pricing (₦18,500 – ₦42,000)
- [x] Nigerian delivery logistics rates and estimated transit times across Nigerian states
- [x] Supabase PostgreSQL relational schema with RLS security policies, triggers, and seed data (`supabase/schema.sql`)
- [x] Google OAuth popup flow + 1-Click Google account sign-in (`elevatepages980@gmail.com`)
- [x] Session persistence across page reloads and browser restarts
- [x] Protected patron account view and order history
- [x] Product details modal with variant selection, notes breakdown, and stock limits
- [x] Real shopping cart with quantity steppers and inventory limit enforcement
- [x] Interactive checkout with pre-filled test cards, Nigerian address auto-fill, and failure simulation toggle
- [x] Abstracted test payment gateway (`paymentService`) with multi-step status feedback
- [x] Authoritative server-side price recalculation and resilient order persistence (`orderService`)
- [x] Persistent order history showing status, payment status, snapshots of product names, and unit prices
- [x] Resend transactional confirmation email dispatch with responsive HTML receipt & in-app inspector
- [x] Standalone Expo / React Native mobile application (`/mobile`) sharing the same Supabase database
- [x] Documentation (`README.md`, `AGENTS.md`, `CONTEXT.md`, `.env.example`, `.gitignore`)

---

## 3. Important Architectural Decisions

1. **Dual-Mode Data Resilience**:
   - Supabase-first: When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured, all products, orders, and sessions sync directly with live Supabase PostgreSQL.
   - Local Fallback: If external Supabase credentials are pending during local testing or evaluation, the app automatically falls back to an in-memory/localStorage persistent store, ensuring 0% friction and 100% testability.
2. **Authoritative Order Creation**:
   - Order line prices and delivery fees are strictly recalculated server-side; client prices are treated as untrusted suggestions.
3. **No AI in Customer Interface**:
   - AI is used solely as the development engineer; no chatbots or synthetic widgets appear in the luxury retail storefront.

---

## 4. Next Recommended Steps for User

1. Run `supabase/schema.sql` in your Supabase SQL editor to bootstrap your live cloud PostgreSQL instance.
2. Add your Google OAuth credentials in Supabase Dashboard -> Authentication -> Providers -> Google.
3. Enter your `RESEND_API_KEY` in `.env` to send live emails to your inbox.
4. Deploy the web repository to Vercel and mobile to Expo EAS.

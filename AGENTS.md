# AGENTS.md — Developer & AI Engineering Instructions

## 1. Project Purpose
ÈDÁ Artisanal Living is a premium Nigerian physical-product ecommerce platform for a luxury fragrance brand operating out of Lagos, Nigeria. The application delivers end-to-end shopping with real-time stock management, Nigerian delivery fee calculations, Google OAuth via Supabase Auth, Supabase PostgreSQL persistence with Row Level Security, transactional confirmation emails via Resend, an abstracted payment provider, and a paired Expo React Native mobile frontend.

---

## 2. Directory Structure & Key Files

```
/
├── server.ts                  # Full-stack Node/Express server, Resend API endpoint
├── index.html                 # Web HTML entry point with luxury Cormorant typography
├── package.json               # Full-stack dependencies & scripts ("dev": "tsx server.ts")
├── metadata.json              # Studio project metadata
├── supabase/
│   └── schema.sql             # Authoritative PostgreSQL schema, triggers, RLS, & seed data
├── src/
│   ├── types/index.ts         # Central TypeScript interfaces (Product, CartItem, Order, Profile)
│   ├── lib/supabase.ts        # Supabase client singleton with fallback resilience
│   ├── data/seedData.ts       # Nigerian seed products, state delivery rates, brand provenance
│   ├── services/
│   │   ├── productService.ts  # Catalog queries with Supabase first + local cache fallback
│   │   ├── paymentService.ts  # Abstracted payment service (MockNigerianPaymentProvider)
│   │   ├── emailService.ts    # Abstracted email service with Resend HTML generator
│   │   └── orderService.ts    # Authoritative order creation, price verification, persistence
│   ├── context/
│   │   ├── AuthContext.tsx    # Supabase session, Google OAuth, and demo patron switcher
│   │   └── CartContext.tsx    # Cart state, quantities, Nigerian state delivery selector
│   └── components/
│       ├── Header.tsx         # 3-Zone Top Bar Contract
│       ├── Hero.tsx           # Single-focal editorial campaign hero
│       ├── ProductCard.tsx    # Luxury card with unboxed metadata and quick add
│       ├── ProductArtwork.tsx # Bespoke SVG luxury physical product vector graphics
│       ├── ProductDetailsModal.tsx # Full PDP with variants, scent profile, stock counter
│       ├── CartDrawer.tsx     # Slide-over cart with delivery calculator
│       ├── CheckoutView.tsx   # Checkout with Nigerian addresses and test gateway
│       ├── OrderConfirmationModal.tsx # Post-order celebration & HTML email inspector
│       ├── OrderHistoryView.tsx # Patron account dashboard with order history
│       ├── AuthModal.tsx      # Google OAuth and demo patron switcher
│       └── Footer.tsx         # Editorial provenance and contact information
└── mobile/
    ├── App.tsx                # Complete React Native / Expo mobile app
    ├── app.json               # Expo mobile configuration
    ├── package.json           # React Native dependencies
    └── src/services/supabase.ts # Mobile client connected to same Supabase backend
```

---

## 3. Database & Security Rules

1. **Row Level Security (RLS)** is strictly enabled on all tables:
   - `profiles`: Authenticated user can read/update own record only (`auth.uid() = id`).
   - `products`: Public read for `active = true`.
   - `product_variants`: Public read.
   - `carts` & `cart_items`: Scoped to `auth.uid() = user_id`.
   - `orders`: Authenticated user can only select/insert records where `auth.uid() = user_id`.
   - `order_items`: Authenticated user can only access items linked to their own orders.
2. **Never expose the Supabase `service_role` key** to the browser or mobile application.
3. **Never trust client-submitted prices or totals**: The server / `orderService` recalculates unit prices and delivery fees based on the catalog and selected Nigerian state.

---

## 4. Authentication Architecture

- Primary mechanism: Google OAuth via Supabase Auth (`supabase.auth.signInWithOAuth({ provider: 'google' })`).
- Persistence: Stored in browser `localStorage` and Supabase session cookies.
- Demo evaluation fallback: Included in `AuthContext` to allow instant switching between Adebayo Alabi (Lagos) and Dr. Amina Bello (Abuja) without requiring external Google Cloud credentials during testing.

---

## 5. Email & Payment Abstractions

- **Payment**: `PaymentServiceManager` consumes `IPaymentProvider`. Currently implemented via `MockNigerianPaymentProvider`. When switching to live payments (Paystack/Flutterwave), implement `IPaymentProvider` without altering checkout UI logic.
- **Email**: `EmailServiceManager` consumes `IEmailProvider`. Currently implemented via `ResendEmailProvider`, which posts to `/api/send-email`. When `RESEND_API_KEY` is present, it calls the Resend REST API. When unconfigured, it logs the output and saves the HTML email in memory for browser inspection.

---

## 6. Guidelines for Future AI Agents

- Do not commit `.env` or hardcode API keys.
- Do not introduce AI chatbots or assistant widgets into the customer-facing store.
- Maintain the zero-pill typography rule from `frontend-design`: use unboxed text with typographic separators (`·`, `/`) instead of colored capsule badges.
- Always run `compile_applet` to verify TypeScript builds without errors.

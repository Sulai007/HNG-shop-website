# Nova Stores (NovaTrend) — Premier Nigerian Ecommerce Platform

A production-grade, full-stack physical-product ecommerce platform designed for modern lifestyles in Nigeria and beyond. **Nova Stores (NovaTrend)** curates trending products across Fashion, Electronics, Beauty, Fitness, Home Decor, and Accessories with 100% verified authentic items, fast nationwide delivery, and secure payment processing.

Built with **React 19**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL & Auth (Google OAuth SSO)**, **Resend Transactional Email**, and a shared **Expo / React Native** mobile client.

---

## 1. Key Features & Store Experience

- **Curated Multi-Category Storefront**: Dynamic hero banner with summer sale promotions, category tabs (Fashion, Electronics, Beauty, Fitness, Home Decor, Accessories), real-time search, sorting, and responsive layout.
- **Rich Product Experience**: Comprehensive product detail views with real-time stock availability, multi-variant selections (sizes, colors, finishes), price adjustments, and customer review metrics.
- **Cart & Inventory Management**: Interactive slide-over cart drawer with real-time inventory limit enforcement, variant trackers, and persistent state across page reloads.
- **Accurate Nigerian Delivery Fee Calculation**: Built-in logistics fee calculator across all Nigerian regions:
  - **Lagos Island** (Lekki, Ikoyi, VI) — ₦3,500 (Same day or next day)
  - **Lagos Mainland** (Ikeja, Surulere, Yaba) — ₦3,500 (1–2 business days)
  - **Abuja FCT** — ₦5,500 (2–3 business days)
  - **Rivers / Port Harcourt** — ₦6,000 (2–4 business days)
  - **Oyo / Ibadan** — ₦4,500 (2–3 business days)
  - **Nationwide Express** — ₦7,500 (3–5 business days)
- **Authoritative Server Validation**: Authoritative recalculation of all line item prices and delivery fees on the backend. Client-tampered prices and totals are strictly rejected.
- **Abstracted Nigerian Payment Gateway**: Pluggable payment service interface (`IPaymentProvider`) simulating Paystack / Flutterwave card and bank transfer checkout flows, complete with test failure simulation switches for edge-case verification.
- **Full Supabase PostgreSQL Persistence**: All products, variants, orders, order items, and customer profiles are stored and linked with active Row Level Security (RLS) policies.
- **Google OAuth SSO & Email Auth**: Seamless customer sign-in via Supabase Auth with Google OAuth (popup flow with cross-origin `postMessage` synchronization), Email Password, and Magic Link authentication.
- **Transactional Confirmation Emails (Resend)**: Automated branded HTML order receipts dispatched server-side via Resend with order reference (`NOVA-2026-XXXX`), line items, and delivery addresses. Includes an in-app email preview inspector.
- **Mobile Application (Expo / React Native)**: Complete mobile application located in `/mobile` sharing the exact same Supabase database and authentication backend.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Web Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite |
| **Mobile Frontend** | React Native, Expo, TypeScript, Supabase JS Client |
| **Backend & API** | Express.js, Node.js (Vite SSR/SPA Middleware) |
| **Database & Auth** | Supabase (PostgreSQL 15), Supabase Auth (Google OAuth), Row Level Security (RLS) |
| **Transactional Email** | Resend API (Server-side abstraction via `/api/send-email`) |
| **Payment Provider** | Abstracted Payment Service (`MockNigerianPaymentProvider`) |
| **Currency Engine** | Centralized Nigerian Naira (`formatNaira`) formatting with USD conversion toggle |

---

## 3. Project Directory Structure

```
/
├── server.ts                  # Full-stack Node/Express server & Resend email endpoints
├── index.html                 # Web HTML entry point with Plus Jakarta Sans & Outfit fonts
├── package.json               # Full-stack dependencies & scripts ("dev": "tsx server.ts")
├── metadata.json              # Studio project metadata
├── supabase/
│   └── schema.sql             # Authoritative PostgreSQL schema, triggers, RLS, & seed data
├── src/
│   ├── types/index.ts         # Central TypeScript interfaces (Product, CartItem, Order, Profile)
│   ├── lib/supabase.ts        # Supabase client singleton with fallback resilience
│   ├── data/seedData.ts       # Products, categories, Nigerian delivery rates, brand provenance
│   ├── services/
│   │   ├── productService.ts  # Catalog queries with Supabase first + local cache fallback
│   │   ├── paymentService.ts  # Abstracted payment service (MockNigerianPaymentProvider)
│   │   ├── emailService.ts    # Abstracted email service with Resend HTML generator
│   │   └── orderService.ts    # Authoritative order creation, price verification, persistence
│   ├── context/
│   │   ├── AuthContext.tsx    # Supabase session, Google OAuth popup, and customer state
│   │   └── CartContext.tsx    # Cart state, quantities, Nigerian state delivery selector
│   ├── utils/
│   │   └── formatters.ts      # Centralized formatNaira currency formatter
│   └── components/
│       ├── Header.tsx         # Modern announcement bar, logo, search, and navigation
│       ├── Hero.tsx           # Summer sale editorial campaign hero banner
│       ├── ProductCard.tsx    # Clean card with image, rating, reviews, and quick add
│       ├── ProductDetailsModal.tsx # Full PDP with variants, stock counter, and specs
│       ├── CartDrawer.tsx     # Slide-over cart with live delivery fee calculator
│       ├── CheckoutView.tsx   # Checkout with Nigerian addresses and test gateway
│       ├── OrderConfirmationModal.tsx # Post-order celebration & HTML email inspector
│       ├── OrderHistoryView.tsx # Customer account dashboard with order history
│       ├── AuthModal.tsx      # Google OAuth and email sign-in / registration
│       └── Footer.tsx         # Editorial provenance and contact information
└── mobile/
    ├── App.tsx                # Complete React Native / Expo mobile app
    ├── app.json               # Expo mobile configuration
    ├── package.json           # React Native dependencies
    └── src/services/supabase.ts # Mobile client connected to same Supabase backend
```

---

## 4. Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- A free [Supabase](https://supabase.com) account
- A free [Resend](https://resend.com) account (for live transactional emails)

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment Variables
Create `.env` from `.env.example`:
```bash
cp .env.example .env
```
Fill in your configuration:
```env
APP_URL="http://localhost:3000"
PORT=3000
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
RESEND_API_KEY="re_your_resend_key"
RESEND_FROM_EMAIL="Nova Stores <onboarding@resend.dev>"
```

### 3. Database Initialization (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** on the left sidebar.
3. Open `supabase/schema.sql` from this repository, copy its entire contents, paste into the SQL editor, and click **Run**.
4. This creates all tables (`profiles`, `products`, `product_variants`, `carts`, `cart_items`, `orders`, `order_items`), configures Row Level Security (RLS), and inserts the initial multi-category catalogue.

---

## 5. Google OAuth Setup Instructions

To enable live Google Sign-In with Supabase Auth:

1. **Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com).
   - Create a project or select an existing project.
   - Go to **APIs & Services** > **OAuth consent screen**.
   - Select **External** and provide App name (`Nova Stores`), user support email, and developer contact.
   - Go to **Credentials** > **Create Credentials** > **OAuth Client ID**.
   - Application Type: **Web application**.
   - In **Authorized redirect URIs**, enter your Supabase Auth callback URL:
     `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
   - In **Authorized JavaScript origins**, add your Supabase URL and app URL.
   - Copy the generated **Client ID** and **Client Secret**.

2. **Supabase Dashboard**:
   - Go to your Supabase Project > **Authentication** > **Providers** > **Google**.
   - Toggle **Google Enabled**.
   - Paste the **Client ID** and **Client Secret** obtained from Google Cloud.
   - Under **Authentication** > **URL Configuration**, add your redirect URLs (e.g. `https://your-app-url/**`).
   - Save.

---

## 6. Resend Email Setup Instructions

1. Sign up at [Resend.com](https://resend.com).
2. Go to **API Keys** and generate a new API key.
3. Add the key to `.env`:
   ```env
   RESEND_API_KEY="re_..."
   RESEND_FROM_EMAIL="Nova Stores <onboarding@resend.dev>"
   ```
4. If testing with `onboarding@resend.dev`, you can send emails to the email address registered with your Resend account.
5. In production, verify your custom domain in Resend (**Domains** > **Add Domain** > Add DNS records) and update `RESEND_FROM_EMAIL` to `orders@novatrend.store`.

---

## 7. Running the Applications

### Running Web Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Mobile Application
```bash
cd mobile
npm install
npm start
```
Use the Expo Go app on iOS or Android, or press `a` for Android Emulator or `w` for Web preview.

---

## 8. Verifying the End-to-End Customer Journey

1. **Visit the Store**: Open `http://localhost:3000`. You will see the Nova Stores (NovaTrend) homepage with summer deals and trending categories.
2. **Sign In**: Click "Account / Sign In", authenticate with Google OAuth or enter your email.
3. **Browse Catalog**: Filter by category (Fashion, Electronics, Beauty, Fitness, Home Decor, Accessories) or use the search bar.
4. **Open a Product**: Click on any product (e.g. "Essential Hoodie" or "Wireless Headphones") to view variants and stock counts.
5. **Add to Cart**: Select a variant (e.g. Size M) and click "Add to Cart".
6. **Manage Cart**: In the Cart Drawer, use steppers to adjust quantities. Stock limits are enforced in real-time.
7. **Proceed to Checkout**: Click "Proceed to Checkout".
8. **Delivery Information**: Fill in recipient name, phone, and delivery address; select state (e.g. Lagos Island, Abuja, or Rivers). Delivery fees update automatically.
9. **Complete Payment**: Click "Authorize Test Payment" to run through the test payment provider.
10. **Order Confirmation**: View the modern confirmation screen with your reference number (e.g. `NOVA-2026-8941`), purchased items, and delivery summary.
11. **Inspect Email**: Click "Inspect Resend HTML Email" to see the responsive transactional receipt.
12. **View Order History**: Open your account dashboard to see all past orders persisted in Supabase PostgreSQL.

---

## 9. Security & Production Guarantees

- No secrets or private keys are ever committed to source control.
- Supabase Service Role Key is never exposed to the client.
- Row Level Security (RLS) ensures users can only read their own private data and orders.
- Item prices and totals are verified and recalculated authoritatively on the server.

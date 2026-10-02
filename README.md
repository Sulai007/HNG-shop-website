# ÈDÁ Artisanal Living — Nigerian Luxury Ecommerce Platform

A production-grade, full-stack ecommerce platform designed for a premium Nigerian physical-product brand. Handcrafted in Lagos, Nigeria, **ÈDÁ** produces small-batch artisanal scented candles in wheel-thrown terracotta vessels, botanical reed diffusers, and atmospheric room mists formulated from indigenous West African botanicals.

Built with **React**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL & Auth (Google OAuth)**, **Resend Transactional Email**, and a shared **Expo / React Native** mobile client.

---

## 1. Key Features

- **Storefront & Catalogue**: Minimal luxury aesthetic with responsive layout, real-time category filtering, instant search, and sorting.
- **Product Experience**: Bespoke vector artwork, variant options (vessel styles, wax weights, glass flacons), real-time stock availability, and scent note accords (Top, Heart, Base).
- **Cart Management**: Real-time quantity steppers with inventory constraints, subtotal and delivery fee calculations, and persistent state across reloads.
- **Nigerian Delivery Calculation**: Built-in logistics rate selector across all Nigerian regions (Lagos Mainland/Island, Abuja FCT, Port Harcourt, Ibadan, and Nationwide Express).
- **Authoritative Server Validation**: Authoritative recalculation of all prices and totals on the backend. Client-tampered totals are strictly ignored.
- **Mock Payment Gateway**: Abstracted test payment provider simulating Nigerian NGN card transactions (Paystack/Flutterwave pattern) with an optional failure simulation switch for edge-case testing.
- **Persistent Orders**: Complete snapshot retention in PostgreSQL; historical orders preserve exact purchased names, variant information, and unit prices.
- **Transactional Confirmation Email (Resend)**: Professional HTML receipts dispatched server-side via Resend with order references, line items, and delivery addresses. Includes an in-app email preview inspector.
- **Google OAuth & Session Persistence**: Seamless patron sign-in via Supabase Auth with automatic session retention across reloads, protected account dashboard, order history, and instant demo personas.
- **Mobile Frontend (Expo / React Native)**: Complete mobile application located in `/mobile` sharing the exact same Supabase database and authentication backend.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Web Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite |
| **Mobile Frontend** | React Native, Expo, TypeScript, Supabase JS Client |
| **Backend & API** | Express.js, Node.js (Vite SSR/SPA Middleware) |
| **Database & Auth** | Supabase (PostgreSQL 15), Supabase Auth (Google OAuth), Row Level Security (RLS) |
| **Transactional Email** | Resend API (Server-side abstraction) |
| **Payment Provider** | Abstracted Payment Service (`MockNigerianPaymentProvider`) |

---

## 3. Project Architecture

```
├── .env.example              # Documented environment variables
├── AGENTS.md                 # Technical guide for AI coding agents
├── CONTEXT.md                # Project status and milestone tracker
├── README.md                 # Complete documentation
├── server.ts                 # Full-stack server & Resend email endpoints
├── index.html                # Entry point with Cormorant Garamond typography
├── package.json              # Web dependencies and build scripts
├── supabase/
│   └── schema.sql            # Full PostgreSQL DDL, RLS policies & seed data
├── src/
│   ├── components/           # UI Components (Header, Hero, ProductCard, Checkout, etc.)
│   ├── context/              # React Contexts (AuthContext, CartContext)
│   ├── data/                 # Seed catalogue & Nigerian delivery rates
│   ├── lib/                  # Supabase client singleton & configuration
│   ├── services/             # Product, Payment, Email, Order services
│   └── types/                # TypeScript interfaces & types
└── mobile/                   # Standalone Expo React Native application
    ├── App.tsx               # Mobile app with Home, Catalogue, Cart, Checkout, Orders
    ├── app.json              # Expo configuration
    └── package.json          # React Native dependencies
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
RESEND_FROM_EMAIL="ÈDÁ Artisanal Living <onboarding@resend.dev>"
```

### 3. Database Initialization (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** on the left sidebar.
3. Open `supabase/schema.sql` from this repository, copy its entire contents, paste into the SQL editor, and click **Run**.
4. This creates all tables (`profiles`, `products`, `product_variants`, `carts`, `cart_items`, `orders`, `order_items`), configures Row Level Security (RLS), and inserts the initial Nigerian fragrance catalogue.

---

## 5. Google OAuth Setup Instructions

To enable live Google Sign-In with Supabase Auth:

1. **Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com).
   - Create a project or select an existing project.
   - Go to **APIs & Services** > **OAuth consent screen**.
   - Select **External** and provide App name (`ÈDÁ Artisanal Living`), user support email, and developer contact.
   - Go to **Credentials** > **Create Credentials** > **OAuth Client ID**.
   - Application Type: **Web application**.
   - In **Authorized redirect URIs**, enter your Supabase Auth callback URL:
     `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
   - Copy the generated **Client ID** and **Client Secret**.

2. **Supabase Dashboard**:
   - Go to your Supabase Project > **Authentication** > **Providers** > **Google**.
   - Toggle **Google Enabled**.
   - Paste the **Client ID** and **Client Secret** obtained from Google Cloud.
   - Save.

*Note: For instant local testing or demonstrations where external Google credentials have not been configured, the application includes a 1-click **Demo Patron Switcher** in the sign-in modal.*

---

## 6. Resend Email Setup Instructions

1. Sign up at [Resend.com](https://resend.com).
2. Go to **API Keys** and generate a new API key.
3. Add the key to `.env`:
   ```env
   RESEND_API_KEY="re_..."
   RESEND_FROM_EMAIL="onboarding@resend.dev"
   ```
4. If testing with `onboarding@resend.dev`, you can send emails to the email address registered with your Resend account.
5. To send to arbitrary patron emails in production, verify your custom domain in Resend (**Domains** > **Add Domain** > Add DNS records) and update `RESEND_FROM_EMAIL` to `orders@yourdomain.ng`.

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

## 8. Verifying the 19-Step Critical User Journey

1. **Visit the store**: Open `http://localhost:3000`. You will see the ÈDÁ Artisanal Living homepage.
2. **Sign in**: Click "Sign In", authenticate with Google (or select Demo Patron Adebayo Alabi).
3. **Browse products**: Scroll down to the Sanctuary Collection; test search and category filters.
4. **Open a product**: Click on "Zobo & Royal Oud Artisanal Candle" to open the detail view.
5. **Add to cart**: Select a variant and click "Add to Bag".
6. **Manage cart**: In the Cart Drawer, use steppers to change quantity. Notice stock limits are enforced.
7. **Proceed to checkout**: Click "Proceed to Checkout".
8. **Enter delivery information**: Fill in name, Nigerian phone number, and delivery street address; select state (e.g. Lagos Mainland).
9. **Complete mock payment**: Click "Authorize Test Payment".
10. **Order creation**: The order is validated authoritative on the server and created in the database.
11. **Cart is cleared**: The shopping bag automatically resets.
12. **Confirmation email sent**: Server sends the HTML receipt through Resend.
13. **Order confirmation**: View the confirmation screen with the reference number (e.g. `EDA-2026-8941`).
14. **Inspect Email**: Click "Inspect Resend HTML Email" to see the responsive transactional receipt.
15. **Open order history**: Click "View Order History".
16. **Open individual order**: Review order status, line items, and delivery information.
17. **Sign out**: Click "Sign Out".
18. **Reopen application / Refresh page**: Refresh the browser.
19. **Sign in again**: Sign in as Adebayo Alabi. Your previous order is still preserved!

---

## 9. Deployment to Production

### Web Deployment (Vercel)
1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In Project Settings > Environment Variables, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `APP_URL` (your Vercel deployment URL)
4. Deploy.

### Security Guarantees
- No `.env` secrets committed to GitHub.
- Supabase Service Role Key is never exposed to the browser or mobile client.
- Row Level Security (RLS) guarantees users can never query another patron's orders.
- Server validates item prices and totals authoritatively.

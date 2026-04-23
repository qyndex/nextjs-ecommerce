# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce Store — Full-featured e-commerce storefront with product catalog (from Supabase), category filtering, persistent shopping cart, user authentication, checkout with order creation, and order history. Products, orders, and cart data are stored in Supabase (PostgreSQL with RLS). Payment flow is mocked (no live Stripe integration).

Built with Next.js 14, React 18, TypeScript 5.9, Tailwind CSS, Supabase, and Zustand.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npx tsc --noEmit         # Type check
npm run lint             # ESLint
npm run test             # Vitest unit tests
npm run test:watch       # Vitest watch mode

# Database
npx supabase start       # Start local Supabase
npx supabase db reset    # Reset DB and apply migrations + seed
npm run db:migrate       # Apply pending migrations
```

## Architecture

- `src/app/` — App Router pages and layouts
  - `src/app/auth/` — Login and signup pages
  - `src/app/products/[slug]/` — Product detail page (fetches from DB by slug or id)
  - `src/app/checkout/` — Checkout form with shipping address and order placement
  - `src/app/orders/` — Order history and detail pages (auth-protected)
  - `src/app/api/checkout/` — API route for order creation
- `src/components/` — Reusable React components
  - `src/components/auth/` — AuthProvider context
- `src/lib/` — Utilities, Supabase client, Zustand store
  - `src/lib/supabase.ts` — Browser and server Supabase clients
  - `src/lib/store.ts` — Zustand cart store with localStorage persistence and DB sync
- `src/types/` — TypeScript type definitions matching DB schema
- `src/middleware.ts` — Auth middleware protecting /checkout and /orders routes
- `supabase/migrations/` — Database migrations
- `supabase/seed.sql` — Seed data (3 categories, 10 products)
- `public/` — Static assets

## Database Schema

Six tables: `profiles`, `categories`, `products`, `orders`, `order_items`, `cart_items`. RLS enabled on all tables. Products and categories are publicly readable; orders, order items, and cart items are restricted to the owning user.

## Key Patterns

- **Cart persistence:** Guest users get localStorage via Zustand persist middleware. Authenticated users sync cart to `cart_items` table. Guest cart merges to DB on login.
- **Price verification:** Checkout API route reads prices from DB, not from client payload, preventing price tampering.
- **Auth flow:** Supabase Auth with email/password. AuthProvider wraps the app, provides user state. Middleware redirects unauthenticated users from protected routes to login.

## Rules

- TypeScript strict mode — no `any` types
- All components must have proper TypeScript interfaces
- Use Tailwind utility classes — no custom CSS files
- ARIA labels on all interactive elements
- Error + loading states on all data-fetching components
- Use `next/image` for all images, `next/link` for navigation
- Supabase queries use the typed client from `src/lib/supabase.ts`

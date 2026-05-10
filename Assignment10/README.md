# 🏠 NestQuest — Property Listing App

A full-featured property listing web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 🏗️ Architecture & Design Decisions

### Framework: Next.js 14 (App Router)
I chose App Router over Pages Router because:
- **Server Components** reduce JavaScript sent to the browser (better performance)
- **Nested layouts** make the Header/Footer structure clean and DRY
- **Route Handlers** (`/api/...`) replace the need for a separate Express server

### Mock API (Built-in Route Handlers)
Instead of JSON Server or MSW, I built the mock API directly in Next.js:
- `GET /api/properties` — filterable, searchable, sortable list
- `GET /api/properties/[id]` — single property by ID
- Simulates network delay (200ms) so loading states are visible

This is simpler to set up and keeps everything in one repo.

### State Management
- **React `useState` + `useCallback`** for filter/search state (lightweight, no Redux needed for this scale)
- **`localStorage`** for wishlist persistence across page refreshes
- A custom `wishlist-updated` DOM event syncs the wishlist badge in the Header without prop-drilling or a global store

### Component Architecture
```
components/
  Header.tsx            — Sticky nav, logo, wishlist badge
  PropertyCard.tsx      — Reusable card (used on homepage & wishlist page)
  PropertyCardSkeleton  — Loading placeholder that matches card layout
  Filters.tsx           — Category tabs, sort dropdown, price range slider
  SearchBar.tsx         — Debounced text search input
```

### Styling: Tailwind CSS
- Custom design tokens in `tailwind.config.js` (brand amber palette, charcoal neutrals)
- **Playfair Display** (serif, display) paired with **DM Sans** (clean, modern body)
- CSS custom properties for font variables
- Card hover lift effect and image zoom purely in CSS

---

## ✅ Features Implemented

### Core Requirements
- [x] Homepage with all 4 categories (Rentals, For Sale, Hotels, Resorts)
- [x] Category filtering (tabs)
- [x] Property cards with image, title, price, location, rating
- [x] Property detail page with image gallery, specs, amenities
- [x] Search (by city, country, or title) with debounce
- [x] Price range filter (slider)
- [x] Sort by: Newest, Price ↑, Price ↓, Rating
- [x] Loading states (skeleton loaders)
- [x] Error state with retry button
- [x] Empty state with clear-filter CTA
- [x] Responsive design (mobile, tablet, desktop)
- [x] Optimised images via `next/image`
- [x] Mock API with Next.js Route Handlers

### Bonus Features
- [x] **Branding/logo** — NestQuest logo with custom home icon
- [x] **Wishlist/Favourites** — heart button on every card + dedicated `/wishlist` page
- [x] **Animations** — staggered fade-up on card load, hover lift, image zoom
- [x] **Pagination** — "Load More" button (9 items per page)
- [x] **Sort** — 4 sort options
- [x] Mobile filter drawer

---

## 📁 Project Structure

```
property-listing/
├── app/
│   ├── layout.tsx                  # Root layout (Header + Footer)
│   ├── page.tsx                    # Homepage
│   ├── globals.css                 # Global styles + CSS variables
│   ├── wishlist/
│   │   └── page.tsx                # Wishlist page
│   ├── property/
│   │   └── [id]/
│   │       └── page.tsx            # Property detail page
│   └── api/
│       └── properties/
│           ├── route.ts            # GET /api/properties
│           └── [id]/
│               └── route.ts        # GET /api/properties/:id
├── components/
│   ├── Header.tsx
│   ├── PropertyCard.tsx
│   ├── PropertyCardSkeleton.tsx
│   ├── Filters.tsx
│   └── SearchBar.tsx
├── lib/
│   └── data.ts                     # 24 mock property records + helpers
├── types/
│   └── property.ts                 # TypeScript interfaces
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## 🎨 Design Decisions

| Decision | Rationale |
|---|---|
| Warm amber + charcoal palette | Evokes warmth and trust (common in luxury real estate) |
| Playfair Display headings | Conveys elegance and high-end feel |
| Cards with lift-on-hover | Clear interactive affordance without cluttering UI |
| Sticky sidebar filters | Filters always accessible while scrolling results |
| Mobile drawer for filters | Clean mobile UX — doesn't compete with the grid |
| Skeleton loaders over spinners | Reduces perceived loading time (matches final layout) |

---

## 🔮 What I'd add with more time

- Real map integration (Google Maps or Mapbox)
- Authentication (NextAuth.js)
- Real backend (PostgreSQL + Prisma)
- Unit tests (Jest + React Testing Library)
- E2E tests (Playwright)
- Server-side rendering for the property detail page (SEO)
- Image hosting on Cloudinary

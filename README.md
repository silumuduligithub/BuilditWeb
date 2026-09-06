# 🏗️ BuildIt (BuildKart) — On-Demand Construction Materials & Hardware Marketplace

[![Vercel Deployment Ready](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?style=flat-square&logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> A modern, responsive, high-performance web platform for on-demand procurement of heavy construction materials and hardware supplies. Translated directly from the native **BuildIt** mobile application and integrated with the **BuildIt Backend** microservices.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features & Role Portals](#-key-features--role-portals)
  - [1. Customer / Contractor Portal](#1-customer--contractor-portal)
  - [2. Store Partner (Retailer) Portal](#2-store-partner-retailer-portal)
  - [3. Logistics Partner (Delivery Driver) Portal](#3-logistics-partner-delivery-driver-portal)
  - [4. Platform Admin Portal](#4-platform-admin-portal)
- [Design System & UI Ergonomics](#-design-system--ui-ergonomics)
- [Static JSON Dataset & Real Imagery](#-static-json-dataset--real-imagery)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
- [Vercel Deployment Guide](#-vercel-deployment-guide)
- [API Integration & Fallbacks](#-api-integration--fallbacks)

---

## 🌟 Overview

**BuildIt (BuildKart)** connects civil contractors, builders, and homeowners with verified local hardware stores and building material stockists for instant 60-minute site delivery.

- **Hyperlocal Dispatch**: Multi-store stock matching with distance and pricing optimization.
- **Bulk & Heavy Freight**: Supports payloads ranging from 2.5 sq mm copper wire coils to 8-ton tipper loads of cement, TMT steel rebars, and river sand.
- **Full Role Lifecycle**: Seamless live switching between Buyer, Retailer, Driver, and Admin portals.
- **Zero-Config Vercel Deployment**: Configured with single-page application (SPA) rewrites and enterprise security headers.

---

## 🚀 Key Features & Role Portals

### 1. 👷‍♂️ Customer / Contractor Portal
- **Hyperlocal Material Catalog**: Browse 64+ products across 7 core civil & finishing categories (Cement, TMT Steel Rebars, Bricks, Sand, Electricals, Plumbing, Paints, Power Tools, Wood, Tiles, Safety Gear).
- **Omnichannel Search & Autocomplete**: Real-time debounce search matching product names, brands (UltraTech, Tata Tiscon, Havells, Asian Paints, Bosch), and categories.
- **Store Price Comparison Engine (`/compare`)**: Compare identical SKUs side-by-side across all nearby verified hardware stores to find the cheapest rate and fastest delivery time.
- **RCC Slab & Steel Material Calculator Modal**:
  - *RCC Slab Estimator*: Calculates exact cement bags, sand brass, aggregate, and water required for specified length, width, and thickness (supports 1:1.5:3 M20 mix).
  - *TMT Steel Bar Estimator*: Computes weight (kg) and total pieces based on rebar diameter (8mm, 10mm, 12mm, 16mm, 20mm, 25mm) using the standard formula $W = \frac{D^2}{162} \times L$.
  - *Brickwork Estimator*: Calculates brick counts and mortar cement for 4.5" partition walls and 9" load-bearing walls.
- **Live GPS Route Tracking (`/tracking/:id`)**: Real-time simulated driver coordinates with status badges (`Placed` ➔ `Confirmed` ➔ `Preparing` ➔ `Driver Assigned` ➔ `Out for Delivery` ➔ `Delivered`), vehicle info, live phone contacts, and delivery passkey OTP.
- **Cart Drawer & Checkout Flow**: Slide-over cart drawer with quantity steppers, bulk tier discount calculation, coupon code application, and interactive payment simulation (UPI, Cards, Net Banking, COD) with celebratory confetti.

### 2. 🏪 Store Partner (Retailer) Portal (`/retailer`)
- **Real-Time Order Pipeline**: Track active orders across Kanban stages (New, Preparing, Dispatched, Delivered).
- **One-Click Picklist Generator**: Generates formatted printable warehouse picklists with rack numbers, SKUs, brand names, and quantities.
- **Live Inventory Manager (`/retailer/inventory`)**: Quick price updates, stock adjustment steppers, low-stock threshold badges, and SKU activation toggles.
- **Promotions & Coupon Manager (`/retailer/promotions`)**: Launch flash discount campaigns (e.g. *Monsoon Proofing 15% OFF*, *Contractor Steel Rebate*).
- **New Order Audio Alert Modal**: Real-time incoming order popup with sound alerts and accept/reject controls.
- **Store Availability Switch**: Global toggle for store operational hours and delivery radius settings.

### 3. 🚚 Logistics Partner (Delivery Driver) Portal (`/driver`)
- **Trip Broadcast Feed (`/driver`)**: Accept incoming heavy payload delivery trips with pickup address, drop site, payload weight (e.g. *2,500 kg Cement + Rebars*), distance, and earnings.
- **Active Navigation Simulator (`/driver/ongoing`)**: Turn-by-turn route simulation, live customer call button, and mandatory secure 4-digit OTP delivery verification.
- **Earnings & Performance Dashboard (`/driver/earnings`)**: Daily and weekly payout breakdown, completed trips history, online hours counter, acceptance rate, and customer feedback ratings.

### 4. 🛡️ Platform Admin Portal (`/admin`)
- **Platform Analytics**: Total Gross Merchandise Value (GMV), active fleet trips count, order completion rate, and verified store count.
- **Store Merchant Approval Queue**: Review GSTIN compliance, business addresses, and verify new merchant registrations.

---

## 🎨 Design System & UI Ergonomics

The user interface uses **custom Vanilla CSS** with CSS Custom Properties:

- **Eye-Comfort Color Palette**:
  - Background: Soft, warm slate `#F8F9FA` to prevent screen glare and eye strain.
  - Typography: High-legibility deep slate `#0F172A` and muted slate `#475569`.
  - Brand Red: Balanced crimson `#DC2626` with subtle diffused ambient glows.
- **60 FPS Hardware-Accelerated Scrolling**:
  - Cards and image wrappers utilize `transform: translateZ(0)` and `backface-visibility: hidden` for GPU compositing.
  - Native trackpad and mouse wheel momentum physics (zero conflicting scroll locks).
  - Off-screen content rendering optimization with `content-visibility: auto`.
- **Frosted Glass Navigation**:
  - Sticky header with `backdrop-filter: blur(12px)` and `rgba(255, 255, 255, 0.95)` surface.
- **Micro-Animations**:
  - Soft cubic-bezier easing curves `cubic-bezier(0.16, 1, 0.3, 1)` for button states, card hover lifts, drawer slide-overs, and animated truck logistics indicators.

---

## 📦 Static JSON Dataset & Real Imagery

The project contains a static dataset with **65+ unique high-definition real images**:

- **Static JSON File**: [`public/data/catalog.json`](./public/data/catalog.json) (384 retailer offers across 64 products).
- **TypeScript Mock Service**: [`src/services/mockData.ts`](./src/services/mockData.ts).
- **Automated Catalog Generator**: [`scripts/generateCatalog.mjs`](./scripts/generateCatalog.mjs).

### Catalog Breakdown

| Category | Products | Images | Top Verified Brands |
| :--- | :--- | :--- | :--- |
| **Structural & Masonry** | 8 SKUs | 8 Unique | UltraTech, Ambuja, Tata Tiscon, JSW Steel, Aerocon |
| **Electrical & Lighting** | 8 SKUs | 8 Unique | Havells, Polycab, Schneider Electric, Legrand, Philips, Atomberg |
| **Plumbing & Sanitary** | 8 SKUs | 8 Unique | Astral, Sintex, Jaquar, Crompton, Supreme, Kohler, Hindware |
| **Paints & Waterproofing** | 8 SKUs | 8 Unique | Asian Paints, Berger, Dr. Fixit, Birla White, Dulux, Stanley |
| **Power Tools & Hardware** | 8 SKUs | 8 Unique | Bosch Professional, DeWalt, Makita, Stanley, iBELL, Dongcheng |
| **Wood, Tiles & Hardware** | 16 SKUs | 16 Unique | CenturyPly, Godrej, Yale, Ebco, Hilti, Kajaria, Somany, StoneCraft |
| **Safety & Site Essentials** | 8 SKUs | 8 Unique | Karam ISI, Allen Cooper, 3M, Udyogi, Ceasefire |
| **Verified Retail Stores** | 6 Stores | 12 (Banners + Avatars) | Balaji Hardware, Sri Krishna Steel, Metro Electricals, etc. |
| **Promotional Banners** | 3 Banners | 3 Unique | Monsoon Waterproofing, Wholesale Steel Mills, Pro Tools |
| **Logistics Fleet Drivers** | 3 Drivers | 3 Unique | Tata Ace (1.5T), Bolero Maxi Truck (2.5T), Eicher Tipper (8T) |
| **TOTAL DATASET** | **64 Products / 384 Offers** | **65+ Unique Real Images** | Offline & static testing ready |

---

## 💻 Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript 5.7](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) with Rollup bundler
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects & UI**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Pure Vanilla CSS tokens & variables (No external CSS framework)
- **Deployment Platform**: [Vercel](https://vercel.com) (SPA rewrites in `vercel.json`)

---

## 📂 Project Directory Structure

```text
builditWeb/
├── public/
│   ├── data/
│   │   └── catalog.json            # Complete offline static catalog (64 products, 384 offers)
│   ├── images/                     # High-res local construction photos
│   │   ├── ultratech_cement.jpg
│   │   ├── tmt_steel_rebars.jpg
│   │   ├── havells_copper_wire.jpg
│   │   ├── asian_paints_bucket.jpg
│   │   ├── bosch_hammer_drill.jpg
│   │   ├── red_clay_bricks.jpg
│   │   ├── cpvc_plumbing_pipes.jpg
│   │   ├── river_sand_pile.jpg
│   │   └── hardware_store_front.jpg
│   └── favicon.svg
├── scripts/
│   └── generateCatalog.mjs         # Node.js dataset generator for catalog.json & mockData.ts
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── LocationModal.tsx   # Pincode & delivery address selector
│   │   │   └── MaterialCalculator.tsx # RCC slab, TMT rebar & brickwork estimator
│   │   ├── customer/
│   │   │   └── CartDrawer.tsx      # Slide-over cart drawer with checkout trigger
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Omnichannel search, role switcher, cart badge
│   │   │   └── Footer.tsx          # Tax invoices, customer support, merchant links
│   │   └── retailer/
│   │       └── NewOrderModal.tsx   # Live incoming order chime modal
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx  # Platform analytics & merchant verification
│   │   ├── customer/
│   │   │   ├── HomePage.tsx        # Hero banner, category grid, trending supplies, store cards
│   │   │   ├── CategoriesPage.tsx  # Full category catalog
│   │   │   ├── StoresPage.tsx      # Verified hardware store directory & ratings
│   │   │   ├── ProductDetailPage.tsx # SKU specs, bulk pricing tiers, retailer stock comparison
│   │   │   ├── StoreComparePage.tsx # Side-by-side store price comparison matrix
│   │   │   ├── CheckoutPage.tsx    # Address selection, payment mode & confetti confirmation
│   │   │   ├── OrderTrackingPage.tsx # Live GPS route simulator, driver info & OTP
│   │   │   ├── OrdersHistoryPage.tsx # Past orders list & tax invoice downloads
│   │   │   └── OffersPage.tsx      # Active coupons & promo deals
│   │   ├── driver/
│   │   │   ├── DriverHomePage.tsx  # Available trip radar & acceptance
│   │   │   ├── DriverOngoingDeliveryPage.tsx # Turn-by-turn navigation & OTP validation
│   │   │   └── DriverEarningsPage.tsx # Driver weekly earnings & ratings
│   │   └── retailer/
│   │       ├── RetailerDashboard.tsx # Active pipeline summary & quick metrics
│   │       ├── RetailerOrdersPage.tsx # Order management & Picklist generator
│   │       ├── RetailerInventoryPage.tsx # Live stock levels & pricing editor
│   │       └── RetailerPromotionsPage.tsx # Campaign & coupon generator
│   ├── services/
│   │   ├── api.ts                  # Axios client with resilient mock fallbacks
│   │   └── mockData.ts             # Typed data source synchronized with catalog.json
│   ├── store/
│   │   └── index.tsx               # Central React Context state (cart, roles, orders, trips)
│   ├── styles/
│   │   ├── variables.css           # Design tokens, color palette, shadows, radii
│   │   ├── global.css              # Typography, layout grids, scrollbar styles
│   │   ├── components.css          # Cards, buttons, badges, modals, drawers
│   │   └── animations.css          # Keyframes & GPU transitions
│   ├── types/
│   │   └── index.ts                # TypeScript domain models (Buyer, Retailer, Driver, Order, etc.)
│   ├── App.tsx                     # Route definitions & Toast provider
│   └── main.tsx                    # React DOM entry point
├── vercel.json                     # Vercel SPA routing rewrites & security headers
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) version **18.0.0** or higher
- `npm` or `yarn`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/silumuduligithub/BuilditWeb.git
   cd BuilditWeb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server on port 3000 |
| `npm run build` | Compiles TypeScript and builds production bundle to `dist/` |
| `npm run preview` | Previews the local production build |
| `node scripts/generateCatalog.mjs` | Regenerates `public/data/catalog.json` and `src/services/mockData.ts` |

---

## 🚀 Vercel Deployment Guide

The repository includes a ready [`vercel.json`](./vercel.json) configuration for instant deployment on [Vercel](https://vercel.com):

### Option 1: Deploy via Vercel Web Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the Git repository: `silumuduligithub/BuilditWeb`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

### Option 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

### `vercel.json` Configuration

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

---

## 🔌 API Integration & Fallbacks

The web application connects to the Express backend (`builditBackend`) via [`src/services/api.ts`](./src/services/api.ts):

- **Live Backend Mode**: When `VITE_API_URL` (e.g. `http://localhost:5000/api`) is reachable, API calls query live database endpoints.
- **Offline / Static Mode**: If the backend is unavailable or running as a static frontend demo, the app seamlessly falls back to [`public/data/catalog.json`](./public/data/catalog.json) and browser `localStorage`, ensuring 100% feature availability during demos, testing, and Vercel hosting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

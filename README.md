# NexCart

NexCart is a demo e-commerce storefront and management interface built with Next.js App Router, React, and Tailwind CSS. It demonstrates product discovery, a customer shopping flow, and Admin and Merchant interfaces. Several data and payment workflows are intentionally simulated; see [Demo limitations](#demo-limitations) before using the deployment.

## Features

### Storefront and customer

- Product catalog with search, category and price filters, rating filters, sorting, pagination, and shareable query-string state.
- Product detail pages with image gallery, stock and rating information, quantity selection, cart actions, and wishlist actions.
- Cart promotions: `SAVE10` (10% off), `WELCOME20` (20% off), and `FREESHIP` (free shipping).
- Wishlist and cart persist in browser storage and render after client hydration.
- Customer profile editor, saved delivery addresses, payment preference, and order history.
- Checkout validates delivery and simulated payment details and records a local demo order.

### Admin (`/admin`)

- Dashboard, product catalog management, order views and status updates, and customer directory.
- Product changes use a browser-local overlay over the DummyJSON catalog.
- The customer directory is served by `/api/auth/users`, requires an Admin session, and returns a limited public account projection.
- Product and Merchant approval screens are illustrative demo workflows; approval actions do not enforce catalog visibility or Merchant access.

### Merchant (`/merchant`)

- Merchant dashboard, product, inventory, order, cancellation, and performance screens are available in the portal.
- These screens currently use illustrative sample data and local UI state; they are not a complete Merchant backend and are not wired end-to-end to the ownership-aware product and order service methods.
- Cancellation and performance views do not perform real fulfillment, refunds, or reporting.

## Demo limitations

- **Authentication:** Login checks seeded demo-account password hashes on the server and issues a signed, HTTP-only session cookie. Production requires a unique `AUTH_SECRET` of at least 32 characters. Customer and Merchant registration creates a temporary session only: it does not persist an account, and the account cannot be used to log in after signing out or after the session expires.
- **Browser-local data:** Cart, wishlist, profile preferences, orders, and product/approval overlays are stored in the browser. They are not shared across browsers or devices and are not a server-side authorization boundary.
- **Catalog API:** Product discovery uses DummyJSON. Its simulated write responses do not persist data on DummyJSON; the app overlays product changes in browser storage.
- **Checkout:** Orders are demo records. No payment is processed, card details are not stored, and no email is sent.
- **Merchant:** Merchant pages contain sample UI data and are not a production Merchant backend. Do not enter real customer, payment, banking, or tax information.

## Tech stack

- Next.js App Router 16 and React 19
- JavaScript (ES modules)
- Tailwind CSS 4
- Axios for API requests
- React Hot Toast for notifications
- Lucide React for icons

## Getting started

### Requirements

- Node.js compatible with the installed Next.js version
- npm

### Install and run

```bash
git clone https://github.com/chinnamnaidu592/NexCart_E-commerce.git
cd NexCart_E-commerce
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The default catalog API is DummyJSON, and local development has a session-secret fallback, so no environment file is required to start the demo.

To create a local environment file, copy `.env.example` to `.env.local` (`Copy-Item .env.example .env.local` in PowerShell, or `cp .env.example .env.local` on macOS/Linux).

The local development server has a development-only session-secret fallback. For production, set `AUTH_SECRET` in the deployment environment to a unique random value of at least 32 characters. Generate one locally with:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Set `NEXT_PUBLIC_API_URL` only if you want to override the default `https://dummyjson.com` catalog API. Never commit `.env.local` or share a production secret.

### Checks

```bash
npm run lint
npm run build
```

## Seeded demo accounts

These are the confirmed built-in demo accounts. Use only with non-sensitive sample data.

| Role | Username | Password |
| --- | --- | --- |
| Admin | `prakash@nexcart.com` | `prakashpass` |
| Merchant | `merchant@nexcart.com` | `merchantpass` |
| Customer | `customer@nexcart.com` | `customerpass` |


## Project structure

```text
src/
├── app/          # App Router pages and auth API route
├── components/   # Storefront, forms, Admin, Merchant, and shared UI
├── constants/    # App configuration, navigation, and reference data
├── context/      # Auth, cart, and wishlist state
├── hooks/        # Reusable client hooks
├── services/     # Catalog, account, order, and approval operations
└── utils/        # Validation, formatting, storage, and server auth
```


## Screenshots

Screenshots of the NexCart e-commerce application, including the customer storefront, authentication, Admin dashboard, Merchant portal, and responsive layouts.

### 1. Storefront & Product Discovery

**Homepage — Desktop**

![NexCart Desktop Homepage](screenshots/homepage-desktop.png)

**All Products — Catalog & Filters**

![All Products](screenshots/allproducts.png)

**Product Details**

![Product Details](screenshots/product-card.png)

**Top Deals**

![Top Deals](screenshots/deals-page.png)

**Best Sellers**

![Best Sellers](screenshots/bestseller-page.png)

**Recently Viewed Products**

![Recently Viewed Products](screenshots/recently%20viewed.png)

### 2. Customer Shopping Experience

**Shopping Cart**

![Shopping Cart](screenshots/cart.png)

**Checkout & Payment Methods**

![Checkout and Payment Methods](screenshots/payment-method.png)

**Wishlist**

![Customer Wishlist](screenshots/wishlist.png)

### 3. Authentication & Registration

**Customer Login**

![Customer Login](screenshots/customer-loginpage.png)

**Customer Registration**

![Customer Registration](screenshots/customer-registration.png)

**Admin Login**

![Admin Login](screenshots/admin-login.png)

**Merchant Login**

![Merchant Login](screenshots/merchant-login.png)

**Merchant Registration**

![Merchant Registration](screenshots/merchnat-registration.png)

### 4. Admin Portal

**Admin Dashboard & Analytics**

![Admin Dashboard](screenshots/admin-dashboard.png)

**Product Management**

![Admin Product Management](screenshots/admin-product%20management.png)

**Merchant Approvals**

![Admin Merchant Approvals](screenshots/admin-merchnat%20approval.png)

### 5. Merchant Portal

**Merchant Dashboard**

![Merchant Dashboard](screenshots/merchant-dashboard.png)

**Inventory & Restocking**

![Merchant Inventory](screenshots/merchant-inventory.png)

### 6. Responsive Design

**Tablet View — iPad Pro 13**

![Tablet Responsive Layout](screenshots/homepage-ipad.png)

**Mobile View — iPhone 16 Pro Max**

![Mobile Responsive Layout](screenshots/homepage-mobile.png)


## Links

- **Live deployment:** [https://nex-cart-e-commerce-peach.vercel.app](https://nex-cart-e-commerce-peach.vercel.app)
- **GitHub repository:** [https://github.com/chinnamnaidu592/NexCart_E-commerce](https://github.com/chinnamnaidu592/NexCart_E-commerce)

# NexCart — Modern E-Commerce Web Application

NexCart is a production-style e-commerce web application built with the Next.js App Router, React, and handcrafted Tailwind CSS utilities. It features a complete customer purchasing flow, persistent cart and wishlist, real-time catalog search and filtering, and an administrative back-office management console.

---

## 🌟 Feature Overview

### 1. Storefront & Customer Features
- **Hero & Landing Experience**: Modern typography, call-to-action buttons, promotional badges, and social-proof customer trust statistics.
- **Dynamic Category Navigation**: Real-time category pills and collections fetched directly from the API.
- **Comprehensive Product Catalog (`/products`)**:
  - **Debounced Search**: Search across titles, brands, and categories with a 400ms debounce.
  - **Multi-Faceted Filtering**: Filter by category, price range (min/max), and minimum star ratings.
  - **Flexible Sorting**: Sort by featured popularity, price (low-to-high, high-to-low), highest rated, biggest discount, and alphabetical (A-Z, Z-A).
  - **Client-Side Pagination**: 12 items per page with scroll-to-top navigation.
  - **Deep-Linked URL State**: Shareable URLs preserving search, filters, sorting, and pagination (e.g. `/products?category=beauty&sort=price-low&page=2`).
  - **Responsive Mobile Drawer**: Handcrafted slide-over drawer on viewports under 1024px.
- **Product Details (`/products/:id`)**:
  - Multi-angle image gallery with interactive thumbnail selector.
  - Stock status indicator, discount calculation, and rating breakdown.
  - Quantity picker with instant stock limit protection.
  - Add to Shopping Cart and one-click Wishlist bookmarking.
  - Breadcrumb navigation and related category recommendations.
  - 404 Not Found handling for invalid product IDs.
- **Shopping Cart (`/cart`)**:
  - Item listing with quantity increments/decrements (minimum 1, capped at stock).
  - Coupon system supporting promotional discount codes (`SAVE10` for 10% off, `WELCOME20` for 20% off, `FREESHIP` for free delivery).
  - Free shipping progress bar (threshold at $50).
  - Floating-point safe financial calculations rounded to 2 decimal places.
  - Hydration-safe localStorage persistence.
- **Saved Wishlist (`/wishlist`)**:
  - Grid of bookmarked items with one-click "Move to Cart" action.
  - Hydration-safe localStorage persistence.
- **Customer Authentication & Profile**:
  - Client-side form validation backed by server-side demo account checks.
  - Signed, HTTP-only demo sessions with server-validated role selection.
  - User profile updating and order fulfillment history tracking with status badges.
- **Multi-Step Checkout (`/checkout`)**:
  - Validated shipping address form (Name, Email, Phone, Address, City, State, ZIP).
  - Payment method selector: Credit/Debit Card (with conditional validated fields), UPI QR, and Cash on Delivery.
  - Order placement receipt screen with instant cart clearing.

### 2. Admin Back-Office Console (`/admin`)
- **Route Guard Protection**: Automatic redirect with toast notification for non-administrative users.
- **Executive Dashboard (`/admin`)**:
  - 4 metric cards: Total Gross Revenue, Store Orders, Registered Shoppers, and Catalog Products.
  - Weekly Revenue Bar Chart hand-built with pure Tailwind CSS.
  - Recent transactions table with instant status badges.
- **Product Inventory Management (`/admin/products`)**:
  - Searchable, paginated inventory table.
  - Add Product form (`/admin/products/new`) with full validation.
  - Edit Product form (`/admin/products/:id/edit`) with preloaded values.
  - Soft-delete with accessible `ConfirmModal`.
  - Local overlay persistence layer simulating realistic CRUD operations on DummyJSON.
- **Order Management (`/admin/orders`)**:
  - Filter orders by lifecycle status tabs (ALL, Pending, Processing, Shipped, Delivered, Cancelled).
  - Inline order lifecycle state updater with toast confirmation.
- **Customer Database (`/admin/customers`)**:
  - Searchable list of sanitized demo accounts; the directory API requires a signed Admin session.
  - Detailed profile inspection modal with contact information.
- **Product Approvals (`/admin/approvals`)**:
  - Demo moderation queue for product listings.
  - The current queue is sample data; approve/reject actions are not connected to the product catalog.
- **Merchant Approvals (`/admin/merchants`)**:
  - Review the Merchant accounts available to the application, search/filter by status, and record an approval decision.
  - Decisions are saved in this browser's localStorage and are not yet enforced by Merchant login or storefront visibility.

### 3. Merchant Portal (`/merchant`)
- **Merchant Navigation**: Protected portal layout with Dashboard, Products, Inventory, Orders, Cancellation Requests, and Performance routes.
- **Product Ownership Services**: Merchant-created product records carry a stable `merchantId` and `ownershipType: 'merchant'`. `productService` exposes Merchant-scoped listing, creation, update, and deletion operations, with ownership checks for writes.
- **Merchant Order Services**: `orderService` exposes Merchant-scoped order listing/details and status updates. A Merchant sees their own order lines, and supported fulfillment transitions are `Pending → Processing → Shipped → Delivered`.
- **Cancellation Requests**: Merchant cancellation requests are recorded against that Merchant's order lines, require a trimmed reason of 1–500 characters, reject duplicates, and pause that Merchant's fulfillment updates while pending. Admin resolution is represented in the order service.
- **Demo UI Limitations**: The Merchant dashboard, product list, inventory, order list, performance view, and `/merchant/cancellation` queue currently contain illustrative sample data rather than being fully wired to the ownership-aware services. These values are not authoritative business records. The cancellation page's sample approve/reject actions are local UI state and do not resolve real requests or initiate refunds. No Merchant return-case workflow is implemented.

### Demo-only security and persistence

- Login verifies salted PBKDF2 password hashes on the server and issues a signed, `HttpOnly`, `SameSite=Lax` cookie. Set a unique `AUTH_SECRET` of at least 32 characters in Vercel; without it, production authentication fails closed.
- The `/api/auth/users` directory requires a signed Admin session and returns only a limited public account projection. Password hashes and merchant banking, tax, and pickup-address fields are never returned.
- Registration creates a temporary signed session but does not save the account or password. It cannot be used to sign in again after sign-out or session expiry.
- Cart, wishlist, profile preferences, product overlays, orders, and merchant approvals remain browser-local demo data. The Admin/Merchant interfaces do not provide production-grade data authorization or shared persistence. Do not use real customer, payment, or merchant information.
- Checkout simulates order creation only. It does not charge a payment method or send email.

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose |
| :--- | :--- |
| **Next.js App Router** | Application routing, server rendering, and API route handlers |
| **JavaScript (ES6+)** | Core language (Zero TypeScript per project specification) |
| **React** | Component-driven UI framework with custom hooks and context |
| **TailwindCSS** | Hand-crafted modern utility styling (No UI libraries like MUI/shadcn) |
| **Axios** | Centralized API client with friendly error interceptor (`src/services/apiClient.js`) |
| **React Hot Toast** | Toast feedback for user interactions |
| **Lucide React** | Scalable SVG icon set |

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.jsx            # Next.js root HTML layout and metadata
│   ├── providers.jsx         # Client-side providers, Navbar, Footer, Toaster
│   ├── page.jsx              # High-converting storefront Home
│   ├── loading.jsx           # Fallback loading spinner
│   ├── not-found.jsx         # 404 state
│   ├── error.jsx             # Runtime error boundary
│   ├── products/
│   │   ├── page.jsx          # Catalog with filters, search, sort & pagination
│   │   └── [id]/page.jsx     # Detail view with gallery & related products
│   ├── cart/page.jsx         # Cart items & coupon calculations
│   ├── wishlist/page.jsx     # Saved items with move-to-cart
│   ├── login/page.jsx        # Login with demo autofill
│   ├── register/page.jsx     # Registration with field validation
│   ├── profile/page.jsx      # Account details & order history
│   ├── checkout/page.jsx     # Shipping, payment & order receipt
│   ├── merchant/
│   │   ├── layout.jsx          # Merchant route guard and portal shell
│   │   ├── page.jsx            # Merchant dashboard demo
│   │   ├── products/page.jsx   # Merchant product screen
│   │   ├── inventory/page.jsx  # Merchant inventory demo
│   │   ├── orders/page.jsx     # Merchant orders
│   │   ├── cancellation/page.jsx # Illustrative cancellation queue
│   │   └── performance/page.jsx # Illustrative performance figures
│   └── admin/
│       ├── layout.jsx        # Admin route guard & sidebar shell
│       ├── page.jsx          # Dashboard with stats & CSS bar chart
│       ├── products/page.jsx # Products CRUD table
│       ├── products/new/page.jsx # Add product
│       ├── products/[id]/edit/page.jsx # Edit product
│       ├── orders/page.jsx   # Order status workflow
│       ├── customers/page.jsx# Customer list with modal
│       ├── approvals/page.jsx # Sample product approval queue
│       └── merchants/page.jsx # Merchant review queue
├── components/
│   ├── layout/               # Navbar, Footer, MobileMenu, AdminSidebar, AdminTopbar
│   ├── products/             # ProductCard, ProductGrid, Filters, Sort, Search, Pagination, Gallery
│   ├── cart/                 # CartItem, CartSummary, QuantityControl, EmptyCart
│   ├── forms/                # FormField, PasswordField, LoginForm, RegisterForm, ShippingForm, ProductForm
│   ├── admin/                # StatCard, RecentOrdersTable, SalesOverview, ProductsTable, OrdersTable
│   ├── home/                 # Hero, CategoryGrid, FeaturedProducts, PromoBanner, Benefits
│   └── common/               # Button, Input, Select, Modal, ConfirmModal, Loader, Skeleton, EmptyState, ErrorState, Badge, Breadcrumbs
├── services/                 # apiClient.js, productService.js, userService.js, orderService.js, merchantApprovalService.js
├── hooks/                    # useProducts, useProduct, useDebounce, useLocalStorage, useFilters, useCart, useWishlist, useAuth
├── context/                  # CartContext.jsx, WishlistContext.jsx, AuthContext.jsx
├── utils/                    # calculations.js, formatters.js, validators.js, storage.js, productFilters.js
└── constants/                # routes.js, navLinks.js, homeContent.js, orderStatus.js, config.js
```

---

## 🚀 Setup & Local Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nexcart-ecommerce.git
   cd nexcart-ecommerce
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create `.env.local` using `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Set the session-signing secret (required for production) and, optionally, the DummyJSON catalog URL:
   ```env
   AUTH_SECRET=your-unique-random-secret-at-least-32-characters
   NEXT_PUBLIC_API_URL=https://dummyjson.com
   ```
   Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"`. Never use the development fallback secret in production.

4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Run production build & lint checks**:
   ```bash
   npm run build
   npm run lint
   ```

---

## 🔑 Demo Credentials

These built-in accounts are public demo credentials and must only be used with sample data:

| Role | Username / Identifier | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `emilys` *(or `emilys@example.com`)* | `emilyspass` | Full access to `/admin` dashboard, catalog CRUD, orders & customers |
| **Customer** | `michaelw` *(or `michaelw@example.com`)* | `michaelwpass` | Storefront, cart, wishlist, checkout, and personal order history |

---

## 💡 Notes on Simulated API Writes (DummyJSON Overlay)

DummyJSON is a mock REST API that returns simulated 200 responses for `POST /products/add`, `PUT /products/:id`, and `DELETE /products/:id` without persisting updates on their server.
To deliver a realistic evaluation experience across page reloads:
- `src/services/productService.js` incorporates a transparent localStorage overlay layer (`added`, `updated`, and `deleted` sets).
- Added products, modified prices/titles, and deleted products persist reliably within the browser session without altering external backends.
- Merchant-owned products are kept separate from external DummyJSON catalog records. Ownership-aware service methods use the authenticated Merchant's stable user ID and reject cross-Merchant edits/deletes.
- Merchant-owned order views are derived from locally placed checkout orders and their Merchant-specific line snapshots. External mock order records are not assigned to a Merchant.
- Merchant approval decisions use the browser-local key `nexcart_merchant_approval_statuses`. Accounts without a saved decision are displayed as pending; this demo workflow does not currently block sign-in or product operations.
- Browser localStorage is demo persistence, not a secure authorization boundary. The ownership checks are client-side and are not a substitute for server-side authorization.

---

## 📱 Responsive & Accessibility Standards

- Tested across standard breakpoints: **375px** (Mobile), **768px** (Tablet), **1024px** (Laptop), and **1440px** (Desktop).
- Semantic HTML tags used throughout (`header`, `nav`, `main`, `section`, `footer`, `table`).
- All inputs have explicit `<label>` tags, `aria-invalid`, and `aria-describedby` links.
- Modals include backdrop dismissal, keyboard Escape listening, and focus trap constraints.
- Buttons feature visible `:focus-visible:ring-2` outline rings for keyboard accessibility.

---

## 📸 Screenshots

| Viewport | Preview |
| :--- | :--- |
| **Desktop (1440px)** | *[Screenshot Placeholder: Storefront Home & Catalog]* |
| **Mobile (375px)** | *[Screenshot Placeholder: Mobile Navigation & Filter Drawer]* |
| **Admin Dashboard** | *[Screenshot Placeholder: Analytics & Orders Fulfillment]* |

---

## 🌐 Live Deployment & Repository

- **Live Deployment URL**: `https://ais-dev-dvhyfw5tzzs37fqomzabac-338339969214.asia-southeast1.run.app`
- **GitHub Repository**: `https://github.com/aideas-student/nexcart-frontend`

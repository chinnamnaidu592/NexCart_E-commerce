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
  - Custom client-side validation on blur and submit (email regex, strong password rules).
  - Demo account quick autofill buttons for evaluation convenience.
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
  - Searchable list of registered shoppers and API users.
  - Detailed profile inspection modal with contact information.

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
│   └── admin/
│       ├── layout.jsx        # Admin route guard & sidebar shell
│       ├── page.jsx          # Dashboard with stats & CSS bar chart
│       ├── products/page.jsx # Products CRUD table
│       ├── products/new/page.jsx # Add product
│       ├── products/[id]/edit/page.jsx # Edit product
│       ├── orders/page.jsx   # Order status workflow
│       └── customers/page.jsx# Customer list with modal
├── components/
│   ├── layout/               # Navbar, Footer, MobileMenu, AdminSidebar, AdminTopbar
│   ├── products/             # ProductCard, ProductGrid, Filters, Sort, Search, Pagination, Gallery
│   ├── cart/                 # CartItem, CartSummary, QuantityControl, EmptyCart
│   ├── forms/                # FormField, PasswordField, LoginForm, RegisterForm, ShippingForm, ProductForm
│   ├── admin/                # StatCard, RecentOrdersTable, SalesOverview, ProductsTable, OrdersTable
│   ├── home/                 # Hero, CategoryGrid, FeaturedProducts, PromoBanner, Benefits
│   └── common/               # Button, Input, Select, Modal, ConfirmModal, Loader, Skeleton, EmptyState, ErrorState, Badge, Breadcrumbs
├── services/                 # apiClient.js, productService.js, userService.js, orderService.js
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
   Set the DummyJSON API base URL:
   ```env
   NEXT_PUBLIC_API_URL=https://dummyjson.com
   ```

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

To test customer and administrative features, use the credentials below (or click the quick-fill buttons on the `/login` screen):

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

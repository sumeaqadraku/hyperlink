# Telecom Services Web App

Modern React frontend for the Telecom Services management platform.

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📁 Project Structure

```
src/
├── components/
│   └── ui/              # Reusable UI components (Button, Card, Badge, Table)
├── layouts/
│   ├── PublicLayout.tsx     # Layout for public pages
│   └── DashboardLayout.tsx  # Layout for dashboard pages
├── pages/
│   ├── public/          # Public-facing pages
│   │   ├── HomePage.tsx
│   │   ├── OffersPage.tsx
│   │   └── OfferDetailsPage.tsx
│   └── dashboard/       # Dashboard pages
│       ├── DashboardOverview.tsx
│       ├── CatalogManagement.tsx
│       ├── SubscriptionsPage.tsx
│       ├── BillingPage.tsx
│       ├── InvoiceDetailsPage.tsx
│       └── UsagePage.tsx
├── services/            # API service layer
│   ├── api.ts
│   ├── catalogService.ts
│   ├── subscriptionService.ts
│   ├── billingService.ts
│   └── usageService.ts
├── lib/
│   └── utils.ts        # Utility functions
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Installation

```bash
cd src/web
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🔗 API Integration

The frontend connects to the backend API Gateway at `http://localhost:5000/api` by default.

Update the API URL in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📄 Pages Overview

### Public Pages (Website-style)

- **Home Page** (`/`)
  - Hero section with telecom service highlight
  - Service cards (Internet, Mobile, TV)
  - Pricing teaser
  - CTA sections

- **Offers Page** (`/offers`)
  - List of all telecom offers from Catalog service
  - Filter by service type (Internet, Mobile, TV)
  - Offer cards with pricing and features

- **Offer Details** (`/offers/:id`)
  - Detailed information about a specific offer
  - Features list
  - Subscription CTA

### Dashboard Pages (Application-style)

- **Dashboard Overview** (`/dashboard`)
  - Stats cards: Active subscriptions, balance, invoices, usage
  - Active services summary
  - Recent invoices

- **Catalog Management** (`/dashboard/catalog`)
  - List and manage offers (admin)
  - Create/edit/delete offers
  - Tariff plans table

- **Subscriptions** (`/dashboard/subscriptions`)
  - List of active subscriptions
  - Subscription cards with status badges
  - Actions: Suspend, Resume, Cancel

- **Billing** (`/dashboard/billing`)
  - Current balance card
  - Invoices table
  - Payment history

- **Invoice Details** (`/dashboard/billing/invoice/:id`)
  - Invoice items table
  - Subtotal, tax, and total calculations
  - Customer information
  - Download/Print options

- **Usage** (`/dashboard/usage`)
  - Usage summary cards (Data, Calls, SMS)
  - Progress bars for current month
  - Usage history table

## 🎨 Design System

### Colors

- **Primary (Red)**: `#DC2626` - Brand color for CTAs and highlights
- **Background**: `#FFFFFF` - Clean white background
- **Gray Scale**: Used for text and borders

### Components

All UI components are built with **shadcn/ui** and are fully customizable:

- `Button` - Multiple variants (default, outline, ghost, secondary)
- `Card` - Container component with header, content, footer
- `Badge` - Status indicators
- `Table` - Data tables with sorting support

### Typography

- Headings: Bold, modern sans-serif
- Body: Regular weight for readability
- Consistent spacing using Tailwind utilities

## 🔐 Authentication

The app includes authentication setup:
- Token stored in `localStorage`
- Auto-redirect on 401 responses
- Protected routes (to be implemented)

## 📊 API Services

### Catalog Service
- `getOffers()` - Get all offers
- `getOfferById(id)` - Get single offer
- `createOffer()` - Create new offer
- `updateOffer()` - Update existing offer
- `deleteOffer()` - Delete offer

### Subscription Service
- `getSubscriptions()` - Get all subscriptions
- `getSubscriptionById(id)` - Get single subscription
- `createSubscription()` - Create subscription
- `updateSubscriptionStatus()` - Update status

### Billing Service
- `getInvoices()` - Get all invoices
- `getInvoiceById(id)` - Get single invoice
- `getPayments()` - Get payment history
- `getBalance()` - Get current balance

### Usage Service
- `getUsageRecords()` - Get usage records
- `getUsageSummary()` - Get monthly summary

## 🛠️ Development Guidelines

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Import required services from `src/services/`

### Creating New Components

1. Add component to `src/components/ui/`
2. Use TypeScript for props
3. Follow existing component patterns

### API Integration

1. Define interfaces in service files
2. Use axios instance from `src/services/api.ts`
3. Handle errors appropriately
4. Provide mock data fallbacks for development

## 📦 Dependencies

### Core
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `axios` - HTTP client

### UI & Styling
- `tailwindcss` - Utility CSS
- `lucide-react` - Icons
- `clsx` & `tailwind-merge` - Class name utilities

### Forms & Validation
- `react-hook-form` - Form handling
- `zod` - Schema validation
- `@hookform/resolvers` - Form validation

### Charts
- `recharts` - Data visualization

### Utilities
- `date-fns` - Date formatting

## 📱 Responsive Design

The app is fully responsive:
- **Mobile**: Stacked layouts, hamburger menu
- **Tablet**: Grid layouts with 2 columns
- **Desktop**: Full sidebar navigation, 3-4 column grids

## 🧪 Testing

```bash
npm run lint
```

## 📝 License

MIT

# Frontend Component Mapping

This document maps each page to its React components and the backend services it consumes.

## 🧩 Page → Component → API Mapping

### Public Pages

#### 1. Home Page (`/`)
**Component**: `HomePage.tsx`
**Layout**: `PublicLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button`
- `Badge`

**Backend APIs**: None (static content)

**Features**:
- Hero section with telecom services
- Service cards (Internet, Mobile, TV)
- Pricing teaser
- CTA sections

---

#### 2. Offers Page (`/offers`)
**Component**: `OffersPage.tsx`
**Layout**: `PublicLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`
- `Button`
- `Badge`

**Backend APIs**:
- `GET /api/catalog/offers` - catalogService.getOffers()
- `GET /api/catalog/offers?serviceType={type}` - Filter by service type

**Features**:
- Display all telecom offers
- Filter by service type (Internet, Mobile, TV)
- Show price, features, speed/data info
- Subscribe and view details buttons

---

#### 3. Offer Details Page (`/offers/:id`)
**Component**: `OfferDetailsPage.tsx`
**Layout**: `PublicLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button`

**Backend APIs**:
- `GET /api/catalog/offers/{id}` - catalogService.getOfferById()

**Features**:
- Full offer details
- Feature list with checkmarks
- Service details (speed, installation, contract)
- Sticky subscription card

---

### Dashboard Pages

#### 4. Dashboard Overview (`/dashboard`)
**Component**: `DashboardOverview.tsx`
**Layout**: `DashboardLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- Stats display

**Backend APIs**:
- `GET /api/provisioning/subscriptions` - subscriptionService.getSubscriptions()
- `GET /api/billing/balance` - billingService.getBalance()
- `GET /api/billing/invoices` - billingService.getInvoices()
- `GET /api/provisioning/usage/summary` - usageService.getUsageSummary()

**Features**:
- 4 stat cards (subscriptions, balance, invoices, usage)
- Active services list
- Recent invoices list

---

#### 5. Catalog Management (`/dashboard/catalog`)
**Component**: `CatalogManagement.tsx`
**Layout**: `DashboardLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`
- `Button`
- `Badge`

**Backend APIs**:
- `GET /api/catalog/offers` - catalogService.getOffers()
- `POST /api/catalog/offers` - catalogService.createOffer()
- `PUT /api/catalog/offers/{id}` - catalogService.updateOffer()
- `DELETE /api/catalog/offers/{id}` - catalogService.deleteOffer()

**Features**:
- Offers table with CRUD operations
- Service type badges
- Edit and delete actions
- Create new offer button
- Tariff plans section (placeholder)

---

#### 6. Subscriptions Page (`/dashboard/subscriptions`)
**Component**: `SubscriptionsPage.tsx`
**Layout**: `DashboardLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Button`
- `Badge`

**Backend APIs**:
- `GET /api/provisioning/subscriptions` - subscriptionService.getSubscriptions()
- `GET /api/provisioning/subscriptions/{id}` - subscriptionService.getSubscriptionById()
- `PATCH /api/provisioning/subscriptions/{id}/status` - subscriptionService.updateSubscriptionStatus()

**Features**:
- Subscription cards grid
- Status badges (Active, Suspended, Cancelled)
- Subscription actions (Suspend, Resume, Cancel)
- Monthly price display
- Start and end dates

---

#### 7. Billing Page (`/dashboard/billing`)
**Component**: `BillingPage.tsx`
**Layout**: `DashboardLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`
- `Button`
- `Badge`

**Backend APIs**:
- `GET /api/billing/invoices` - billingService.getInvoices()
- `GET /api/billing/payments` - billingService.getPayments()
- `GET /api/billing/balance` - billingService.getBalance()

**Features**:
- Current balance card with Pay Now button
- Invoices table (invoice number, dates, amount, status)
- Payment history table
- View invoice details link
- Download invoice button

---

#### 8. Invoice Details Page (`/dashboard/billing/invoice/:id`)
**Component**: `InvoiceDetailsPage.tsx`
**Layout**: `DashboardLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`
- `Button`
- `Badge`

**Backend APIs**:
- `GET /api/billing/invoices/{id}` - billingService.getInvoiceById()

**Features**:
- Invoice items table
- Subtotal, tax, and total calculations
- Invoice information card (dates, status)
- Customer information card
- Print and download buttons
- Pay invoice button (if pending)

---

#### 9. Usage Page (`/dashboard/usage`)
**Component**: `UsagePage.tsx`
**Layout**: `DashboardLayout.tsx`
**UI Components**:
- `Card`, `CardHeader`, `CardTitle`, `CardContent`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, `TableHead`
- `Badge`
- Progress bars

**Backend APIs**:
- `GET /api/provisioning/usage` - usageService.getUsageRecords()
- `GET /api/provisioning/usage/summary` - usageService.getUsageSummary()

**Features**:
- 3 usage summary cards (Data, Calls, SMS)
- Progress bars showing monthly usage
- Usage history table
- Type badges (Data, Call, SMS)
- Icons for each usage type

---

## 🎨 Shared UI Components

### Button
**Used in**: All pages
**Variants**: default, outline, ghost, secondary, destructive, link
**Sizes**: sm, default, lg, icon

### Card System
**Components**: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
**Used in**: All pages for content containers

### Badge
**Used in**: Offers, Catalog, Subscriptions, Billing, Usage
**Variants**: default, secondary, destructive, outline, success
**Purpose**: Status indicators, service types

### Table System
**Components**: Table, TableHeader, TableBody, TableRow, TableCell, TableHead
**Used in**: Catalog, Billing, Invoice Details, Usage
**Purpose**: Data display with sorting

---

## 🔄 Data Flow

### Frontend → Backend

```
User Action
    ↓
React Component
    ↓
Service Layer (catalogService, billingService, etc.)
    ↓
API Client (axios with interceptors)
    ↓
API Gateway (localhost:5000)
    ↓
Microservice (Catalog, Billing, Provisioning, Customer)
```

### Backend → Frontend

```
Microservice Response
    ↓
API Gateway
    ↓
API Client (with error handling)
    ↓
Service Layer (type-safe interfaces)
    ↓
React Component (state update)
    ↓
UI Update
```

---

## 📊 State Management

Currently using:
- **React useState** - Local component state
- **useEffect** - Data fetching and side effects
- **No global state library** - Can add Redux/Zustand if needed

Future considerations:
- Add React Query for server state management
- Add Zustand for global client state
- Implement caching strategies

---

## 🛠️ Service Layer Architecture

Each backend microservice has a corresponding frontend service:

- **catalogService.ts** → Catalog API
- **subscriptionService.ts** → Provisioning API
- **billingService.ts** → Billing API
- **usageService.ts** → Provisioning API (usage endpoints)

All services use:
- Type-safe interfaces
- Centralized axios instance
- Error handling
- Mock data fallbacks for development

---

## 🎯 Next Steps for Full Integration

1. **Authentication**
   - Implement login/register pages
   - Add JWT token management
   - Protect dashboard routes

2. **Real-time Updates**
   - Add WebSocket support for usage updates
   - Real-time billing notifications

3. **Advanced Features**
   - Payment processing integration
   - Invoice PDF generation
   - Usage charts and analytics
   - Service activation workflows

4. **Testing**
   - Unit tests for components
   - Integration tests for API calls
   - E2E tests with Playwright

5. **Performance**
   - Implement React Query for caching
   - Add lazy loading for routes
   - Optimize bundle size

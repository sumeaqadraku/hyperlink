import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PublicLayout } from './layouts/PublicLayout'
import { DashboardLayout } from './layouts/DashboardLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import OffersPage from './pages/public/OffersPage'
import OfferDetailsPage from './pages/public/OfferDetailsPage'
import Offers from './pages/Offers'
import OfferDetails from './pages/OfferDetails'
import SubscriptionSuccess from './pages/SubscriptionSuccess'
import SubscriptionCancel from './pages/SubscriptionCancel'
import ProfilePage from './pages/ProfilePage'
import MyProfile from './pages/profile/MyProfile'
import MySubscriptions from './pages/profile/MySubscriptions'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview'
import CatalogManagement from './pages/dashboard/CatalogManagement'
import OfferDetailsManagement from './pages/dashboard/OfferDetailsManagement'
import ServiceTypeManagement from './pages/dashboard/ServiceTypeManagement'
import SubscriptionsPage from './pages/dashboard/SubscriptionsPage'
import SubscriptionManagement from './pages/dashboard/SubscriptionManagement'
import CustomerManagement from './pages/dashboard/CustomerManagement'
import UserManagement from './pages/dashboard/UserManagement'
import BillingPage from './pages/dashboard/BillingPage'
import InvoiceDetailsPage from './pages/dashboard/InvoiceDetailsPage'
import InvoiceManagement from './pages/dashboard/InvoiceManagement'
import UsagePage from './pages/dashboard/UsagePage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes (Standalone - no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Stripe Success/Cancel Pages (Standalone) */}
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          <Route path="/subscription-cancel" element={<SubscriptionCancel />} />

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="offers-old" element={<OffersPage />} />
            <Route path="offers-old/:id" element={<OfferDetailsPage />} />
            <Route path="offers" element={<Offers />} />
            <Route path="offers/:id" element={<OfferDetails />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/my" element={<MyProfile />} />
            <Route path="profile/subscriptions" element={<MySubscriptions />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="catalog" element={<CatalogManagement />} />
            <Route path="service-types" element={<ServiceTypeManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="offer-details" element={<OfferDetailsManagement />} />
            <Route path="subscriptions-old" element={<SubscriptionsPage />} />
            <Route path="subscriptions" element={<SubscriptionManagement />} />
            <Route path="invoices" element={<InvoiceManagement />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="billing/invoice/:id" element={<InvoiceDetailsPage />} />
            <Route path="usage" element={<UsagePage />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

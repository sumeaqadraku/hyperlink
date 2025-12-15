import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PublicLayout } from './layouts/PublicLayout'
import { DashboardLayout } from './layouts/DashboardLayout'

// Public Pages
import HomePage from './pages/public/HomePage'
import OffersPage from './pages/public/OffersPage'
import OfferDetailsPage from './pages/public/OfferDetailsPage'
import ProfilePage from './pages/ProfilePage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview'
import CatalogManagement from './pages/dashboard/CatalogManagement'
import SubscriptionsPage from './pages/dashboard/SubscriptionsPage'
import BillingPage from './pages/dashboard/BillingPage'
import InvoiceDetailsPage from './pages/dashboard/InvoiceDetailsPage'
import UsagePage from './pages/dashboard/UsagePage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes (Standalone - no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="offers/:id" element={<OfferDetailsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="catalog" element={<CatalogManagement />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="billing/invoice/:id" element={<InvoiceDetailsPage />} />
            <Route path="usage" element={<UsagePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

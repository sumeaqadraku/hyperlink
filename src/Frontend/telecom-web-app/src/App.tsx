import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import BillingPage from './pages/BillingPage'
import ProvisioningPage from './pages/ProvisioningPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

const queryClient = new QueryClient()

function Navigation() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="container">
        <h1>Telecom Services</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/customers">Customers</Link></li>
          <li><Link to="/billing">Billing</Link></li>
          <li><Link to="/provisioning">Provisioning</Link></li>
          {isAuthenticated ? (
            <>
              <li style={{ marginLeft: 'auto' }}>Welcome, {user?.email}</li>
              <li><button onClick={logout} style={{ cursor: 'pointer' }}>Logout</button></li>
            </>
          ) : (
            <>
              <li style={{ marginLeft: 'auto' }}><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navigation />

            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/billing" element={<BillingPage />} />
                <Route path="/provisioning" element={<ProvisioningPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App

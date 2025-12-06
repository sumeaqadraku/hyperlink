import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import CustomersPage from './pages/CustomersPage'
import BillingPage from './pages/BillingPage'
import ProvisioningPage from './pages/ProvisioningPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <nav className="navbar">
            <div className="container">
              <h1>Telecom Services</h1>
              <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/customers">Customers</Link></li>
                <li><Link to="/billing">Billing</Link></li>
                <li><Link to="/provisioning">Provisioning</Link></li>
              </ul>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/provisioning" element={<ProvisioningPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App

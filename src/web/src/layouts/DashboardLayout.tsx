import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Activity,
  Menu,
  Bell,
  Phone,
  Repeat,
  FileText,
  Users,
  UserCog,
  Layers,
  Smartphone,
  CreditCard as SimCardIcon,
  ClipboardList,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserProfileDropdown } from '@/components/ui/UserProfileDropdown'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Catalog', href: '/dashboard/catalog', icon: Package },
  { name: 'Service Types', href: '/dashboard/service-types', icon: Layers, adminOnly: true },
  { name: 'Users', href: '/dashboard/users', icon: UserCog, adminOnly: true },
  { name: 'Customers', href: '/dashboard/customers', icon: Users, adminOnly: true },
  { name: 'Offer Details', href: '/dashboard/offer-details', icon: FileText },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: Repeat },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Usage', href: '/dashboard/usage', icon: Activity },
  { name: 'Devices', href: '/dashboard/devices', icon: Smartphone },
  { name: 'SIM Cards', href: '/dashboard/sim-cards', icon: SimCardIcon },
  { name: 'Provisioning', href: '/dashboard/provisioning', icon: ClipboardList },
]

export function DashboardLayout() {
  const location = useLocation()
  const { user, isLoggedIn } = useAuth()

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Redirect non-admin users to home page
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-card border-b border-border sticky top-0 z-40 ml-64">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/dashboard" className="flex items-center space-x-3">
              <Phone className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold text-foreground">CoreWave</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserProfileDropdown 
              userName={user?.name || 'User'}
              userRole={user?.role || 'Member'}
              isAdmin={user?.isAdmin || false}
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-brand-dark text-white z-50">
          <div className="flex h-16 items-center justify-center border-b border-brand-medium">
            <Phone className="h-8 w-8 text-brand-medium mr-2" />
            <span className="text-xl font-bold">CoreWave</span>
          </div>

          <nav className="p-4 space-y-2">
            {navigation
              .filter(item => !item.adminOnly || user?.isAdmin)
              .map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-brand-medium text-white'
                    : 'text-gray-300 hover:bg-brand-medium/50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

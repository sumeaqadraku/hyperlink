import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Activity,
  Menu,
  Bell,
  Phone,
  Repeat,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserProfileDropdown } from '@/components/ui/UserProfileDropdown'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Catalog', href: '/dashboard/catalog', icon: Package },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: Repeat },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Usage', href: '/dashboard/usage', icon: Activity },
]

export function DashboardLayout() {
  const location = useLocation()

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
              userName="Admin User"
              userRole="Administrator"
              isAdmin={true}
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
            {navigation.map((item) => (
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

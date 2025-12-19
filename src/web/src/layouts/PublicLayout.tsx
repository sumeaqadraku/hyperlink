import { Outlet, Link } from 'react-router-dom'
import { Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UserProfileDropdown } from '@/components/ui/UserProfileDropdown'
import { useAuth } from '@/contexts/AuthContext'

export function PublicLayout() {
  const { isLoggedIn, user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <Phone className="h-8 w-8 text-secondary" />
              <span className="text-xl font-bold text-foreground">CoreWave</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/offers" className="text-muted-foreground hover:text-foreground transition-colors">
                Plans & Offers
              </Link>
              {isLoggedIn && (
                <Link to="/profile/my" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Profile
                </Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <UserProfileDropdown 
                  userName={user?.name || 'User'}
                  userRole={user?.role || 'Member'}
                  isAdmin={user?.isAdmin || false}
                />
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="h-6 w-6 text-secondary" />
                <h3 className="font-semibold text-foreground">CoreWave</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Your complete telecom solution for internet, mobile, and TV services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Internet</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Mobile</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">TV & Streaming</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>1-800-TELECOM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@telecom.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CoreWave. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

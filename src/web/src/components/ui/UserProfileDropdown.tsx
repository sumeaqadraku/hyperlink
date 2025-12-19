import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  CreditCard,
  Activity,
  Settings,
  LogOut,
  Repeat,
  Shield,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfileDropdownProps {
  userName?: string
  userRole?: string
  isAdmin?: boolean
  className?: string
}

export function UserProfileDropdown({
  userName = 'John Doe',
  userRole = 'Premium Member',
  isAdmin = false,
  className,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { logout } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    {
      icon: User,
      label: 'My Profile',
      href: '/profile/my',
      show: true,
    },
    {
      icon: Repeat,
      label: 'My Subscriptions',
      href: '/profile/subscriptions',
      show: true,
    },
  ]

  const adminMenuItem = {
    icon: Shield,
    label: 'Admin Dashboard',
    href: '/dashboard',
    show: isAdmin,
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="relative">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
            {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-card"></div>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-foreground">{userName}</p>
          <p className="text-xs text-muted-foreground">{userRole}</p>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground transition-transform hidden md:block',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-lg">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Admin Dashboard (if admin) */}
          {adminMenuItem.show && (
            <>
              <div className="py-1">
                <Link
                  to={adminMenuItem.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-primary hover:bg-secondary/10 transition-colors group"
                >
                  <adminMenuItem.icon className="h-4 w-4 mr-3 text-primary" />
                  <span className="font-medium">{adminMenuItem.label}</span>
                </Link>
              </div>
              <div className="border-t border-border my-1"></div>
            </>
          )}

          {/* Regular Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              item.show && (
                <Link
                  key={index}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors group"
                >
                  <item.icon className="h-4 w-4 mr-3 text-muted-foreground group-hover:text-secondary" />
                  <span>{item.label}</span>
                </Link>
              )
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors group"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

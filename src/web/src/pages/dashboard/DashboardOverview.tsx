import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DollarSign, Users, FileText, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    activeSubscriptions: 3,
    currentBalance: 0,
    unpaidInvoices: 1,
    monthlyUsage: 85,
  })

  useEffect(() => {
    // Load dashboard data from API
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Mock data for demo
    setStats({
      activeSubscriptions: 3,
      currentBalance: 0,
      unpaidInvoices: 1,
      monthlyUsage: 85,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your account overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Services currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.currentBalance)}</div>
            <p className="text-xs text-muted-foreground">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unpaidInvoices}</div>
            <p className="text-xs text-muted-foreground">Invoices pending payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyUsage}%</div>
            <p className="text-xs text-muted-foreground">Of allocated resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Internet Pro</p>
                  <p className="text-sm text-gray-600">500 Mbps Fiber</p>
                </div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mobile Essential</p>
                  <p className="text-sm text-gray-600">10GB Data Plan</p>
                </div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">TV Premium</p>
                  <p className="text-sm text-gray-600">200+ Channels</p>
                </div>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #1234</p>
                  <p className="text-sm text-gray-600">Due: Dec 31, 2024</p>
                </div>
                <span className="font-medium text-red-600">{formatCurrency(149.97)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #1233</p>
                  <p className="text-sm text-gray-600">Paid: Nov 30, 2024</p>
                </div>
                <span className="font-medium text-gray-600">{formatCurrency(149.97)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice #1232</p>
                  <p className="text-sm text-gray-600">Paid: Oct 31, 2024</p>
                </div>
                <span className="font-medium text-gray-600">{formatCurrency(149.97)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

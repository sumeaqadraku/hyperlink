import { useState, useEffect } from 'react'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { subscriptionService, SubscriptionDto } from '@/services/subscriptionService'

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDto[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = subscriptions.filter(sub =>
        sub.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.subscriptionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSubscriptions(filtered)
    } else {
      setFilteredSubscriptions(subscriptions)
    }
  }, [searchTerm, subscriptions])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await subscriptionService.getAll()
      setSubscriptions(data)
      setFilteredSubscriptions(data)
    } catch (err: any) {
      console.error('Error fetching subscriptions:', err)
      setError('Failed to load subscriptions. Make sure you have admin privileges.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'suspended':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
        <p className="text-gray-600">View and manage customer subscriptions</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <Card className="mb-6 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer email, product name, or subscription number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stripe Info
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subscription.subscriptionNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subscription.customerName || subscription.customerEmail || `Customer #${subscription.customerId.substring(0, 8)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{subscription.productName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €{subscription.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : 'Not started'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      {subscription.stripeCustomerId && (
                        <div className="text-xs">Customer: {subscription.stripeCustomerId.substring(0, 20)}...</div>
                      )}
                      {subscription.stripeSubscriptionId && (
                        <div className="text-xs">Sub: {subscription.stripeSubscriptionId.substring(0, 20)}...</div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? 'No subscriptions found matching your search.' : 'No subscriptions yet.'}
            </div>
          )}
        </div>
      </Card>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
      </div>
    </div>
  )
}

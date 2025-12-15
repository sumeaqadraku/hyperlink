import { useState, useEffect } from 'react'
import { subscriptionService, Subscription } from '@/services/subscriptionService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Pause, Play, XCircle } from 'lucide-react'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await subscriptionService.getSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
      // Use mock data for demo
      setSubscriptions(getMockSubscriptions())
    } finally {
      setLoading(false)
    }
  }

  const getMockSubscriptions = (): Subscription[] => [
    {
      id: '1',
      customerId: 'cust-1',
      offerId: '2',
      offerName: 'Internet Pro',
      status: 'Active',
      startDate: '2024-01-15T00:00:00Z',
      monthlyPrice: 59.99,
    },
    {
      id: '2',
      customerId: 'cust-1',
      offerId: '3',
      offerName: 'Mobile Essential',
      status: 'Active',
      startDate: '2024-01-15T00:00:00Z',
      monthlyPrice: 29.99,
    },
    {
      id: '3',
      customerId: 'cust-1',
      offerId: '4',
      offerName: 'TV Premium',
      status: 'Active',
      startDate: '2024-02-01T00:00:00Z',
      monthlyPrice: 49.99,
    },
  ]

  const getStatusBadge = (status: Subscription['status']) => {
    const variants: { [key: string]: 'success' | 'secondary' | 'destructive' } = {
      Active: 'success',
      Suspended: 'secondary',
      Cancelled: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const handleStatusChange = async (id: string, newStatus: Subscription['status']) => {
    try {
      await subscriptionService.updateSubscriptionStatus(id, newStatus)
      loadSubscriptions()
    } catch (error) {
      console.error('Failed to update subscription status:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
        <p className="text-gray-600">Manage your active subscriptions and services</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-600">Loading subscriptions...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{subscription.offerName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Since {formatDate(subscription.startDate)}
                    </p>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(subscription.monthlyPrice)}
                    </div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>

                  {subscription.endDate && (
                    <div className="text-sm">
                      <span className="text-gray-600">End Date: </span>
                      <span className="font-medium">{formatDate(subscription.endDate)}</span>
                    </div>
                  )}

                  <div className="pt-4 flex flex-col gap-2">
                    {subscription.status === 'Active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleStatusChange(subscription.id, 'Suspended')}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Suspend Service
                      </Button>
                    )}
                    {subscription.status === 'Suspended' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleStatusChange(subscription.id, 'Active')}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Resume Service
                      </Button>
                    )}
                    {subscription.status !== 'Cancelled' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        onClick={() => handleStatusChange(subscription.id, 'Cancelled')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && subscriptions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">You don't have any active subscriptions</p>
            <Button>Browse Available Plans</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

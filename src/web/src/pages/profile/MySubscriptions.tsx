import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { customerService } from '@/services/customerService'
import { subscriptionService } from '@/services/subscriptionService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Package, Calendar, CreditCard } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function MySubscriptions() {
  const { user } = useAuth()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => customerService.getMyProfile(),
    enabled: !!user,
  })

  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useQuery({
    queryKey: ['mySubscriptions', profile?.id],
    queryFn: () => subscriptionService.getByCustomerId(profile!.id),
    enabled: !!profile?.id,
  })

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your subscriptions.</p>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (profileLoading || subscriptionsLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            My Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">You don't have any subscriptions yet.</p>
              <Link to="/offers">
                <Button className="bg-secondary hover:bg-secondary/90">
                  Browse Offers
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold text-lg">{sub.productName || 'Subscription'}</div>
                      <div className="text-sm text-gray-500">#{sub.subscriptionNumber}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {formatCurrency(sub.price)}/month
                        </span>
                        {sub.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Started {new Date(sub.startDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={sub.status === 'Active' ? 'default' : 'secondary'}
                      className={sub.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {sub.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

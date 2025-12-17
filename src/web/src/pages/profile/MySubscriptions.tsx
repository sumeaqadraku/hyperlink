import { useMemo, useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { customerService } from '@/services/customerService'
import { accountService } from '@/services/accountService'
import { customerSubscriptionsService } from '@/services/customerSubscriptionsService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export default function MySubscriptions() {
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => customerService.getMyProfile(),
  })

  const customerId = profile?.id

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts', customerId],
    queryFn: () => accountService.getByCustomerId(customerId!),
    enabled: !!customerId,
  })

  const subscriptionQueries = useQueries({
    queries: (accounts || []).map((a) => ({
      queryKey: ['subscriptions', a.id],
      queryFn: () => customerSubscriptionsService.getByAccount(a.id),
      enabled: !!a.id,
    })),
  })

  const subscriptions = useMemo(() => {
    return subscriptionQueries.flatMap((q) => q.data || [])
  }, [subscriptionQueries])

  if (profileLoading || accountsLoading) return <div className="p-6">Loading...</div>
  if (profileError) return <div className="p-6 text-red-600">Please sign in to view subscriptions.</div>

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Accounts ({accounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-gray-500">You have no accounts yet.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {accounts.map((a) => (
                <div key={a.id} className="border rounded p-4">
                  <div className="font-semibold">Account #{a.accountNumber}</div>
                  <div className="text-sm text-gray-600 mt-1">Type: {a.type} • Balance: {a.balance.toFixed(2)}</div>
                  <div className="mt-2">
                    <Badge variant={a.isActive ? 'default' : 'secondary'}>
                      {a.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Subscriptions ({subscriptions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptions.length === 0 ? (
            <div className="text-gray-500">You have no subscriptions yet.</div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((s) => (
                <div key={s.id} className="border rounded p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{s.subscriptionNumber}</div>
                      <div className="text-sm text-gray-600">Product: {s.productId}</div>
                      <div className="text-sm text-gray-600">Start: {new Date(s.startDate).toLocaleDateString()}</div>
                    </div>
                    <Badge variant={s.status === 'Active' ? 'default' : 'secondary'}>{s.status}</Badge>
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

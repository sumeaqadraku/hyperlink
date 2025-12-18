import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import axios from 'axios'

export default function SubscriptionSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [confirming, setConfirming] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    confirmSubscription()
  }, [])

  const confirmSubscription = async () => {
    try {
      const sessionId = searchParams.get('session_id')
      const subscriptionId = searchParams.get('subscription_id')

      if (!sessionId || !subscriptionId) {
        setError('Missing session or subscription ID')
        setConfirming(false)
        return
      }

      // Confirm subscription with backend
      await axios.post(
        `/api/customer/subscriptions/${subscriptionId}/confirm`,
        { sessionId },
        { withCredentials: true }
      )

      setConfirming(false)
    } catch (err: any) {
      console.error('Error confirming subscription:', err)
      setError('Failed to confirm subscription')
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Confirming your subscription...</h2>
          <p className="text-gray-600">Please wait while we process your payment</p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Confirmation Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Thank you for subscribing! Your payment has been processed successfully.
          An invoice has been created and your subscription is now active.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/dashboard/subscriptions')}
            className="w-full"
          >
            View My Subscriptions
          </Button>
          <Button
            onClick={() => navigate('/dashboard/invoices')}
            variant="outline"
            className="w-full"
          >
            View Invoices
          </Button>
          <Button
            onClick={() => navigate('/offers')}
            variant="outline"
            className="w-full"
          >
            Browse More Offers
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Your subscription is now active and will be billed monthly.
        </p>
      </Card>
    </div>
  )
}

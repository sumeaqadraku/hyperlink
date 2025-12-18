import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { XCircle } from 'lucide-react'

export default function SubscriptionCancel() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <XCircle className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription Cancelled
        </h1>

        <p className="text-gray-600 mb-8">
          Your subscription process was cancelled. No charges have been made to your account.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/offers')}
            className="w-full"
          >
            Browse Offers Again
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          If you have any questions, please contact our support team.
        </p>
      </Card>
    </div>
  )
}

import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

export default function OfferDetailsPage() {
  const { id } = useParams()

  // Mock data - in real app, fetch from API
  const offer = {
    id,
    name: 'Internet Pro',
    description: 'Ultra-fast fiber internet for power users and families',
    price: 59.99,
    serviceType: 'Internet',
    speed: '500 Mbps',
    features: [
      'Download speeds up to 500 Mbps',
      'Upload speeds up to 100 Mbps',
      'Unlimited data usage',
      'Free professional installation',
      'Free Wi-Fi 6 modem/router',
      'Priority customer support',
      'Static IP address included',
      'No contract required',
    ],
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/offers"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to offers
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{offer.name}</h1>
            <p className="text-xl text-gray-600 mb-8">{offer.description}</p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {offer.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Service Type</dt>
                    <dd className="mt-1 text-gray-900">{offer.serviceType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Connection Speed</dt>
                    <dd className="mt-1 text-gray-900">{offer.speed}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Installation</dt>
                    <dd className="mt-1 text-gray-900">Free professional installation included</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contract</dt>
                    <dd className="mt-1 text-gray-900">No contract - cancel anytime</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Subscribe Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900">
                    {formatCurrency(offer.price)}
                  </div>
                  <div className="text-gray-600">per month</div>
                </div>
                <Button className="w-full mb-4" size="lg">
                  Get Started
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  No credit card required. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

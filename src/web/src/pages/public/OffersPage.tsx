import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { catalogService, Offer } from '@/services/catalogService'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { Wifi, Smartphone, Tv } from 'lucide-react'

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [filter, setFilter] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOffers()
  }, [filter])

  const loadOffers = async () => {
    try {
      setLoading(true)
      const data = await catalogService.getOffers(filter === 'All' ? undefined : filter)
      setOffers(data)
    } catch (error) {
      console.error('Failed to load offers:', error)
      // Use mock data for demo
      setOffers(getMockOffers())
    } finally {
      setLoading(false)
    }
  }

  const getMockOffers = (): Offer[] => [
    {
      id: '1',
      name: 'Internet Starter',
      description: 'Perfect for browsing and streaming',
      price: 39.99,
      serviceType: 'Internet',
      speed: '100 Mbps',
      features: ['Unlimited data', 'Free modem', '24/7 support'],
    },
    {
      id: '2',
      name: 'Internet Pro',
      description: 'Ultra-fast for heavy users',
      price: 59.99,
      serviceType: 'Internet',
      speed: '500 Mbps',
      features: ['Unlimited data', 'Free modem', 'Priority support', 'Static IP'],
    },
    {
      id: '3',
      name: 'Mobile Essential',
      description: '5G mobile plan with unlimited calls',
      price: 29.99,
      serviceType: 'Mobile',
      data: '10GB',
      features: ['Unlimited calls', 'Unlimited SMS', '5G network'],
    },
    {
      id: '4',
      name: 'TV Premium',
      description: 'All channels and streaming services',
      price: 49.99,
      serviceType: 'TV',
      features: ['200+ channels', '4K streaming', 'Cloud DVR', 'Sports package'],
    },
  ]

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Internet':
        return <Wifi className="h-5 w-5" />
      case 'Mobile':
        return <Smartphone className="h-5 w-5" />
      case 'TV':
        return <Tv className="h-5 w-5" />
      default:
        return null
    }
  }

  const filters = ['All', 'Internet', 'Mobile', 'TV']

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Plans & Offers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include 24/7 customer support.
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-8">
          {filters.map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Offers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading offers...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {getServiceIcon(offer.serviceType)}
                      {offer.serviceType}
                    </Badge>
                    {offer.speed && <span className="text-sm text-gray-600">{offer.speed}</span>}
                    {offer.data && <span className="text-sm text-gray-600">{offer.data}</span>}
                  </div>
                  <CardTitle>{offer.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(offer.price)}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <ul className="space-y-2">
                    {offer.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link to={`/offers/${offer.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                  <Button className="flex-1">Subscribe</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

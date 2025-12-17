import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, Wifi, Smartphone, Tv } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { catalogService } from '@/services/catalogService'

export default function OfferDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => catalogService.getProductById(id!), 
    enabled: !!id
  })
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Failed to load product details</div>
        <Button onClick={() => navigate('/offers')}>Back to Offers</Button>
      </div>
    )
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'Internet':
        return <Wifi className="h-5 w-5 mr-2 text-primary" />
      case 'Mobile':
        return <Smartphone className="h-5 w-5 mr-2 text-primary" />
      case 'TV':
        return <Tv className="h-5 w-5 mr-2 text-primary" />
      default:
        return null
    }
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          asChild
          className="mb-8 pl-0"
        >
          <Link to="/offers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to offers
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center mt-2">
                  {getServiceIcon(product.serviceType)}
                  <Badge variant="outline">
                    {product.serviceType}
                  </Badge>
                </div>
              </div>
              <div className="text-3xl font-bold">
                {formatCurrency(product.price)}<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </div>
            
            <p className="text-xl text-gray-600 mb-8">{product.description}</p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
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
                    <dd className="mt-1 text-gray-900">{product.serviceType}</dd>
                  </div>
                  {product.speed && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Connection Speed</dt>
                      <dd className="mt-1 text-gray-900">{product.speed}</dd>
                    </div>
                  )}
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
                    {formatCurrency(product.price)}
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

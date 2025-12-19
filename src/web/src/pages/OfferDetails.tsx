import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Wifi, Smartphone, Tv, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { catalogService, Product } from '@/services/catalogService'
import { customerService } from '@/services/customerService'
import { subscriptionService } from '@/services/subscriptionService'

export default function OfferDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      const data = await catalogService.getProductById(productId)
      setProduct(data)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!product) return

    try {
      setSubscribing(true)
      setError(null)

      const customerProfile = await customerService.getMyProfile()
      if (!customerProfile) {
        setError('Please create a customer profile first')
        return
      }

      const result = await subscriptionService.create({
        customerId: customerProfile.id,
        productId: product.id,
        productName: product.name,
        price: product.price,
        successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/offers/${product.id}`
      })

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      } else {
        setError('Failed to get checkout URL')
        setSubscribing(false)
      }
    } catch (err: any) {
      console.error('Error creating subscription:', err)
      setError(err.response?.data?.message || 'Failed to create subscription')
      setSubscribing(false)
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => navigate('/offers')}>Back to Offers</Button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600 mb-4">Product not found</div>
        <Button onClick={() => navigate('/offers')}>Back to Offers</Button>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/offers" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to offers
        </Link>

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
            
            <p className="text-xl text-gray-600 mb-8">
              {product.description}
            </p>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {product.speed && (
                    <div className="flex items-center">
                      <Wifi className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">{product.speed}</span>
                    </div>
                  )}
                  {product.data && (
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">{product.data}</span>
                    </div>
                  )}
                </div>
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
                
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full mb-4" 
                  size="lg"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Processing...</>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Secure payment via Stripe. Cancel anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

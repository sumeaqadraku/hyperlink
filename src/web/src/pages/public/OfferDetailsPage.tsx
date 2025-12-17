import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check, Wifi, Smartphone, Tv, Calendar, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { catalogService } from '@/services/catalogService'
import { offerDetailsService } from '@/services/offerDetailsService'

export default function OfferDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading: productLoading, error: productError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => catalogService.getProductById(id!), 
    enabled: !!id
  })

  const { data: offerDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['offerDetails', id],
    queryFn: () => offerDetailsService.getByProductId(id!),
    enabled: !!id,
    retry: false
  })

  const isLoading = productLoading || detailsLoading
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Failed to load product details</div>
        <Button onClick={() => navigate('/offers')}>Back to Offers</Button>
      </div>
    )
  }

  // Parse comma-separated strings into arrays
  const includedServices = offerDetails?.includedServices?.split(',').map(s => s.trim()).filter(Boolean) || []
  const promotions = offerDetails?.promotions?.split(',').map(s => s.trim()).filter(Boolean) || []
  const bonusFeatures = offerDetails?.bonusFeatures?.split(',').map(s => s.trim()).filter(Boolean) || []

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
              {offerDetails?.detailedDescription || product.description}
            </p>

            {/* Technical Specifications */}
            {offerDetails && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Billing Cycle</dt>
                        <dd className="mt-1 text-base text-gray-900 font-medium">{offerDetails.billingCycle}</dd>
                      </div>
                      {offerDetails.speedBandwidth && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Speed / Bandwidth</dt>
                          <dd className="mt-1 text-base text-gray-900 font-medium">{offerDetails.speedBandwidth}</dd>
                        </div>
                      )}
                      {offerDetails.dataLimit && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Data Limit</dt>
                          <dd className="mt-1 text-base text-gray-900 font-medium">{offerDetails.dataLimit}</dd>
                        </div>
                      )}
                      {offerDetails.technology && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Technology</dt>
                          <dd className="mt-1 text-base text-gray-900 font-medium">{offerDetails.technology}</dd>
                        </div>
                      )}
                      {offerDetails.contractDurationMonths && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contract Duration</dt>
                          <dd className="mt-1 text-base text-gray-900 font-medium">{offerDetails.contractDurationMonths} months</dd>
                        </div>
                      )}
                      {offerDetails.installationType && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Installation Type</dt>
                          <dd className="mt-1 text-base text-gray-900 font-medium">{offerDetails.installationType}</dd>
                        </div>
                      )}
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Included Services & Benefits */}
            {(includedServices.length > 0 || bonusFeatures.length > 0 || product.features.length > 0) && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {includedServices.map((service, index) => (
                      <li key={`service-${index}`} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{service}</span>
                      </li>
                    ))}
                    {bonusFeatures.map((feature, index) => (
                      <li key={`bonus-${index}`} className="flex items-start">
                        <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                    {product.features.map((feature, index) => (
                      <li key={`feature-${index}`} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Promotions */}
            {promotions.length > 0 && (
              <Card className="mb-8 border-primary">
                <CardHeader>
                  <CardTitle className="text-primary">Special Promotions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {promotions.map((promo, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">🎉</span>
                        <span className="font-medium">{promo}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Availability & Eligibility */}
            {offerDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Availability & Eligibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        Availability Status
                      </dt>
                      <dd className="mt-1">
                        <Badge variant={offerDetails.isAvailable ? 'default' : 'secondary'}>
                          {offerDetails.isAvailable ? 'Available' : 'Not Available'}
                        </Badge>
                      </dd>
                    </div>
                    {offerDetails.coverageArea && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Coverage Area</dt>
                        <dd className="mt-1 text-gray-900">{offerDetails.coverageArea}</dd>
                      </div>
                    )}
                    {offerDetails.availableFrom && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Available From
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {new Date(offerDetails.availableFrom).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {offerDetails.availableUntil && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Available Until</dt>
                        <dd className="mt-1 text-gray-900">
                          {new Date(offerDetails.availableUntil).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {offerDetails.eligibleCustomers && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Eligible Customers
                        </dt>
                        <dd className="mt-1 text-gray-900">{offerDetails.eligibleCustomers}</dd>
                      </div>
                    )}
                    {offerDetails.minimumAge && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Age Restriction</dt>
                        <dd className="mt-1 text-gray-900">{offerDetails.minimumAge}+ years</dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}
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

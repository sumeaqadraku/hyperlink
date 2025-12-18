import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { Wifi, Smartphone, Tv, Loader2, Filter } from 'lucide-react'
import { serviceTypeService, ServiceTypeDto } from '@/services/serviceTypeService'
import axios from 'axios'

interface Product {
  id: string
  name: string
  description: string
  productCode: string
  price: number
  isActive: boolean
  category: number
  serviceTypeId?: string | null
  imageUrl?: string | null
}

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeDto[]>([])
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [productsRes, serviceTypesData] = await Promise.all([
          axios.get('/api/catalog/products/active'),
          serviceTypeService.getActive()
        ])
        setProducts(productsRes.data)
        setFilteredProducts(productsRes.data)
        setServiceTypes(serviceTypesData)
      } catch (err) {
        console.error('Failed to load data:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (selectedServiceType) {
      setFilteredProducts(products.filter(p => p.serviceTypeId === selectedServiceType))
    } else {
      setFilteredProducts(products)
    }
  }, [selectedServiceType, products])

  const getServiceTypeName = (serviceTypeId?: string | null) => {
    if (!serviceTypeId) return null
    return serviceTypes.find(st => st.id === serviceTypeId)?.name || null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Our Services & Plans</h1>
        <p className="text-lg text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      {/* Service Type Filter */}
      {serviceTypes.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-700">Filter by Service Type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedServiceType(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedServiceType === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Services
            </button>
            {serviceTypes.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedServiceType(st.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedServiceType === st.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found for the selected service type.</p>
          <Button variant="outline" className="mt-4" onClick={() => setSelectedServiceType(null)}>
            View All Services
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  {getServiceTypeName(product.serviceTypeId) && (
                    <Badge variant="outline" className="text-sm">
                      {getServiceTypeName(product.serviceTypeId)}
                    </Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(product.price)}<span className="text-sm font-normal text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">{product.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Product Code: {product.productCode}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/offers/${product.id}`} className="w-full">
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

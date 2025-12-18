import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { catalogService, Product } from '@/services/catalogService'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { Wifi, Smartphone, Tv } from 'lucide-react'

export default function Offers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const data = await catalogService.getActiveProducts()
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products:', error)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Internet Plans</h1>
        <p className="text-lg text-muted-foreground">Choose the perfect plan for your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <Badge variant="outline" className="text-sm">
                  {product.serviceType}
                </Badge>
              </div>
              <div className="text-3xl font-bold">
                {formatCurrency(product.price)}<span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground">{product.description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                {product.speed && (
                  <div className="flex items-center">
                    <Wifi className="h-5 w-5 mr-2 text-primary" />
                    <span>{product.speed}</span>
                  </div>
                )}
                {product.data && (
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2 text-primary" />
                    <span>{product.data}</span>
                  </div>
                )}
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
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
    </div>
  )
}

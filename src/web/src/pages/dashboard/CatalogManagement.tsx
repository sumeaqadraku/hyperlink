import { useState, useEffect, useCallback } from 'react'
import { catalogService, Product } from '@/services/catalogService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import ProductDialog from '@/components/catalog/ProductDialog'

export default function CatalogManagement() {
  const [offers, setOffers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined)

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await catalogService.getProducts()
      setOffers(data)
    } catch (error) {
      console.error('Failed to load offers:', error)
      // Use mock data for demo
      setOffers(getMockOffers())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOffers()
  }, [loadOffers])

  const getMockOffers = (): Product[] => [
    {
      id: '1',
      name: 'Internet Starter',
      description: 'Perfect for browsing and streaming',
      price: 39.99,
      serviceType: 'Internet',
      speed: '100 Mbps',
      features: ['Unlimited data', 'Free modem'],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Internet Pro',
      description: 'Ultra-fast for heavy users',
      price: 59.99,
      serviceType: 'Internet',
      speed: '500 Mbps',
      features: ['Unlimited data', 'Free modem', 'Priority support'],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Mobile Essential',
      description: '5G mobile plan',
      price: 29.99,
      serviceType: 'Mobile',
      data: '10GB',
      features: ['Unlimited calls', '5G network'],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'TV Premium',
      description: 'All channels and streaming',
      price: 49.99,
      serviceType: 'TV',
      features: ['200+ channels', '4K streaming'],
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ]

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await catalogService.deleteProduct(id)
        loadOffers()
      } catch (error) {
        console.error('Failed to delete offer:', error)
      }
    }
  }

  const handleCreate = () => {
    setEditingProduct(undefined)
    setDialogOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleSave = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { productCode: string }) => {
    if (editingProduct) {
      await catalogService.updateProduct(editingProduct.id, productData)
    } else {
      await catalogService.createProduct(productData)
    }
    loadOffers()
  }

  const getServiceTypeBadge = (type: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'outline' } = {
      Internet: 'default',
      Mobile: 'secondary',
      TV: 'outline',
    }
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalog Management</h1>
          <p className="text-gray-600">Manage your service offers and plans</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Offers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading offers...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell className="font-medium">{offer.name}</TableCell>
                    <TableCell>{getServiceTypeBadge(offer.serviceType)}</TableCell>
                    <TableCell className="max-w-xs truncate">{offer.description}</TableCell>
                    <TableCell>{formatCurrency(offer.price)}/mo</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {offer.speed || offer.data || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(offer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(offer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tariff Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Tariff plans configuration and management will be displayed here.
          </p>
        </CardContent>
      </Card>

      <ProductDialog
        product={editingProduct}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}

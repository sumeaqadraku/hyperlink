import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { catalogService, Product } from '@/services/catalogService'
import { offerDetailsService, OfferDetails } from '@/services/offerDetailsService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export default function OfferDetailsManagement() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingDetails, setEditingDetails] = useState<OfferDetails | null>(null)
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const prods = await catalogService.getProducts()
      console.log('Loaded products:', prods)
      return prods
    }
  })

  const { data: allOfferDetails = [], isLoading: detailsLoading } = useQuery({
    queryKey: ['offerDetails'],
    queryFn: async () => {
      const details = await offerDetailsService.getAll()
      console.log('Loaded offer details:', details)
      console.log('First detail productId:', details[0]?.productId)
      return details
    }
  })

  const createMutation = useMutation({
    mutationFn: (data: Omit<OfferDetails, 'id' | 'createdAt' | 'updatedAt'>) => 
      offerDetailsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerDetails'] })
      setShowForm(false)
      setSelectedProduct(null)
      alert('Offer details created successfully!')
    },
    onError: (error: Error) => {
      alert(`Failed to create: ${(error as any).response?.data || error.message}`)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<OfferDetails> }) =>
      offerDetailsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerDetails'] })
      setShowForm(false)
      setEditingDetails(null)
      alert('Offer details updated successfully!')
    },
    onError: (error: Error) => {
      alert(`Failed to update: ${(error as any).response?.data || error.message}`)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => offerDetailsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerDetails'] })
      alert('Offer details deleted successfully!')
    }
  })

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string, isAvailable: boolean }) =>
      offerDetailsService.setAvailability(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offerDetails'] })
    }
  })

  const handleCreate = (product: Product) => {
    setSelectedProduct(product)
    setEditingDetails(null)
    setShowForm(true)
  }

  const handleEdit = (details: OfferDetails) => {
    const product = products.find(p => p.id === details.productId)
    setSelectedProduct(product || null)
    setEditingDetails(details)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete these offer details?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggleAvailability = (id: string, currentStatus: boolean) => {
    toggleAvailabilityMutation.mutate({ id, isAvailable: !currentStatus })
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    console.log('Looking for product:', productId, 'Found:', product?.name)
    return product?.name || 'Unknown Product'
  }

  const productsWithoutDetails = products.filter(
    p => !allOfferDetails.some(od => od.productId === p.id)
  )

  if (productsLoading || detailsLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  console.log('Rendering with products:', products.length, 'offer details:', allOfferDetails.length)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Offer Details Management</h1>
          <p className="text-gray-600">Manage comprehensive details for your product offers</p>
        </div>
      </div>

      {/* Existing Offer Details */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Offer Details ({allOfferDetails.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {allOfferDetails.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No offer details created yet. Add details for your products below.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Billing Cycle</TableHead>
                  <TableHead>Technology</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allOfferDetails.map((details) => (
                  <TableRow key={details.id}>
                    <TableCell className="font-medium">
                      {getProductName(details.productId)}
                    </TableCell>
                    <TableCell>{details.billingCycle}</TableCell>
                    <TableCell>{details.technology || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={details.isAvailable ? 'default' : 'secondary'}>
                        {details.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAvailability(details.id, details.isAvailable)}
                          title={details.isAvailable ? 'Set Unavailable' : 'Set Available'}
                        >
                          {details.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(details)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(details.id)}
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

      {/* Products Without Details */}
      <Card>
        <CardHeader>
          <CardTitle>Products Without Details ({productsWithoutDetails.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {productsWithoutDetails.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              All products have offer details configured.
            </p>
          ) : (
            <div className="space-y-2">
              {productsWithoutDetails.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                  <Button onClick={() => handleCreate(product)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      {showForm && selectedProduct && (
        <OfferDetailsForm
          product={selectedProduct}
          existingDetails={editingDetails}
          onSave={(data) => {
            if (editingDetails) {
              updateMutation.mutate({ id: editingDetails.id, data })
            } else {
              createMutation.mutate(data)
            }
          }}
          onCancel={() => {
            setShowForm(false)
            setSelectedProduct(null)
            setEditingDetails(null)
          }}
          isSaving={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  )
}

interface OfferDetailsFormProps {
  product: Product
  existingDetails: OfferDetails | null
  onSave: (data: Omit<OfferDetails, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  isSaving: boolean
}

function OfferDetailsForm({ product, existingDetails, onSave, onCancel, isSaving }: OfferDetailsFormProps) {
  const [formData, setFormData] = useState({
    productId: product.id,
    billingCycle: existingDetails?.billingCycle || 'Monthly',
    detailedDescription: existingDetails?.detailedDescription || '',
    speedBandwidth: existingDetails?.speedBandwidth || '',
    dataLimit: existingDetails?.dataLimit || '',
    technology: existingDetails?.technology || '',
    contractDurationMonths: existingDetails?.contractDurationMonths || 12,
    installationType: existingDetails?.installationType || '',
    isAvailable: existingDetails?.isAvailable ?? true,
    coverageArea: existingDetails?.coverageArea || '',
    availableFrom: existingDetails?.availableFrom || '',
    availableUntil: existingDetails?.availableUntil || '',
    includedServices: existingDetails?.includedServices || '',
    promotions: existingDetails?.promotions || '',
    bonusFeatures: existingDetails?.bonusFeatures || '',
    eligibleCustomers: existingDetails?.eligibleCustomers || '',
    minimumAge: existingDetails?.minimumAge || undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Omit<OfferDetails, 'id' | 'createdAt' | 'updatedAt'>)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">
            {existingDetails ? 'Edit' : 'Add'} Offer Details: {product.name}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="billingCycle">Billing Cycle *</Label>
                <select
                  id="billingCycle"
                  value={formData.billingCycle}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="isAvailable" className="mb-0">Available</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="detailedDescription">Detailed Description *</Label>
              <textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technical Specifications</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="speedBandwidth">Speed / Bandwidth</Label>
                <Input
                  id="speedBandwidth"
                  value={formData.speedBandwidth}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, speedBandwidth: e.target.value })}
                  placeholder="e.g., 100 Mbps"
                />
              </div>

              <div>
                <Label htmlFor="dataLimit">Data Limit</Label>
                <Input
                  id="dataLimit"
                  value={formData.dataLimit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, dataLimit: e.target.value })}
                  placeholder="e.g., Unlimited or 500 GB"
                />
              </div>

              <div>
                <Label htmlFor="technology">Technology</Label>
                <Input
                  id="technology"
                  value={formData.technology}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, technology: e.target.value })}
                  placeholder="e.g., Fiber, 5G"
                />
              </div>

              <div>
                <Label htmlFor="contractDurationMonths">Contract Duration (months)</Label>
                <Input
                  id="contractDurationMonths"
                  type="number"
                  value={formData.contractDurationMonths}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, contractDurationMonths: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="installationType">Installation Type</Label>
                <Input
                  id="installationType"
                  value={formData.installationType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, installationType: e.target.value })}
                  placeholder="e.g., Self-install, Technician required"
                />
              </div>
            </div>
          </div>

          {/* Availability & Coverage */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Availability & Coverage</h3>
            
            <div>
              <Label htmlFor="coverageArea">Coverage Area</Label>
              <Input
                id="coverageArea"
                value={formData.coverageArea}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, coverageArea: e.target.value })}
                placeholder="e.g., Nationwide, City center"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom ? formData.availableFrom.split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, availableFrom: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                />
              </div>

              <div>
                <Label htmlFor="availableUntil">Available Until</Label>
                <Input
                  id="availableUntil"
                  type="date"
                  value={formData.availableUntil ? formData.availableUntil.split('T')[0] : ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, availableUntil: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                />
              </div>
            </div>
          </div>

          {/* Benefits & Extras */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Benefits & Extras</h3>
            <p className="text-sm text-gray-500">Use commas to separate multiple items</p>
            
            <div>
              <Label htmlFor="includedServices">Included Services</Label>
              <Input
                id="includedServices"
                value={formData.includedServices}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, includedServices: e.target.value })}
                placeholder="e.g., Free router, Free installation, 24/7 support"
              />
            </div>

            <div>
              <Label htmlFor="promotions">Promotions</Label>
              <Input
                id="promotions"
                value={formData.promotions}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, promotions: e.target.value })}
                placeholder="e.g., First 3 months 50% off, Free setup"
              />
            </div>

            <div>
              <Label htmlFor="bonusFeatures">Bonus Features</Label>
              <Input
                id="bonusFeatures"
                value={formData.bonusFeatures}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, bonusFeatures: e.target.value })}
                placeholder="e.g., Static IP, Parental control"
              />
            </div>
          </div>

          {/* Eligibility */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Eligibility</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eligibleCustomers">Eligible Customers</Label>
                <Input
                  id="eligibleCustomers"
                  value={formData.eligibleCustomers}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, eligibleCustomers: e.target.value })}
                  placeholder="e.g., New customers only, All customers"
                />
              </div>

              <div>
                <Label htmlFor="minimumAge">Minimum Age</Label>
                <Input
                  id="minimumAge"
                  type="number"
                  value={formData.minimumAge || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, minimumAge: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="e.g., 18"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : existingDetails ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

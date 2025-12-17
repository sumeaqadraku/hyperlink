import { useState, useEffect } from 'react'
import { Product } from '@/services/catalogService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { X } from 'lucide-react'

interface ProductDialogProps {
  product?: Product
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { productCode: string }) => Promise<void>
}

export default function ProductDialog({ product, isOpen, onClose, onSave }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productCode: '',
    price: 0,
    serviceType: 'Internet' as 'Internet' | 'Mobile' | 'TV',
    imageUrl: '',
    isActive: true,
    features: [] as string[],
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        productCode: '',
        price: product.price,
        serviceType: product.serviceType,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive,
        features: product.features || [],
      })
    } else {
      setFormData({
        name: '',
        description: '',
        productCode: '',
        price: 0,
        serviceType: 'Internet',
        imageUrl: '',
        isActive: true,
        features: [],
      })
    }
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Create New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="productCode">Product Code *</Label>
            <Input
              id="productCode"
              value={formData.productCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, productCode: e.target.value })}
              placeholder="e.g., INTERNET-100"
              required={!product}
              disabled={!!product}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($/month) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <select
                id="serviceType"
                value={formData.serviceType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, serviceType: e.target.value as 'Internet' | 'Mobile' | 'TV' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Internet">Internet</option>
                <option value="Mobile">Mobile</option>
                <option value="TV">TV</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL (optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="isActive" className="mb-0">Active Product</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

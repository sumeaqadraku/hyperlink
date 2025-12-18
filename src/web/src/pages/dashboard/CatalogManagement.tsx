import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Edit2, Trash2, Loader2, AlertCircle, X, Save, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import axios from 'axios'
import { serviceTypeService, ServiceTypeDto } from '@/services/serviceTypeService'

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
  createdAt: string
  updatedAt?: string | null
}

const CATEGORIES = [
  { value: 1, label: 'Mobile' },
  { value: 2, label: 'Internet' },
  { value: 3, label: 'Television' },
  { value: 4, label: 'Bundle' },
  { value: 5, label: 'Device' },
  { value: 6, label: 'Accessory' },
]

const getCategoryLabel = (category: number) => {
  return CATEGORIES.find(c => c.value === category)?.label || 'Unknown'
}

const getCategoryColor = (category: number) => {
  const colors: { [key: number]: string } = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-purple-100 text-purple-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-gray-100 text-gray-800',
    6: 'bg-pink-100 text-pink-800',
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export default function CatalogManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [productsRes, serviceTypesData] = await Promise.all([
        axios.get('/api/catalog/products', { headers: getAuthHeaders() }),
        serviceTypeService.getActive()
      ])
      setProducts(productsRes.data)
      setFilteredProducts(productsRes.data)
      setServiceTypes(serviceTypesData)
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  const getServiceTypeName = (serviceTypeId?: string | null) => {
    if (!serviceTypeId) return null
    return serviceTypes.find(st => st.id === serviceTypeId)?.name || null
  }

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchTerm, products])

  const handleCreate = () => {
    setEditingProduct({
      id: '',
      name: '',
      description: '',
      productCode: '',
      price: 0,
      isActive: true,
      category: 1,
      serviceTypeId: null,
      createdAt: ''
    })
    setIsCreateMode(true)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product })
    setIsCreateMode(false)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleSave = async () => {
    if (!editingProduct) return

    try {
      setError(null)
      
      if (isCreateMode) {
        await axios.post('/api/catalog/products', {
          name: editingProduct.name,
          description: editingProduct.description,
          productCode: editingProduct.productCode,
          price: editingProduct.price,
          category: editingProduct.category,
          serviceTypeId: editingProduct.serviceTypeId || null,
          imageUrl: editingProduct.imageUrl || null
        }, { headers: getAuthHeaders() })
        setSuccess('Product created successfully!')
      } else {
        await axios.put(`/api/catalog/products/${editingProduct.id}`, {
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          serviceTypeId: editingProduct.serviceTypeId || null,
          imageUrl: editingProduct.imageUrl || null
        }, { headers: getAuthHeaders() })
        setSuccess('Product updated successfully!')
      }
      
      setIsModalOpen(false)
      setEditingProduct(null)
      await loadProducts()
    } catch (err: any) {
      console.error('Error saving product:', err)
      setError(err.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      setError(null)
      await axios.delete(`/api/catalog/products/${id}`, { headers: getAuthHeaders() })
      setSuccess('Product deleted successfully!')
      await loadProducts()
    } catch (err: any) {
      console.error('Error deleting product:', err)
      setError(err.response?.data?.message || 'Failed to delete product')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your products catalog</p>
        </div>
        <Button onClick={handleCreate} className="bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4 mr-2" /> New Product
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, code, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Products ({filteredProducts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product Code</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Service Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{product.productCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {getServiceTypeName(product.serviceTypeId) || <span className="text-gray-400 italic">None</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3">
                      {product.isActive ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <XCircle className="h-4 w-4" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isCreateMode ? 'Create Product' : 'Edit Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Product name"
                />
              </div>

              {isCreateMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Code *</label>
                  <input
                    type="text"
                    value={editingProduct.productCode}
                    onChange={(e) => setEditingProduct({ ...editingProduct, productCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary font-mono"
                    placeholder="e.g., PROD-001"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  rows={3}
                  placeholder="Product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {isCreateMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                <select
                  value={editingProduct.serviceTypeId || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, serviceTypeId: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">-- No Service Type --</option>
                  {serviceTypes.map(st => (
                    <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select a service type to categorize this product for user filtering</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="https://..."
                />
              </div>

              {!isCreateMode && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  <p><strong>Product Code:</strong> {editingProduct.productCode}</p>
                  <p><strong>Category:</strong> {getCategoryLabel(editingProduct.category)}</p>
                  <p><strong>Status:</strong> {editingProduct.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90">
                <Save className="h-4 w-4 mr-2" />
                {isCreateMode ? 'Create Product' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

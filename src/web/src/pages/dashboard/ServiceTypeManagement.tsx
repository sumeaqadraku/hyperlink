import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, Loader2, AlertCircle, X, Save, CheckCircle, XCircle, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { serviceTypeService, ServiceTypeDto, CreateServiceTypeRequest, UpdateServiceTypeRequest } from '@/services/serviceTypeService'

export default function ServiceTypeManagement() {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeDto[]>([])
  const [filteredServiceTypes, setFilteredServiceTypes] = useState<ServiceTypeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingServiceType, setEditingServiceType] = useState<ServiceTypeDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)

  useEffect(() => {
    loadServiceTypes()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = serviceTypes.filter(st =>
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredServiceTypes(filtered)
    } else {
      setFilteredServiceTypes(serviceTypes)
    }
  }, [searchTerm, serviceTypes])

  const loadServiceTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await serviceTypeService.getAll()
      setServiceTypes(data)
      setFilteredServiceTypes(data)
    } catch (err: any) {
      console.error('Failed to load service types:', err)
      setError('Failed to load service types')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingServiceType({
      id: '',
      name: '',
      description: '',
      code: '',
      icon: '',
      isActive: true,
      displayOrder: serviceTypes.length,
      createdAt: ''
    })
    setIsCreateMode(true)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleEdit = (serviceType: ServiceTypeDto) => {
    setEditingServiceType({ ...serviceType })
    setIsCreateMode(false)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleSave = async () => {
    if (!editingServiceType) return

    if (!editingServiceType.name.trim()) {
      setError('Name is required')
      return
    }

    if (isCreateMode && !editingServiceType.code.trim()) {
      setError('Code is required')
      return
    }

    try {
      setError(null)
      
      if (isCreateMode) {
        const payload: CreateServiceTypeRequest = {
          name: editingServiceType.name,
          description: editingServiceType.description || undefined,
          code: editingServiceType.code,
          icon: editingServiceType.icon || undefined,
          displayOrder: editingServiceType.displayOrder
        }
        await serviceTypeService.create(payload)
        setSuccess('Service type created successfully!')
      } else {
        const payload: UpdateServiceTypeRequest = {
          name: editingServiceType.name,
          description: editingServiceType.description || undefined,
          icon: editingServiceType.icon || undefined,
          displayOrder: editingServiceType.displayOrder,
          isActive: editingServiceType.isActive
        }
        await serviceTypeService.update(editingServiceType.id, payload)
        setSuccess('Service type updated successfully!')
      }
      
      setIsModalOpen(false)
      setEditingServiceType(null)
      await loadServiceTypes()
    } catch (err: any) {
      console.error('Error saving service type:', err)
      setError(err.response?.data?.message || 'Failed to save service type')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service type?')) return

    try {
      setError(null)
      await serviceTypeService.delete(id)
      setSuccess('Service type deleted successfully!')
      await loadServiceTypes()
    } catch (err: any) {
      console.error('Error deleting service type:', err)
      setError(err.response?.data?.message || 'Failed to delete service type')
    }
  }

  const formatDate = (dateString?: string) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Service Types</h1>
          <p className="text-gray-600">Manage service categories for your offers</p>
        </div>
        <Button onClick={handleCreate} className="bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4 mr-2" /> New Service Type
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
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </Card>

      {/* Service Types Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Service Types ({filteredServiceTypes.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="h-4 w-4" /> Order
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Icon</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Created</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredServiceTypes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No service types found. Create one to get started.
                  </td>
                </tr>
              ) : (
                filteredServiceTypes.map((st) => (
                  <tr key={st.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{st.displayOrder}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{st.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {st.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{st.icon || '-'}</td>
                    <td className="px-4 py-3">
                      {st.isActive ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 text-sm">
                          <XCircle className="h-4 w-4" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(st.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(st)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(st.id)}>
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
      {isModalOpen && editingServiceType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isCreateMode ? 'Create Service Type' : 'Edit Service Type'}
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
                  value={editingServiceType.name}
                  onChange={(e) => setEditingServiceType({ ...editingServiceType, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="e.g., Mobile, Internet, TV"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  value={editingServiceType.code}
                  onChange={(e) => setEditingServiceType({ ...editingServiceType, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="e.g., MOBILE, INTERNET, TV"
                  disabled={!isCreateMode}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingServiceType.description || ''}
                  onChange={(e) => setEditingServiceType({ ...editingServiceType, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  rows={2}
                  placeholder="Brief description of this service type"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <input
                    type="text"
                    value={editingServiceType.icon || ''}
                    onChange={(e) => setEditingServiceType({ ...editingServiceType, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    placeholder="e.g., phone, wifi, tv"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    value={editingServiceType.displayOrder}
                    onChange={(e) => setEditingServiceType({ ...editingServiceType, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {!isCreateMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingServiceType.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditingServiceType({ ...editingServiceType, isActive: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                {isCreateMode ? 'Create' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

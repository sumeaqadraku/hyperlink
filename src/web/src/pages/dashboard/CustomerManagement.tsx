import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, Loader2, AlertCircle, X, Save, User, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { customerService, CustomerDto, UpdateCustomerRequest } from '@/services/customerService'
import { userService, UserDto } from '@/services/userService'

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<CustomerDto[]>([])
  const [users, setUsers] = useState<UserDto[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingCustomer, setEditingCustomer] = useState<CustomerDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(c => 
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phoneNumber?.includes(searchTerm)
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchTerm, customers])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [customersData, usersData] = await Promise.all([
        customerService.getAll(),
        userService.getAll()
      ])
      setCustomers(customersData)
      setFilteredCustomers(customersData)
      setUsers(usersData)
    } catch (err: any) {
      console.error('Error fetching data:', err)
      setError('Failed to load data. Make sure you have admin privileges.')
    } finally {
      setLoading(false)
    }
  }

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.email || 'Unknown'
  }

  const getUsersWithoutCustomer = () => {
    const customerUserIds = customers.map(c => c.userId)
    return users.filter(u => !customerUserIds.includes(u.id))
  }

  const handleEdit = (customer: CustomerDto) => {
    setEditingCustomer({
      ...customer,
      dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.split('T')[0] : ''
    })
    setIsCreateMode(false)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleCreate = () => {
    const availableUsers = getUsersWithoutCustomer()
    if (availableUsers.length === 0) {
      setError('All users already have customer profiles. Create a new user first.')
      return
    }
    setSelectedUserId(availableUsers[0]?.id || '')
    setEditingCustomer({
      id: '',
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      status: 1,
      createdAt: ''
    })
    setIsCreateMode(true)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleSave = async () => {
    if (!editingCustomer) return

    try {
      setError(null)
      
      if (isCreateMode) {
        if (!selectedUserId) {
          setError('Please select a user')
          return
        }
        const selectedUser = users.find(u => u.id === selectedUserId)
        await customerService.create({
          userId: selectedUserId,
          email: selectedUser?.email || '',
          firstName: editingCustomer.firstName,
          lastName: editingCustomer.lastName,
          phoneNumber: editingCustomer.phoneNumber,
          gender: editingCustomer.gender,
          dateOfBirth: editingCustomer.dateOfBirth ? new Date(editingCustomer.dateOfBirth).toISOString() : undefined,
          address: editingCustomer.address,
          city: editingCustomer.city,
          state: editingCustomer.state,
          postalCode: editingCustomer.postalCode,
          country: editingCustomer.country,
        })
        setSuccess('Customer profile created successfully!')
      } else {
        const payload: UpdateCustomerRequest = {
          firstName: editingCustomer.firstName,
          lastName: editingCustomer.lastName,
          phoneNumber: editingCustomer.phoneNumber,
          gender: editingCustomer.gender,
          dateOfBirth: editingCustomer.dateOfBirth ? new Date(editingCustomer.dateOfBirth).toISOString() : undefined,
          address: editingCustomer.address,
          city: editingCustomer.city,
          state: editingCustomer.state,
          postalCode: editingCustomer.postalCode,
          country: editingCustomer.country,
        }
        await customerService.update(editingCustomer.userId, payload)
        setSuccess('Customer profile updated successfully!')
      }
      
      setIsModalOpen(false)
      setEditingCustomer(null)
      await fetchData()
    } catch (err: any) {
      console.error('Error saving customer:', err)
      setError(err.response?.data?.message || 'Failed to save customer profile')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this customer profile?')) {
      return
    }

    try {
      setError(null)
      await customerService.delete(userId)
      setSuccess('Customer profile deleted successfully!')
      await fetchData()
    } catch (err: any) {
      console.error('Error deleting customer:', err)
      setError(err.response?.data?.message || 'Failed to delete customer profile')
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Active'
      case 2: return 'Suspended'
      case 3: return 'Inactive'
      default: return 'Unknown'
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage customer profiles (Customer Service)</p>
        </div>
        <Button onClick={handleCreate} className="bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4 mr-2" /> New Customer Profile
        </Button>
      </div>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Link2 className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">User-Customer Relationship</p>
            <p>Each Customer profile is linked to a User account via UserId. Users are managed in Identity Service, Customers in Customer Service.</p>
          </div>
        </div>
      </Card>

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
          <AlertCircle className="h-5 w-5" />
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
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Customer Profiles ({filteredCustomers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Linked User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No customer profiles found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {customer.firstName || customer.lastName 
                        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                        : <span className="text-gray-400 italic">Not set</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1 text-blue-600">
                        <User className="h-3 w-3" />
                        <span className="text-xs">{getUserEmail(customer.userId)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{customer.phoneNumber || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {customer.city && customer.country 
                        ? `${customer.city}, ${customer.country}`
                        : customer.city || customer.country || '-'
                      }
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(customer)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(customer.userId)}>
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
      {isModalOpen && editingCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-semibold">
                {isCreateMode ? 'Create Customer Profile' : 'Edit Customer Profile'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {isCreateMode && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Link to User Account
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                  >
                    {getUsersWithoutCustomer().map(user => (
                      <option key={user.id} value={user.id}>
                        {user.email} ({user.role})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-blue-600 mt-1">
                    Only users without existing customer profiles are shown
                  </p>
                </div>
              )}

              {!isCreateMode && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <p><strong>Linked User:</strong> {getUserEmail(editingCustomer.userId)}</p>
                  <p><strong>Customer ID:</strong> {editingCustomer.id}</p>
                  <p><strong>Created:</strong> {formatDate(editingCustomer.createdAt)}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editingCustomer.firstName || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editingCustomer.lastName || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingCustomer.phoneNumber || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={editingCustomer.gender || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={editingCustomer.dateOfBirth || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingCustomer.address || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editingCustomer.city || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                  <input
                    type="text"
                    value={editingCustomer.state || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={editingCustomer.postalCode || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={editingCustomer.country || ''}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-secondary hover:bg-secondary/90">
                <Save className="h-4 w-4 mr-2" />
                {isCreateMode ? 'Create Profile' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Search, Edit2, Trash2, Loader2, AlertCircle, X, Save } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import axios from 'axios'

interface UserInformation {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  gender?: string
  phoneNumber?: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  createdAt: string
  updatedAt?: string
}

export default function UserInformationManagement() {
  const [userInfos, setUserInfos] = useState<UserInformation[]>([])
  const [filteredInfos, setFilteredInfos] = useState<UserInformation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingInfo, setEditingInfo] = useState<UserInformation | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchUserInformation()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = userInfos.filter(info => 
        info.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.phoneNumber?.includes(searchTerm)
      )
      setFilteredInfos(filtered)
    } else {
      setFilteredInfos(userInfos)
    }
  }, [searchTerm, userInfos])

  const fetchUserInformation = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/admin/user-information', { withCredentials: true })
      setUserInfos(response.data)
      setFilteredInfos(response.data)
    } catch (err: any) {
      console.error('Error fetching user information:', err)
      setError('Failed to load user information')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (info: UserInformation) => {
    setEditingInfo({
      ...info,
      dateOfBirth: info.dateOfBirth ? new Date(info.dateOfBirth).toISOString().split('T')[0] : ''
    })
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleSave = async () => {
    if (!editingInfo) return

    try {
      setError(null)
      setSuccess(null)

      const payload = {
        firstName: editingInfo.firstName || null,
        lastName: editingInfo.lastName || null,
        gender: editingInfo.gender || null,
        phoneNumber: editingInfo.phoneNumber || null,
        dateOfBirth: editingInfo.dateOfBirth ? new Date(editingInfo.dateOfBirth).toISOString() : null,
        address: editingInfo.address || null,
        city: editingInfo.city || null,
        state: editingInfo.state || null,
        country: editingInfo.country || null,
        postalCode: editingInfo.postalCode || null,
      }

      await axios.put(`/admin/users/${editingInfo.userId}/information`, payload, { withCredentials: true })
      
      setSuccess('User information updated successfully!')
      setIsModalOpen(false)
      setEditingInfo(null)
      await fetchUserInformation()
    } catch (err: any) {
      console.error('Error updating user information:', err)
      setError(err.response?.data?.message || 'Failed to update user information')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user information?')) return

    try {
      setError(null)
      setSuccess(null)
      await axios.delete(`/admin/users/${userId}/information`, { withCredentials: true })
      setSuccess('User information deleted successfully!')
      await fetchUserInformation()
    } catch (err: any) {
      console.error('Error deleting user information:', err)
      setError(err.response?.data?.message || 'Failed to delete user information')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingInfo) return
    setEditingInfo({
      ...editingInfo,
      [e.target.name]: e.target.value,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Information Management</h1>
          <p className="text-muted-foreground mt-1">Manage user profile information</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
          <AlertCircle className="h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Gender</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Date of Birth</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInfos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No user information found
                  </td>
                </tr>
              ) : (
                filteredInfos.map((info) => (
                  <tr key={info.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">
                        {info.firstName && info.lastName ? `${info.firstName} ${info.lastName}` : 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{info.gender || 'N/A'}</td>
                    <td className="py-3 px-4 text-muted-foreground">{info.phoneNumber || 'N/A'}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {info.city && info.country ? `${info.city}, ${info.country}` : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {info.dateOfBirth ? new Date(info.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(info)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4 text-secondary" />
                        </button>
                        <button
                          onClick={() => handleDelete(info.userId)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && editingInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Edit User Information</h2>
                <button
                  onClick={() => { setIsModalOpen(false); setEditingInfo(null); }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editingInfo.firstName || ''}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editingInfo.lastName || ''}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={editingInfo.gender || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editingInfo.phoneNumber || ''}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editingInfo.dateOfBirth || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editingInfo.address || ''}
                    onChange={handleInputChange}
                    placeholder="Enter street address"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={editingInfo.city || ''}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={editingInfo.state || ''}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={editingInfo.country || ''}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={editingInfo.postalCode || ''}
                    onChange={handleInputChange}
                    placeholder="Enter postal code"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => { setIsModalOpen(false); setEditingInfo(null); }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

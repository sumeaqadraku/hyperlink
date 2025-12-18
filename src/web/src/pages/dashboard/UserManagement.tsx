import { useState, useEffect } from 'react'
import { Search, Plus, Edit2, Trash2, Loader2, AlertCircle, X, Save, UserCheck, UserX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { userService, UserDto, CreateUserRequest, UpdateUserRequest } from '@/services/userService'

export default function UserManagement() {
  const [users, setUsers] = useState<UserDto[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<UserDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [newUser, setNewUser] = useState<CreateUserRequest>({ email: '', password: '', role: 'User' })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getAll()
      setUsers(data)
      setFilteredUsers(data)
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError('Failed to load users. Make sure you have admin privileges.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: UserDto) => {
    setEditingUser({ ...user })
    setIsCreateMode(false)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleCreate = () => {
    setNewUser({ email: '', password: '', role: 'User' })
    setIsCreateMode(true)
    setIsModalOpen(true)
    setError(null)
    setSuccess(null)
  }

  const handleSaveEdit = async () => {
    if (!editingUser) return

    try {
      setError(null)
      const payload: UpdateUserRequest = {
        email: editingUser.email,
        role: editingUser.role,
        isActive: editingUser.isActive,
      }

      await userService.update(editingUser.id, payload)
      setSuccess('User updated successfully!')
      setIsModalOpen(false)
      setEditingUser(null)
      await fetchUsers()
    } catch (err: any) {
      console.error('Error updating user:', err)
      setError(err.response?.data?.message || 'Failed to update user')
    }
  }

  const handleSaveCreate = async () => {
    if (!newUser.email || !newUser.password) {
      setError('Email and password are required')
      return
    }

    try {
      setError(null)
      await userService.create(newUser)
      setSuccess('User created successfully!')
      setIsModalOpen(false)
      setNewUser({ email: '', password: '', role: 'User' })
      await fetchUsers()
    } catch (err: any) {
      console.error('Error creating user:', err)
      setError(err.response?.data?.message || 'Failed to create user')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      setError(null)
      await userService.delete(userId)
      setSuccess('User deleted successfully!')
      await fetchUsers()
    } catch (err: any) {
      console.error('Error deleting user:', err)
      setError(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and access (Identity Service)</p>
        </div>
        <Button onClick={handleCreate} className="bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4 mr-2" /> New User
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
            placeholder="Search by email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-900">Users ({filteredUsers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Updated</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.isActive ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <UserCheck className="h-4 w-4" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600">
                          <UserX className="h-4 w-4" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {isCreateMode ? 'Create New User' : 'Edit User'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {isCreateMode ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="user@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </>
              ) : editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editingUser.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'active' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p>User ID: {editingUser.id}</p>
                    <p>Created: {formatDate(editingUser.createdAt)}</p>
                  </div>
                </>
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
              <Button 
                onClick={isCreateMode ? handleSaveCreate : handleSaveEdit}
                className="bg-secondary hover:bg-secondary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isCreateMode ? 'Create User' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService, CustomerDto, UpdateCustomerRequest } from '@/services/customerService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { Edit2, Save, X, Loader2, User } from 'lucide-react'

export default function MyProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<CustomerDto>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => customerService.getMyProfile(),
    enabled: !!user,
  })

  const updateMutation = useMutation({
    mutationFn: (data: UpdateCustomerRequest) => customerService.updateMyProfile(data),
    onSuccess: () => {
      setSuccess('Profile updated successfully!')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      refetch()
    },
    onError: () => {
      setError('Failed to update profile')
    },
  })

  const createMutation = useMutation({
    mutationFn: () => customerService.createMyProfile({
      email: user?.email || '',
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postalCode,
      country: formData.country,
    } as any),
    onSuccess: () => {
      setSuccess('Profile created successfully!')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
      refetch()
    },
    onError: () => {
      setError('Failed to create profile')
    },
  })

  const handleEdit = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
      address: profile?.address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      postalCode: profile?.postalCode || '',
      country: profile?.country || '',
    })
    setIsEditing(true)
    setError(null)
    setSuccess(null)
  }

  const handleSave = () => {
    if (profile) {
      updateMutation.mutate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      })
    } else {
      createMutation.mutate()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({})
    setError(null)
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-8 text-center">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  const hasProfile = profile && profile.id

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Profile
          </CardTitle>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              {hasProfile ? 'Edit' : 'Create Profile'}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              {success}
            </div>
          )}

          {!hasProfile && !isEditing ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">You haven't created a profile yet.</p>
              <Button onClick={handleEdit} className="bg-secondary hover:bg-secondary/90">
                Create Profile
              </Button>
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <input
                    type="tel"
                    value={formData.phoneNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label>State/Province</Label>
                  <input
                    type="text"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <input
                    type="text"
                    value={formData.postalCode || ''}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <input
                    type="text"
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="bg-secondary hover:bg-secondary/90"
                  disabled={updateMutation.isPending || createMutation.isPending}
                >
                  {(updateMutation.isPending || createMutation.isPending) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500 text-sm">First Name</Label>
                <div className="mt-1 font-medium">{profile?.firstName || '-'}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-sm">Last Name</Label>
                <div className="mt-1 font-medium">{profile?.lastName || '-'}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-sm">Email</Label>
                <div className="mt-1 font-medium">{profile?.email || user?.email}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-sm">Phone</Label>
                <div className="mt-1 font-medium">{profile?.phoneNumber || '-'}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-sm">Address</Label>
                <div className="mt-1 font-medium">{profile?.address || '-'}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-sm">City</Label>
                <div className="mt-1 font-medium">{profile?.city || '-'}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-sm">State/Province</Label>
                <div className="mt-1 font-medium">{profile?.state || '-'}</div>
              </div>
              <div>
                <Label className="text-gray-500 text-sm">Country</Label>
                <div className="mt-1 font-medium">{profile?.country || '-'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

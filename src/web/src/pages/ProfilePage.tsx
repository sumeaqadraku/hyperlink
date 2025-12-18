import { useState, useEffect } from 'react'
import { User, Lock, LogOut, Calendar, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface UserInformation {
  id?: string
  userId?: string
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
}

interface UserData {
  id: string
  email: string
  role: string
  isActive: boolean
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userInfo, setUserInfo] = useState<UserInformation>({})
  const [originalUserInfo, setOriginalUserInfo] = useState<UserInformation>({})
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchUserData()
  }, [user, navigate])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [userResponse, infoResponse] = await Promise.all([
        axios.get('/users/me', { withCredentials: true }),
        axios.get('/users/me/information', { withCredentials: true })
      ])
      
      setUserData(userResponse.data)
      
      if (infoResponse.data && !infoResponse.data.message) {
        const info = infoResponse.data
        const formattedInfo = {
          ...info,
          dateOfBirth: info.dateOfBirth ? new Date(info.dateOfBirth).toISOString().split('T')[0] : ''
        }
        setUserInfo(formattedInfo)
        setOriginalUserInfo(formattedInfo)
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const payload = {
        firstName: userInfo.firstName || null,
        lastName: userInfo.lastName || null,
        gender: userInfo.gender || null,
        phoneNumber: userInfo.phoneNumber || null,
        dateOfBirth: userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).toISOString() : null,
        address: userInfo.address || null,
        city: userInfo.city || null,
        state: userInfo.state || null,
        country: userInfo.country || null,
        postalCode: userInfo.postalCode || null,
      }
      
      if (userInfo.id) {
        await axios.put('/users/me/information', payload, { withCredentials: true })
      } else {
        await axios.post('/users/me/information', payload, { withCredentials: true })
      }
      
      setSuccess('Profile updated successfully!')
      await fetchUserData()
    } catch (err: any) {
      console.error('Error saving profile:', err)
      setError(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match')
        return
      }
      
      if (passwordData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }
      
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      await axios.post('/users/me/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, { withCredentials: true })
      
      setSuccess('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      console.error('Error changing password:', err)
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  const handleDiscard = () => {
    setUserInfo(originalUserInfo)
    setError(null)
    setSuccess(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
            <AlertCircle className="h-5 w-5" />
            <span>{success}</span>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border p-6">
              {/* User Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-semibold">
                    {userInfo.firstName?.[0] || user?.email?.[0] || 'U'}{userInfo.lastName?.[0] || user?.email?.[1] || 'S'}
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : user?.email}
                </h3>
                <p className="text-sm text-muted-foreground">{userData?.role || 'User'}</p>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => { setActiveTab('personal'); setError(null); setSuccess(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === 'personal'
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">Personal Information</span>
                </button>
                <button
                  onClick={() => { setActiveTab('password'); setError(null); setSuccess(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === 'password'
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                  <span className="font-medium">Login & Password</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left text-foreground hover:bg-muted"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Log Out</span>
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {activeTab === 'personal' && (
              <Card className="bg-card border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Personal Information</h2>

                <div className="space-y-6">
                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={userData?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground cursor-not-allowed"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-success font-medium">
                        <span className="h-2 w-2 bg-success rounded-full"></span>
                        Verified
                      </span>
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Gender
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={userInfo.gender === 'Male'}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-secondary border-border focus:ring-secondary"
                        />
                        <span className="text-foreground">Male</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={userInfo.gender === 'Female'}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-secondary border-border focus:ring-secondary"
                        />
                        <span className="text-foreground">Female</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Other"
                          checked={userInfo.gender === 'Other'}
                          onChange={handleInputChange}
                          className="mr-2 h-4 w-4 text-secondary border-border focus:ring-secondary"
                        />
                        <span className="text-foreground">Other</span>
                      </label>
                    </div>
                  </div>

                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={userInfo.firstName || ''}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={userInfo.lastName || ''}
                        onChange={handleInputChange}
                        placeholder="Enter last name"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                  </div>

                  {/* Phone Number & Date of Birth */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={userInfo.phoneNumber || ''}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={userInfo.dateOfBirth || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={userInfo.address || ''}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  {/* City, State, Country */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={userInfo.city || ''}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={userInfo.state || ''}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={userInfo.country || ''}
                        onChange={handleInputChange}
                        placeholder="Enter country"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={userInfo.postalCode || ''}
                      onChange={handleInputChange}
                      placeholder="Enter postal code"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleDiscard}
                      disabled={saving}
                      className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
                    >
                      Discard Changes
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-secondary hover:bg-secondary/90"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card className="bg-card border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Change Password</h2>

                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>

                  <Button
                    size="lg"
                    onClick={handleChangePassword}
                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full bg-secondary hover:bg-secondary/90"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

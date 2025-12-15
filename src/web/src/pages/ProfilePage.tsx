import { useState } from 'react'
import { User, Lock, LogOut, Edit2, Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    gender: 'male',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@corewave.com',
    address: '3605 Parker Rd.',
    phone: '(405) 555-0128',
    dateOfBirth: '1 Feb, 1995',
    location: 'Atlanta, USA',
    postalCode: '30301',
  })

  const [activeTab, setActiveTab] = useState('personal')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    console.log('Saving changes:', formData)
    // Add your save logic here
  }

  const handleDiscard = () => {
    console.log('Discarding changes')
    // Reset form or navigate away
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border p-6">
              {/* User Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-semibold">
                    {formData.firstName[0]}{formData.lastName[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-secondary rounded-full flex items-center justify-center text-white hover:bg-secondary/90 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">Premium Member</p>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('personal')}
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
                  onClick={() => setActiveTab('password')}
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
                  onClick={() => console.log('Logout')}
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
            <Card className="bg-card border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Personal Information</h2>

              <div className="space-y-6">
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
                        value="male"
                        checked={formData.gender === 'male'}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-secondary border-border focus:ring-secondary"
                      />
                      <span className="text-foreground">Male</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === 'female'}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 text-secondary border-border focus:ring-secondary"
                      />
                      <span className="text-foreground">Female</span>
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
                      value={formData.firstName}
                      onChange={handleInputChange}
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
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-success font-medium">
                      <span className="h-2 w-2 bg-success rounded-full"></span>
                      Verified
                    </span>
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
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>

                {/* Phone Number & Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Location & Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary appearance-none"
                      >
                        <option value="Atlanta, USA">Atlanta, USA</option>
                        <option value="New York, USA">New York, USA</option>
                        <option value="Los Angeles, USA">Los Angeles, USA</option>
                        <option value="Chicago, USA">Chicago, USA</option>
                      </select>
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleDiscard}
                    className="flex-1 border-secondary text-secondary hover:bg-secondary/10"
                  >
                    Discard Changes
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSave}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

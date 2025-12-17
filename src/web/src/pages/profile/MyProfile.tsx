import { useQuery } from '@tanstack/react-query'
import { customerService } from '@/services/customerService'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/Label'

export default function MyProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => customerService.getMyProfile(),
  })

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">Unable to load profile. Please sign in.</div>

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <div className="mt-1">{data?.firstName}</div>
            </div>
            <div>
              <Label>Last Name</Label>
              <div className="mt-1">{data?.lastName}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="mt-1">{data?.email}</div>
            </div>
            <div>
              <Label>Phone</Label>
              <div className="mt-1">{data?.phoneNumber}</div>
            </div>
            <div>
              <Label>Address</Label>
              <div className="mt-1">{data?.address}</div>
            </div>
            <div>
              <Label>City</Label>
              <div className="mt-1">{data?.city}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

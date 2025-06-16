import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { BusinessInfo } from '@/types'
import { Save, Building2 } from 'lucide-react'

const BusinessInfoPage = () => {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "Rosa's Cafe",
    address: "123 Main Street, Anytown, State 12345",
    phone: "(555) 123-4567",
    hours: "Mon-Thu: 7AM-9PM, Fri-Sat: 7AM-10PM, Sun: 8AM-8PM",
    logoUrl: "/images/rosas-logo.png"
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Mock API call - will be replaced with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Business information updated successfully!')
    } catch (error) {
      toast.error('Failed to update business information')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Building2 className="h-8 w-8 mr-3" />
          Business Information
        </h1>
        <p className="text-gray-600 mt-2">
          Update your restaurant's basic information and contact details
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Restaurant Details</CardTitle>
          <CardDescription>
            This information will be displayed to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Restaurant Name</Label>
            <Input
              id="name"
              value={businessInfo.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter restaurant name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={businessInfo.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={businessInfo.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Operating Hours</Label>
            <textarea
              id="hours"
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={businessInfo.hours}
              onChange={(e) => handleInputChange('hours', e.target.value)}
              placeholder="Enter operating hours"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={businessInfo.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              placeholder="Enter logo image URL"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BusinessInfoPage
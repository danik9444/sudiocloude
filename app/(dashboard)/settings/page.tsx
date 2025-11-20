'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { Building2, Mail, Phone, MapPin, Save, Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    studio_name: '',
    email: '',
    phone: '',
    address: ''
  })
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadStudioData()
  }, [])

  const loadStudioData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: studio, error } = await supabase
        .from('studios')
        .select('studio_name, email, phone, address')
        .eq('owner_id', user.id)
        .single()

      if (error) throw error

      if (studio) {
        setFormData({
          studio_name: studio.studio_name || '',
          email: studio.email || '',
          phone: studio.phone || '',
          address: studio.address || ''
        })
      }
    } catch (error) {
      console.error('Error loading studio data:', error)
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לטעון את הנתונים',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('studios')
        .update({
          studio_name: formData.studio_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        })
        .eq('owner_id', user.id)

      if (error) throw error

      toast({
        title: 'נשמר בהצלחה! ✅',
        description: 'הפרטים עודכנו במערכת',
      })
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לשמור את השינויים',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          הגדרות
        </h1>
        <p className="text-muted-foreground mt-2">
          נהל את פרטי הסטודיו שלך
        </p>
      </div>

      {/* Studio Settings */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            פרטי הסטודיו
          </CardTitle>
          <CardDescription>
            עדכן את המידע על הסטודיו שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="studio_name" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              שם הסטודיו
            </Label>
            <Input
              id="studio_name"
              placeholder="סטודיו הצילום שלי"
              value={formData.studio_name}
              onChange={(e) => setFormData({ ...formData, studio_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              אימייל
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="studio@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              טלפון
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="050-1234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              כתובת
            </Label>
            <Textarea
              id="address"
              placeholder="רחוב, עיר, מיקוד"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  שמור שינויים
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">התנתקות</CardTitle>
          <CardDescription>
            התנתק מהמערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            <LogOut className="ml-2 h-4 w-4" />
            התנתק
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

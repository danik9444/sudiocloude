'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { UserPlus, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      // If signup was successful and we have a user, create their studio and profile
      if (authData.user) {
        // 1. Create studio
        const { data: newStudio, error: studioError } = await supabase
          .from('studios')
          .insert({
            name: 'הסטודיו שלי',
            email: email,
            phone: '',
            whatsapp_number: '972500000000', // Placeholder, can be updated in settings
            plan_tier: 'free',
            is_active: true
          })
          .select()
          .single()

        if (studioError) {
          console.error('Error creating studio:', studioError)
          throw studioError
        }

        // 2. Create user profile linked to studio
        if (newStudio) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              studio_id: newStudio.id,
              role: 'owner',
              full_name: email.split('@')[0] // Use email username as initial name
            })

          if (profileError) {
            console.error('Error creating profile:', profileError)
            // Don't throw - studio was created successfully
          }
        }
      }

      toast({
        title: 'ברוך הבא! 🎉',
        description: 'החשבון נוצר בהצלחה. מעביר לדשבורד...',
      })

      // Redirect to dashboard instead of login
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1000)
    } catch (error) {
      toast({
        title: 'שגיאה ביצירת חשבון',
        description: error instanceof Error ? error.message : 'לא הצלחנו ליצור חשבון',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl w-fit shadow-lg animate-pulse">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold text-white">הרשמה</CardTitle>
          <CardDescription className="text-slate-400">
            צור חשבון חדש והתחל לנהל את הפרויקטים שלך
          </CardDescription>
        </div>
        {/* Features badges */}
        <div className="flex flex-wrap gap-2 justify-center pt-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
            <Sparkles className="h-3 w-3" />
            חינם לחלוטין
          </div>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs text-purple-400">
            <Sparkles className="h-3 w-3" />
            ללא כרטיס אשראי
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">אימייל</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">סיסמה</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="לפחות 6 תווים"
                className="pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-slate-500">הסיסמה חייבת להכיל לפחות 6 תווים</p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50 hover:shadow-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                יוצר חשבון...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                צור חשבון חינם
                <ArrowLeft className="h-5 w-5" />
              </span>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/50 px-2 text-slate-400">או</span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400">
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors">
              התחבר כאן
            </Link>
          </p>

          <p className="text-xs text-center text-slate-500 pt-2">
            בהרשמה אתה מסכים ל
            <Link href="#" className="underline hover:text-slate-400">תנאי השימוש</Link>
            {' '}ול
            <Link href="#" className="underline hover:text-slate-400">מדיניות הפרטיות</Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

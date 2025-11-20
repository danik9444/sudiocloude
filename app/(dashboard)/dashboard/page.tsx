import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Folder, HardDrive } from 'lucide-react'
import { formatFileSize } from '@/lib/b2/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user's studio
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('studio:studios(*)')
    .eq('id', user.id)
    .single()

  // Get project stats
  const { data: projects } = await supabase
    .from('projects')
    .select('status, total_size')

  const stats = {
    upcoming: projects?.filter((p) => p.status === 'upcoming').length || 0,
    inProgress: projects?.filter((p) => p.status === 'in_progress').length || 0,
    totalStorage: projects?.reduce((acc, p) => acc + p.total_size, 0) || 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">דשבורד</h1>
        <p className="text-muted-foreground">
          ברוך הבא, {(profile as any)?.studio?.name || 'משתמש'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              פרויקטים עתידיים
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              פרויקטים בעבודה
            </CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              אחסון בשימוש
            </CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(stats.totalStorage)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>צעדים הבאים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">צור פרויקט ראשון</p>
              <p className="text-sm text-muted-foreground">
                התחל לנהל את האירועים שלך
              </p>
            </div>
            <Button asChild>
              <Link href="/projects">לפרויקטים</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

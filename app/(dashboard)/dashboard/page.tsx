import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Folder, HardDrive, TrendingUp, Plus, ArrowUpRight, Video, Image, Clock, CheckCircle2 } from 'lucide-react'
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
    .select('status, total_size, project_name, event_date')
    .order('created_at', { ascending: false })

  const stats = {
    upcoming: projects?.filter((p) => p.status === 'upcoming').length || 0,
    inProgress: projects?.filter((p) => p.status === 'in_progress').length || 0,
    completed: projects?.filter((p) => p.status === 'completed').length || 0,
    totalStorage: projects?.reduce((acc, p) => acc + p.total_size, 0) || 0,
    totalProjects: projects?.length || 0,
  }

  const studioName = (profile as any)?.studio?.name || 'משתמש'

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">שלום, {studioName}! 👋</h1>
              <p className="text-blue-100 text-lg">הנה מה שקורה היום בסטודיו שלך</p>
            </div>
            <Button asChild size="lg" variant="secondary" className="shadow-xl hover:scale-105 transition-transform">
              <Link href="/projects">
                <Plus className="ml-2 h-5 w-5" />
                פרויקט חדש
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              פרויקטים עתידיים
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              מתוכנן לתאריכים הקרובים
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-purple-200 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              בעבודה
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Folder className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              פרויקטים פעילים כרגע
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              הושלמו
            </CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              פרויקטים שהסתיימו
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-orange-200 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              אחסון בשימוש
            </CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <HardDrive className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {formatFileSize(stats.totalStorage)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              מסך {stats.totalProjects} פרויקטים
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              צעדים מהירים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-between h-auto p-4 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 transition-colors group">
              <Link href="/projects">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Folder className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <p className="font-medium">צור פרויקט חדש</p>
                    <p className="text-sm text-muted-foreground">התחל לנהל אירוע חדש</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-between h-auto p-4 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:border-purple-200 transition-colors group">
              <Link href="/projects">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Image className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <p className="font-medium">העלה קבצים</p>
                    <p className="text-sm text-muted-foreground">הוסף תמונות וסרטונים</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full justify-between h-auto p-4 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 transition-colors group">
              <Link href="/projects">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Video className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-right">
                    <p className="font-medium">נהל פרויקטים</p>
                    <p className="text-sm text-muted-foreground">צפה ועדכן פרויקטים קיימים</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              פרויקטים אחרונים
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <div className="space-y-3">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.project_name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                        <Folder className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{project.project_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.event_date).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {project.status === 'upcoming' && 'עתידי'}
                      {project.status === 'in_progress' && 'בעבודה'}
                      {project.status === 'completed' && 'הושלם'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">אין פרויקטים עדיין</p>
                <Button asChild size="sm">
                  <Link href="/projects">
                    <Plus className="ml-2 h-4 w-4" />
                    צור פרויקט ראשון
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

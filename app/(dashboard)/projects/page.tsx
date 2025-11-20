'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, Folder, Image as ImageIcon, Video, Search, Filter, MoreVertical, Download, Share2, Trash2 } from 'lucide-react'
import { useProjects } from '@/hooks/use-projects'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatFileSize } from '@/lib/b2/utils'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function ProjectsPage() {
  const { projects, isLoading } = useProjects()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-600 border-blue-200'
      case 'in_progress':
        return 'bg-purple-500/10 text-purple-600 border-purple-200'
      case 'in_backup':
        return 'bg-orange-500/10 text-orange-600 border-orange-200'
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-200'
      case 'archived':
        return 'bg-gray-500/10 text-gray-600 border-gray-200'
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'עתידי'
      case 'in_progress':
        return 'בעבודה'
      case 'in_backup':
        return 'בגיבוי'
      case 'completed':
        return 'הושלם'
      case 'archived':
        return 'בארכיון'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            הפרויקטים שלי
          </h1>
          <p className="text-muted-foreground mt-2">
            נהל את כל הפרויקטים והאירועים במקום אחד
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
              <Plus className="ml-2 h-5 w-5" />
              פרויקט חדש
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl">צור פרויקט חדש</DialogTitle>
              <DialogDescription>
                הוסף פרויקט או אירוע חדש למערכת
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם הפרויקט</Label>
                <Input id="name" placeholder="חתונת דני ורונית" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">תאריך האירוע</Label>
                <Input id="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">סטטוס</Label>
                <Select defaultValue="upcoming">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">עתידי</SelectItem>
                    <SelectItem value="in_progress">בעבודה</SelectItem>
                    <SelectItem value="in_backup">בגיבוי</SelectItem>
                    <SelectItem value="completed">הושלם</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">הערות</Label>
                <Textarea id="notes" placeholder="הערות נוספות על הפרויקט..." rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <DialogTrigger asChild>
                <Button variant="outline">ביטול</Button>
              </DialogTrigger>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                צור פרויקט
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="חפש פרויקט..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="ml-2 h-4 w-4" />
            <SelectValue placeholder="סנן לפי סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסטטוסים</SelectItem>
            <SelectItem value="upcoming">עתידי</SelectItem>
            <SelectItem value="in_progress">בעבודה</SelectItem>
            <SelectItem value="in_backup">בגיבוי</SelectItem>
            <SelectItem value="completed">הושלם</SelectItem>
            <SelectItem value="archived">בארכיון</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* Gradient top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                      <Folder className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                        {project.project_name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(project.event_date), 'dd MMMM yyyy', { locale: he })}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Share2 className="ml-2 h-4 w-4" />
                        שתף
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="ml-2 h-4 w-4" />
                        הורד הכל
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="ml-2 h-4 w-4" />
                        מחק
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Status Badge */}
                <Badge variant="outline" className={`${getStatusColor(project.status)} border`}>
                  {getStatusLabel(project.status)}
                </Badge>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      גודל
                    </p>
                    <p className="text-sm font-semibold">{formatFileSize(project.total_size)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Video className="h-3 w-3" />
                      סטטוס
                    </p>
                    <p className="text-sm font-semibold">{getStatusLabel(project.status)}</p>
                  </div>
                </div>

                {/* Notes preview */}
                {project.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t">
                    {project.notes}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    פתח פרויקט
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full mb-6">
              <Folder className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">אין פרויקטים עדיין</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              צור את הפרויקט הראשון שלך והתחל לנהל את האירועים בצורה מקצועית
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  <Plus className="ml-2 h-5 w-5" />
                  צור פרויקט ראשון
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">צור פרויקט חדש</DialogTitle>
                  <DialogDescription>
                    הוסף פרויקט או אירוע חדש למערכת
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם הפרויקט</Label>
                    <Input id="name" placeholder="חתונת דני ורונית" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">תאריך האירוע</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">סטטוס</Label>
                    <Select defaultValue="upcoming">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">עתידי</SelectItem>
                        <SelectItem value="in_progress">בעבודה</SelectItem>
                        <SelectItem value="in_backup">בגיבוי</SelectItem>
                        <SelectItem value="completed">הושלם</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">הערות</Label>
                    <Textarea id="notes" placeholder="הערות נוספות על הפרויקט..." rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <DialogTrigger asChild>
                    <Button variant="outline">ביטול</Button>
                  </DialogTrigger>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    צור פרויקט
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

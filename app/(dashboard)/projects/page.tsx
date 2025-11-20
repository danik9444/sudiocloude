'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">פרויקטים</h1>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          פרויקט חדש
        </Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center text-muted-foreground">
          <p>טוען פרויקטים...</p>
        </CardContent>
      </Card>
    </div>
  )
}

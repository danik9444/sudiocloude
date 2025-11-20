import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">הגדרות</h1>

      <Card>
        <CardHeader>
          <CardTitle>הגדרות חשבון</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">הגדרות בהכנה...</p>
        </CardContent>
      </Card>
    </div>
  )
}

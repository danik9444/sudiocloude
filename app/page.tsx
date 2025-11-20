import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight">
            סטודיו קלאוד
          </h1>
          <p className="text-xl text-muted-foreground">
            מערכת ניהול פרויקטים ואחסון מתקדמת לצלמי חתונות ואירועים
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Button asChild size="lg">
              <Link href="/signup">
                התחל עכשיו
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">התחבר</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
            {
              title: 'אחסון בענן',
              description: 'שמור את כל חומרי הגלם שלך בענן עם גיבוי אוטומטי',
            },
            {
              title: 'שיתוף קל',
              description: 'שתף פרויקטים עם צלמים וצוות בקלות',
            },
            {
              title: 'אוטומציה מלאה',
              description: 'הודעות WhatsApp אוטומטיות וניהול פרויקטים חכם',
            },
          ].map((feature, i) => (
            <div key={i} className="bg-card p-6 rounded-lg border space-y-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

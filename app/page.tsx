import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Cloud, Share2, Sparkles, Zap, Shield, Video, Upload, Bell, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Cloud,
      title: 'אחסון בענן אינסופי',
      description: 'שמור מאות GB של תמונות וסרטונים עם גיבוי אוטומטי וגישה מכל מקום',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Share2,
      title: 'שיתוף חכם',
      description: 'שתף פרויקטים עם צלמים חיצוניים בקליק אחד עם קישורי גישה מאובטחים',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Bell,
      title: 'התראות WhatsApp אוטומטיות',
      description: 'עדכן לקוחות אוטומטית כשהפרויקט מוכן עם הודעות מותאמות אישית',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Video,
      title: 'סטרימינג וידאו מתקדם',
      description: 'צפייה בסרטונים ישירות בדפדפן עם נגן מתקדם ואיכות HD',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Zap,
      title: 'הורדות מהירות',
      description: 'CDN של Cloudflare מבטיח הורדות במהירות הבזק מכל מקום בעולם',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'אבטחה מקסימלית',
      description: 'הצפנה מלאה, גיבויים אוטומטיים ו-RLS לשמירה על הפרטיות שלך',
      gradient: 'from-indigo-500 to-purple-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24 pb-32">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300 font-medium">הפלטפורמה המובילה לצלמי אירועים</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-7xl md:text-8xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                סטודיו קלאוד
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              מערכת ניהול פרויקטים ואחסון מתקדמת
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold"> לצלמי חתונות ואירועים</span>
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">∞</div>
                <div className="text-sm text-slate-400">אחסון בענן</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">⚡</div>
                <div className="text-sm text-slate-400">הורדות מהירות</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">🔒</div>
                <div className="text-sm text-slate-400">אבטחה מלאה</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center pt-8">
              <Button asChild size="lg" className="text-lg h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/50 transition-all">
                <Link href="/signup">
                  התחל עכשיו בחינם
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 border-slate-700 hover:border-slate-600 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/50">
                <Link href="/login">התחבר</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 pb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">כל מה שאתה צריך במקום אחד</h2>
            <p className="text-xl text-slate-400">פלטפורמה מלאה לניהול הסטודיו שלך</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="group relative bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                  <div className="relative space-y-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 pb-32">
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative space-y-6">
              <TrendingUp className="w-16 h-16 mx-auto text-white/90" />
              <h2 className="text-4xl md:text-5xl font-bold text-white">מוכן להתחיל?</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                הצטרף למאות צלמים שכבר משתמשים בסטודיו קלאוד לניהול הפרויקטים שלהם
              </p>
              <Button size="lg" variant="secondary" asChild className="text-lg h-14 px-8 shadow-xl hover:scale-105 transition-transform">
                <Link href="/signup">
                  צור חשבון בחינם
                  <ArrowLeft className="mr-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Cloud } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <Cloud className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">סטודיו קלאוד</span>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  )
}

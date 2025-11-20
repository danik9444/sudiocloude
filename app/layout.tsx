import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'סטודיו קלאוד - ניהול פרויקטים לצלמים',
  description: 'מערכת ניהול פרויקטים ואחסון לצלמי חתונות ואירועים',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="font-sans">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

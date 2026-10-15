import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'alignr — Tailor your resume with intent',
  description: 'Use AI to align your resume with the role you want, without inventing your experience.',
  generator: 'alignr',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f6f2',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}

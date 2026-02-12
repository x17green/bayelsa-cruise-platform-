import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/src/components/providers'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blue Waters - Boat Booking Platform | Ministry of Blue Waters',
  description: 'Book safe, reliable, and affordable boat trips across Bayelsa waterways. Experience the beauty of water travel with Blue Waters.',
  keywords: 'boat booking, bayelsa, water transport, cruise, boat rental',
  openGraph: {
    title: 'Blue Waters - Boat Booking Platform',
    description: 'Book safe, reliable, and affordable boat trips across Bayelsa waterways',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

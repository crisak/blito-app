import ConfigureAmplifyClientSide from '@shared/components/ConfigureAmplify'

import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Alerts from './components/Alerts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ilegales',
  description: 'Galería de arte urbano'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        {children}
        <Alerts />
      </body>
    </html>
  )
}

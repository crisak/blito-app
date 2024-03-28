// 'use client'
import ConfigureAmplifyClientSide from '@/app/shared/components/ConfigureAmplify'
import '@aws-amplify/ui-react/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Alerts from './components/Alerts'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    // <ThemeProviderCustom>
    <html
      lang="es"
      style={{
        overflow: 'hidden'
      }}
    >
      <ConfigureAmplifyClientSide />
      <body className={inter.className}>
        {children}
        <Alerts />
      </body>
    </html>
    // </ThemeProviderCustom>
  )
}

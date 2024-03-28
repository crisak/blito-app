'use client'

import { ThemeProvider } from '@aws-amplify/ui-react'

type ThemeProviderPros = Partial<typeof ThemeProvider>

export default function ThemeProviderCustom(props: ThemeProviderPros) {
  // @ts-ignore
  return <ThemeProvider colorMode="system" {...props} />
}

'use client'

import { ThemeProvider, defaultDarkModeOverride } from '@aws-amplify/ui-react'
const theme = {
  name: 'dark',
  overrides: [defaultDarkModeOverride]
}

export default function ThemeProviderCustom(props: any) {
  return (
    <ThemeProvider theme={theme} colorMode={props.colorMode}>
      {props.children}
    </ThemeProvider>
  )
}

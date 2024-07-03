import { ThemeProvider, defaultDarkModeOverride } from '@aws-amplify/ui-react'

const theme = {
  name: 'dark',
  overrides: [defaultDarkModeOverride]
}

export default function ThemeProviderCustom(props: any) {
  return <ThemeProvider theme={theme} colorMode="dark" {...props} />
}

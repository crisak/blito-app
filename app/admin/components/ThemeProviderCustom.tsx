'use client'

import {
  ColorMode,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  defaultDarkModeOverride
} from '@aws-amplify/ui-react'
import * as React from 'react'

export default function ThemeProviderCustom(props: any) {
  const [colorMode, setColorMode] = React.useState<ColorMode>('system')
  const theme = {
    name: 'dark',
    overrides: [defaultDarkModeOverride]
  }

  return (
    <ThemeProvider theme={theme} colorMode={colorMode}>
      <ToggleButtonGroup
        value={colorMode}
        isExclusive
        onChange={(value) => setColorMode(value as ColorMode)}
      >
        <ToggleButton value="light">Light</ToggleButton>
        <ToggleButton value="dark">Dark</ToggleButton>
        <ToggleButton value="system">System</ToggleButton>
      </ToggleButtonGroup>

      {props.children}
    </ThemeProvider>
  )
}

'use client'

import {
  Theme,
  ThemeProvider,
  defaultDarkModeOverride
} from '@aws-amplify/ui-react'
import { useSettingsStore } from '@admin/shared/providers'

const theme: Theme = {
  name: 'dark',
  overrides: [
    {
      ...defaultDarkModeOverride,
      colorMode: 'dark'
      // tokens: {
      //   ...defaultDarkModeOverride.tokens,
      //   components: {
      //     ...defaultDarkModeOverride.tokens?.components,
      //     button: {
      //       ...defaultDarkModeOverride.tokens?.components?.button,
      //       primary: {
      //         ...defaultDarkModeOverride.tokens?.components?.button?.primary,
      //         backgroundColor: '{colors.blue.100}',
      //         _hover: {
      //           backgroundColor: '{colors.blue.90}'
      //         },
      //         _active: {
      //           backgroundColor: '{colors.blue.100}'
      //         },
      //         _focus: {
      //           backgroundColor: '{colors.blue.100}'
      //         }
      //       }
      //     }
      //   }
      // }
      // tokens: {
      //   colors: {
      //     // font: {
      //     //   primary: { value: '{colors.pink.100}' },
      //     //   secondary: { value: '{colors.pink.90}' },
      //     //   tertiary: { value: '{colors.pink.80}' }
      //     // },
      //     background: {
      //       primary: { value: '{colors.blue.10}' },
      //       secondary: { value: '{colors.purple.20}' }
      //       // tertiary: { value: '{colors.purple.40}' }
      //     },
      //     border: {
      //       primary: { value: '{colors.blue.60}' }
      //       //   secondary: { value: '{colors.pink.40}' },
      //       //   tertiary: { value: '{colors.pink.20}' }
      //     }
      //   },
      //   components: {
      //     button: {
      //       primary: {
      //         backgroundColor: '{colors.blue.80}',
      //         _hover: {
      //           backgroundColor: '{colors.blue.90}'
      //         },
      //         _active: {
      //           backgroundColor: '{colors.blue.100}'
      //         },
      //         _focus: {
      //           backgroundColor: '{colors.blue.100}'
      //         }
      //       }
      //     }
      //   }
      // }
    }
  ]
}

type ThemeProviderCustomProps = {
  children: React.ReactNode
}

export default function ThemeProviderCustom(props: ThemeProviderCustomProps) {
  const storeColorMode = useSettingsStore((state) => state.theme.colorMode)

  return (
    <ThemeProvider theme={theme} colorMode={storeColorMode}>
      {props.children}
    </ThemeProvider>
  )
}

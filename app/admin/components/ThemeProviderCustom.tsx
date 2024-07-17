'use client'

import {
  Theme,
  ThemeProvider,
  defaultDarkModeOverride
} from '@aws-amplify/ui-react'

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

export default function ThemeProviderCustom(props: any) {
  return (
    <ThemeProvider theme={theme} colorMode={props.colorMode}>
      {props.children}
    </ThemeProvider>
  )
}

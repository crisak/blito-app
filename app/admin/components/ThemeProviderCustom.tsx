'use client'

import {
  Theme,
  ThemeProvider,
  defaultDarkModeOverride,
  useTheme
} from '@aws-amplify/ui-react'
// const theme = {
//   name: 'dark',
//   overrides: [defaultDarkModeOverride]
// }

const theme: Theme = {
  name: 'my-theme',
  overrides: [
    {
      ...defaultDarkModeOverride,
      colorMode: 'dark',
      tokens: {
        colors: {
          // font: {
          //   primary: { value: '{colors.pink.100}' },
          //   secondary: { value: '{colors.pink.90}' },
          //   tertiary: { value: '{colors.pink.80}' }
          // },
          background: {
            primary: { value: '{colors.blue.10}' },
            secondary: { value: '{colors.purple.20}' }
            // tertiary: { value: '{colors.purple.40}' }
          },
          border: {
            primary: { value: '{colors.blue.60}' }
            //   secondary: { value: '{colors.pink.40}' },
            //   tertiary: { value: '{colors.pink.20}' }
          }
        },
        components: {
          button: {
            primary: {
              backgroundColor: '{colors.blue.80}',
              _hover: {
                backgroundColor: '{colors.blue.90}'
              },
              _active: {
                backgroundColor: '{colors.blue.100}'
              },
              _focus: {
                backgroundColor: '{colors.blue.100}'
              }
            }
          }
        }
      }
    }
  ]
}

export default function ThemeProviderCustom(props: any) {
  const { tokens } = useTheme()

  return (
    <ThemeProvider theme={theme} colorMode={props.colorMode}>
      <nav className="m-2 border-indigo-300 border">
        <span
          style={{
            backgroundColor: `var(${tokens.colors.background.primary.name})`
          }}
        >
          <strong>BG Primary: </strong>
          {tokens.colors.background.primary.name}
        </span>
      </nav>
      {props.children}
    </ThemeProvider>
  )
}

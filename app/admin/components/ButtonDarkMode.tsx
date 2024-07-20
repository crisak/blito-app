'use client'

import {
  ColorMode,
  ToggleButton,
  ToggleButtonGroup
} from '@aws-amplify/ui-react'

import { IconDarkSystem, IconMoon, IconSun } from '@shared/components'
import { useSettingsStore } from '@shared/providers'
import { useShallow } from 'zustand/react/shallow'

export default function ButtonDarkMode() {
  const storeTheme = useSettingsStore(
    useShallow((state) => ({
      theme: state.theme,
      setTheme: state.setTheme
    }))
  )

  return (
    <ToggleButtonGroup
      justifyContent="flex-end"
      value={storeTheme.theme.colorMode}
      isExclusive
      onChange={(value) =>
        storeTheme.setTheme({
          colorMode: value as ColorMode
        })
      }
      size="small"
    >
      <ToggleButton value="light">
        <IconSun fontSize={18} />
      </ToggleButton>
      <ToggleButton value="dark">
        <IconMoon fontSize={18} />
      </ToggleButton>
      <ToggleButton value="system">
        <IconDarkSystem fontSize={18} />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

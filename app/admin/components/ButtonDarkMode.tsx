'use client'

import {
  ColorMode,
  ToggleButton,
  ToggleButtonGroup
} from '@aws-amplify/ui-react'

import { IconDarkSystem, IconMoon, IconSun } from '@admin/shared/icons'
import { useSettingsStore } from '@admin/shared/providers'
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
      isSelectionRequired
      onChange={(value) =>
        storeTheme.setTheme({
          colorMode: value as ColorMode
        })
      }
      size="small"
    >
      <ToggleButton value="light">
        <IconSun fontSize={12} />
      </ToggleButton>
      <ToggleButton value="dark">
        <IconMoon fontSize={12} />
      </ToggleButton>
      <ToggleButton value="system">
        <IconDarkSystem fontSize={12} />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

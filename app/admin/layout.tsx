'use client'
import {
  Button,
  ColorMode,
  ToggleButton,
  ToggleButtonGroup,
  View,
  withAuthenticator
} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import '@aws-amplify/ui-react/styles/base.layer.css' // base styling needed for Amplify UI
import '@aws-amplify/ui-react/styles/button.layer.css' // component specific styles
import '@aws-amplify/ui-react/styles/reset.layer.css' // global CSS reset

import Link from 'next/link'
import * as React from 'react'
import 'react-virtualized/styles.css'
import { IconDarkSystem, IconMoon, IconSun } from '../shared/components'
import { ThemeProviderCustom } from './components'

function AdminLayout({
  children,
  signOut,
  user
}: {
  children: React.ReactNode
  signOut: () => void
  user: any
}) {
  const [colorMode, setColorMode] = React.useState<ColorMode>('system')
  return (
    <ThemeProviderCustom colorMode={colorMode}>
      <View
        as="nav"
        height="4rem"
        className="flex items-center justify-end gap-3 p-3"
      >
        <ToggleButtonGroup
          justifyContent="flex-end"
          value={colorMode}
          isExclusive
          onChange={(value) => setColorMode(value as ColorMode)}
        >
          <ToggleButton value="light">
            <IconSun />
          </ToggleButton>
          <ToggleButton value="dark">
            <IconMoon />
          </ToggleButton>
          <ToggleButton value="system">
            <IconDarkSystem />
          </ToggleButton>
        </ToggleButtonGroup>
        <span>{user?.name || user?.email || user?.username}</span>
        <Button variation="link" onClick={signOut} size="small">
          Sign out
        </Button>
      </View>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr',
          height: 'calc(100vh - 4rem)'
        }}
      >
        <aside>
          <nav>
            <ul>
              <li>
                <Link href="/admin/categorias">Categorias</Link>
              </li>
              <li>
                <Link href="/admin/categorias-v2">Categorias (NEW)</Link>
              </li>
              <li>
                <Link href="/admin/mi-cuenta">Mi cuenta</Link>
              </li>
              <li>
                <Link href="/logout">Cerrar sesion</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <View as="main" padding="large">
          {children}
        </View>
      </div>
    </ThemeProviderCustom>
  )
}

export default withAuthenticator(AdminLayout)

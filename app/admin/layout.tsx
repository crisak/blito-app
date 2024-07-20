'use client'

import {
  Button,
  View,
  withAuthenticator,
  WithAuthenticatorProps
} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import '@aws-amplify/ui-react/styles/base.layer.css' // base styling needed for Amplify UI
import '@aws-amplify/ui-react/styles/button.layer.css' // component specific styles
import '@aws-amplify/ui-react/styles/reset.layer.css' // global CSS reset

import { IconLogout } from '@/app/shared/components'
import Link from 'next/link'
import * as React from 'react'
import 'react-virtualized/styles.css'
import { ButtonDarkMode, ThemeProviderCustom } from './components'

interface Props extends WithAuthenticatorProps {
  isPassedToWithAuthenticator: boolean
  children: React.ReactNode
}

function AdminLayout({ children, signOut, user }: Props) {
  return (
    <ThemeProviderCustom>
      <View
        as="nav"
        backgroundColor="var(--amplify-colors-background-primary)"
        color="var(--amplify-colors-font-primary)"
        height="4rem"
        className="flex items-center justify-end gap-3 p-3"
      >
        <ButtonDarkMode />

        <span>{user?.signInDetails?.loginId}</span>
        <Button variation="link" onClick={signOut} size="small" gap={5}>
          <IconLogout />
          Cerrar sesion
        </Button>
      </View>

      <View
        backgroundColor="var(--amplify-colors-background-primary)"
        color="var(--amplify-colors-font-primary)"
        display="grid"
        style={{
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
      </View>
    </ThemeProviderCustom>
  )
}

export default withAuthenticator(AdminLayout)

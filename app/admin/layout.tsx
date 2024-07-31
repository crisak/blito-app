'use client'

import { IconLogout } from '@admin/shared/icons'
import {
  CategoryStoreProvider,
  SettingsStoreProvider
} from '@admin/shared/providers'
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
    <SettingsStoreProvider>
      <CategoryStoreProvider>
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
              <nav className="flex flex-col">
                <Link
                  style={{
                    borderBottomColor: 'var(--amplify-colors-border-tertiary)'
                  }}
                  className="p-3 border-b opacity-75 hover:opacity-100 transition-all duration-5000"
                  href="/admin/categorias"
                >
                  Categorias
                </Link>
                <Link
                  style={{
                    borderBottomColor: 'var(--amplify-colors-border-tertiary)'
                  }}
                  className="p-3 border-b opacity-75 hover:opacity-100 transition-all duration-5000"
                  href="/admin/mi-cuenta"
                >
                  Mi cuenta
                </Link>
                <Link
                  style={{
                    borderBottomColor: 'var(--amplify-colors-border-tertiary)'
                  }}
                  className="p-3 border-b opacity-75 hover:opacity-100 transition-all duration-5000"
                  href="/logout"
                >
                  Cerrar sesion
                </Link>
              </nav>
            </aside>
            <View as="main" padding="large">
              {children}
            </View>
          </View>
        </ThemeProviderCustom>
      </CategoryStoreProvider>
    </SettingsStoreProvider>
  )
}

export default withAuthenticator(AdminLayout)

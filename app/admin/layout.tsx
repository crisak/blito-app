'use client'

import {
  CategoryStoreProvider,
  SettingsStoreProvider
} from '@admin/shared/providers'
import {
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
import { ContainerContent, ThemeProviderCustom, TopNav } from './components'

interface Props extends WithAuthenticatorProps {
  isPassedToWithAuthenticator: boolean
  children: React.ReactNode
}

function AdminLayout(props: Props) {
  const { children, ...restProps } = props
  return (
    <SettingsStoreProvider>
      <CategoryStoreProvider>
        <ThemeProviderCustom>
          <TopNav {...restProps} />

          <ContainerContent
            asideNav={
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
            }
          >
            {children}
          </ContainerContent>
        </ThemeProviderCustom>
      </CategoryStoreProvider>
    </SettingsStoreProvider>
  )
}

export default withAuthenticator(AdminLayout)

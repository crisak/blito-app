'use client'

import { IconLogout, IconMenu, IconMenuOpen } from '@admin/shared/icons'
import { useSettingsStore } from '@admin/shared/providers'
import { Button, View, WithAuthenticatorProps } from '@aws-amplify/ui-react'
import ButtonDarkMode from './ButtonDarkMode'

interface TopNavProps extends WithAuthenticatorProps {
  isPassedToWithAuthenticator: boolean
}

export default function TopNav(props: TopNavProps) {
  const showNavigation = useSettingsStore((state) => state.showNavigation)
  const toggleNavigation = useSettingsStore((state) => state.toggleNavigation)
  return (
    <View
      as="nav"
      backgroundColor="var(--amplify-colors-background-secondary)"
      color="var(--amplify-colors-font-primary)"
      height="2.5rem"
      className="flex items-center justify-between"
      paddingLeft="large"
      paddingRight="large"
      fontSize=".7rem"
    >
      <Button
        variation="link"
        onClick={() => {
          toggleNavigation()
        }}
      >
        {showNavigation ? <IconMenuOpen /> : <IconMenu />}
      </Button>

      <View className="flex items-center gap-5">
        <ButtonDarkMode />

        <span>{props.user?.signInDetails?.loginId}</span>
        <Button
          variation="link"
          onClick={props.signOut}
          size="small"
          gap={5}
          fontSize=".7rem"
        >
          <IconLogout />
          Cerrar sesion
        </Button>
      </View>
    </View>
  )
}

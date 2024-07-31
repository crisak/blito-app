'use client'
import { useSettingsStore } from '@admin/shared/providers'
import { View } from '@aws-amplify/ui-react'

type ContainerContentProps = React.ComponentPropsWithoutRef<'div'> & {
  asideNav: React.ReactNode
}

export default function ContainerContent(props: ContainerContentProps) {
  const showNavigation = useSettingsStore((state) => state.showNavigation)
  return (
    <View
      className="transition-all duration-300"
      backgroundColor="var(--amplify-colors-background-primary)"
      color="var(--amplify-colors-font-primary)"
      display="grid"
      style={{
        gridTemplateColumns: showNavigation ? '200px 1fr' : '0px 1fr',
        height: 'calc(100vh - 2.5rem)'
      }}
    >
      <aside
        className="transition-all duration-300 overflow-y-auto overflow-hidden"
        style={{
          width: showNavigation ? '200px' : '0px'
        }}
      >
        {props.asideNav}
      </aside>
      <View as="main" padding="large">
        {props.children}
      </View>
    </View>
  )
}

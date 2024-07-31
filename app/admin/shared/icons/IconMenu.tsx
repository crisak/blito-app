import { BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconMenu = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Menu"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
      {...props}
    />
  )
}

export default IconMenu

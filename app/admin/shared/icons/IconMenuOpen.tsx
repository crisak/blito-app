import { BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconMenuOpen = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Menu"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="M120-240v-80h520v80H120Zm664-40L584-480l200-200 56 56-144 144 144 144-56 56ZM120-440v-80h400v80H120Zm0-200v-80h520v80H120Z"
      {...props}
    />
  )
}

export default IconMenuOpen

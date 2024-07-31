import { type BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconLogout = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Logout"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
      {...props}
    />
  )
}

export default IconLogout
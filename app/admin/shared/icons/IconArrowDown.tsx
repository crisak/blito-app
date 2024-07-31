import { BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconArrowDown = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Arrow Down"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"
      {...props}
    />
  )
}

export default IconArrowDown

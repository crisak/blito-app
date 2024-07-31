import { BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconArrowUp = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Arrow Up"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"
      {...props}
    />
  )
}

export default IconArrowUp

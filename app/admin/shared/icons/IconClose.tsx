import { type BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconClose = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Close"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
      {...props}
    />
  )
}

export default IconClose

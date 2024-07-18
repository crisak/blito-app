import { BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconAdd = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Add"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
      {...props}
    />
  )
}

export default IconAdd

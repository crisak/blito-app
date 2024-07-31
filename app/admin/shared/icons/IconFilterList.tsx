import { type BaseIconProps, Icon } from '@aws-amplify/ui-react'

const IconFilterList = (props: BaseIconProps) => {
  return (
    <Icon
      ariaLabel="Filter List"
      viewBox={{
        minX: 0,
        minY: -960,
        width: 960,
        height: 960
      }}
      pathData="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"
      {...props}
    />
  )
}

export default IconFilterList

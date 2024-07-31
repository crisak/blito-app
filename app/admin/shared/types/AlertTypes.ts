export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'default'

export type AlertData = {
  type: AlertType
  message: string
  data?: string | React.ReactNode | null
}

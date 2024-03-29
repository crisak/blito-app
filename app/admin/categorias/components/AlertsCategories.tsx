'use client'
import { useCategoryStore } from '@/app/shared/providers/CategoryStoreProvider'
import { AlertData, AlertType } from '@/app/shared/types'
import { useEffect } from 'react'
import { ExternalToast, toast } from 'sonner'
import { useShallow } from 'zustand/react/shallow'

const showAlert = (alert: AlertData) => {
  let options: ExternalToast = {}

  const hasDetail = Boolean(alert.data)
  if (hasDetail) {
    options = {
      description: <code>{alert.data}</code>
    }
  }

  const switchAlert: Partial<Record<AlertType, () => void>> = {
    error: () => {
      toast.error(alert.message, options)
    },
    warning: () => {
      toast.warning(alert.message, options)
    },
    success: () => {
      toast.success(alert.message, options)
    }
  }

  const fnAlert = switchAlert[alert.type]

  if (typeof fnAlert === 'function') {
    fnAlert()
  }
}

export default function AlertsCategories() {
  const store = useCategoryStore(
    useShallow((state) => ({
      alerts: state.alerts,
      clearAlerts: state.clearAlerts
    }))
  )

  useEffect(() => {
    if (store.alerts?.length) {
      store.alerts.forEach((alert) => {
        showAlert(alert)
      })

      store.clearAlerts()
    }
  }, [store.alerts])

  return null
}

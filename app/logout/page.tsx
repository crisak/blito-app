'use client'

import { signOut } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      await signOut()
      /**
       * router.push = Redirect to the login page, this method is used to navigate to a different page.
       * It is important to note that the router.push method does not reload the page, it only navigates to the new page.
       */
      router.push('/')
    })()
  }, [])

  return null
}

import { createServerRunner } from '@aws-amplify/adapter-nextjs'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api'
import { getCurrentUser } from 'aws-amplify/auth/server'
import { cookies } from 'next/headers'

import { type Schema } from '@/amplify/data/resource'
import outputs from '@/amplify_outputs.json'

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs
})

export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies
})

/**
 * Configure Amplify Server Side
 * @see https://docs.amplify.aws/gen2/start/quickstart/nextjs-app-router-server-components/#configure-amplify-server-side
 */

export async function AuthGetCurrentUserServer() {
  try {
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => getCurrentUser(contextSpec)
    })
    return currentUser
  } catch (error) {
    console.error('AuthGetCurrentUserServer: ', error)
  }
}

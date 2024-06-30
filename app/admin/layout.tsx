'use client'

import { View, withAuthenticator } from '@aws-amplify/ui-react'
import Link from 'next/link'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        height: '100vh'
      }}
    >
      <aside>
        <nav>
          <ul>
            <li>
              <Link href="/admin/categorias">Categorias</Link>
            </li>
            <li>
              <Link href="/admin/mi-cuenta">Mi cuenta</Link>
            </li>
            <li>
              <Link href="/logout">Cerrar sesion</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <View as="main" padding="large">
        {children}
      </View>
    </div>
  )
}

export default withAuthenticator(AdminLayout)

import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="flex flex-col">
      <Link
        style={{
          borderBottomColor: 'var(--amplify-colors-border-tertiary)'
        }}
        className="p-3 border-b opacity-75 hover:opacity-100 transition-all duration-5000"
        href="/admin/categorias"
      >
        Categorias
      </Link>
      <Link
        style={{
          borderBottomColor: 'var(--amplify-colors-border-tertiary)'
        }}
        className="p-3 border-b opacity-75 hover:opacity-100 transition-all duration-5000"
        href="/admin/mi-cuenta"
      >
        Mi cuenta
      </Link>
      <Link
        style={{
          borderBottomColor: 'var(--amplify-colors-border-tertiary)'
        }}
        className="p-3 border-b opacity-75 hover:opacity-100 transition-all duration-5000"
        href="/logout"
      >
        Cerrar sesion
      </Link>
    </nav>
  )
}

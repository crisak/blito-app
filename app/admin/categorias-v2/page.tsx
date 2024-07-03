'use client'

import { AlertsCategories } from '../categorias/components'
import { ListCategories, PaginationCategories } from './components'

export default function CategoryV2Page() {
  return (
    <>
      <h1>Categorías from Amplify</h1>

      <ListCategories />

      <br />

      <PaginationCategories />

      <AlertsCategories />
    </>
  )
}

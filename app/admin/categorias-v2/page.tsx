import { AlertsCategories } from '../categorias/components'
import {
  ButtonUpdateCreate,
  FilterCategories,
  ListCategories,
  PaginationCategories
} from './components'

export default function CategoryV2Page() {
  return (
    <>
      <h1>Categorías from Amplify</h1>

      <FilterCategories>
        <ButtonUpdateCreate />
      </FilterCategories>

      <PaginationCategories />

      <ListCategories />

      <AlertsCategories />
    </>
  )
}

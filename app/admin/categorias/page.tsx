import { cookiesClient } from '@/app/shared/utils/amplifyUtil'

import {
  AlertsCategories,
  CategoriesList,
  FormCategory,
  HeaderList
} from './components'
import PaginationList from './components/PaginationList'

export default async function CategoriesPage() {
  const { data: categories, nextToken } =
    await cookiesClient.models.Category.list()

  return (
    <div>
      <h1>Categorías</h1>

      <FormCategory />
      <br />
      <br />
      <HeaderList pagination={<PaginationList />} />

      <CategoriesList categories={categories} nextToken={nextToken} />

      <AlertsCategories />
    </div>
  )
}

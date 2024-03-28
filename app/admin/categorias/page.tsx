import { cookiesClient } from '@/app/shared/utils/amplifyUtil'

import { AlertsCategories, CategoriesList, FormCategory } from './components'
import PaginationList from './components/PaginationList'

export default async function CategoriesPage() {
  const { data: categories, nextToken } =
    await cookiesClient.models.Category.list()

  console.log('nexToken:', nextToken)
  return (
    <div>
      <h1>Categorías</h1>

      <FormCategory />
      <br />
      <br />
      <CategoriesList categories={categories} nextToken={nextToken} />
      <PaginationList />

      <AlertsCategories />
    </div>
  )
}

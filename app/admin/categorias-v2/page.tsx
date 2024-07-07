import { AlertsCategories } from '../categorias/components'
import {
  ButtonUpdateCreate,
  Filters,
  List,
  Pagination,
  InputSearch,
  TitleList
} from './components'

export default function CategoryV2Page() {
  return (
    <>
      <header className="px-5 pt-5 pb-3 rounded-md mb-5">
        <div className="flex justify-between mb-5">
          <TitleList />
          <ButtonUpdateCreate />
        </div>

        <div className="flex justify-between">
          <Filters className="justify-between">
            <InputSearch />
          </Filters>

          <Pagination />
        </div>
      </header>

      <List />

      <AlertsCategories />
    </>
  )
}

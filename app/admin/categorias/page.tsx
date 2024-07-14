import {
  Alert,
  ButtonUpdateCreate,
  Filters,
  InputSearch,
  List,
  Pagination,
  TitleList
} from './components'

export default function CategoryV2Page() {
  return (
    <>
      <header className="rounded-md mb-5 p-5 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <TitleList />
          <ButtonUpdateCreate />
        </div>

        <div className="flex justify-between items-center">
          <InputSearch />
          <Pagination />
        </div>

        <Filters />
      </header>

      <List />

      <Alert />
    </>
  )
}

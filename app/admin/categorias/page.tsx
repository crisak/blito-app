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
      <header className="px-5 pt-5 pb-3 rounded-md mb-5">
        <div className="flex justify-between mb-5">
          <TitleList />
          <ButtonUpdateCreate />
        </div>
        <div className="flex justify-between mb-5 items-center">
          <InputSearch />
          <Pagination />
        </div>
        <Filters className="justify-between">
          <div className="h-2 w-32 border-red-100"></div>
        </Filters>
      </header>

      <List />

      <Alert />
    </>
  )
}

export type NameFieldFilter = string

export type ValueFieldFilter = string[] | boolean | string | null

export type PopoverFiltersProp = {
  label: string
  name: NameFieldFilter
  type: 'boolean' | 'radio' | 'select' | 'checkbox'
  options: { id: string | boolean; label: string }[]
  value: ValueFieldFilter
}

export type GlobalState = Record<
  NameFieldFilter,
  {
    type: 'boolean' | 'radio' | 'select' | 'checkbox'
    value: ValueFieldFilter
  }
>

export interface Group {
  name: string
  ids: string[]
}

export interface Collection<T> {
  name: string

  groups: Record<string, Group>
  items: Record<string, T>
}

export type Collections<T> = Record<string, Collection<T>>

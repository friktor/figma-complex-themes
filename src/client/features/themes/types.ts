export type CreateFormTarget = "theme" | "group" | "theme_group"

export interface CreateForm {
  target: CreateFormTarget
  type: "paint" | "text"
  theme?: string 
}

export interface Forms {
  create?: CreateForm
}

export interface Group {
  name: string
  ids: string[]
}

export interface Collection<T> {
  type: "theme" | "group"
  name: string

  groups: Record<string, Group>
  items: Record<string, T>
}

export type Collections<T> = Record<string, Collection<T>>

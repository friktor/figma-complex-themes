import { Library, RawPaintStyle, RawStyle, RawTextStyle, SelectionEvent, StyleType } from "models"

export interface ThemesState {
  PAINT: Collections<RawPaintStyle>
  TEXT: Collections<RawTextStyle>

  opened: Record<string, boolean>
  selections: SelectionEvent[]
  library: Library

  editable?: RawStyle
  search?: string

  forms: Forms
}

export type CreateFormTarget = "theme" | "group" | "theme_group"

export interface CreateForm {
  target: CreateFormTarget
  type: StyleType
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

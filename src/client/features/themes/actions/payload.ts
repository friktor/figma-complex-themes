import { RawStyle, StyleType } from "models"

export interface UpdatedStyles {
  type: StyleType
  styles: RawStyle[]
}

export interface SetOpenedGroup {
  // type: StyleType
  opened?: boolean
  group: string
  theme?: string
}

export interface CreateTheme {
  type: string | StyleType
  theme: string
}

export interface CreateGroup {
  type: string | StyleType
  group: string
}

export interface CreateThemeGroup extends CreateTheme {
  group: string
}

export interface CreateStyle {
  styleType: StyleType
  theme?: string
  group?: string
  name?: string
}

export interface RemoveCollection {
  type: StyleType
  name: string

  removed?: string[] // callback
}

export interface RemoveThemeGroup {
  type: StyleType
  theme: string
  group: string

  removed?: string[] // callback
}

export interface RemoveStyle {
  type: StyleType
  collection: string // "theme" | "group"
  id: string // style id

  removed?: string[] // callback
}

export interface CloneCollection {
  type: StyleType
  old: string // old name
  new: string // new name
}

export interface CloneThemeGroup {
  type: StyleType
  theme: string // source theme
  group: string // source group

  new: string // cloned theme group name
}

export interface RenameCollection {
  type: StyleType
  old: string // old name
  new: string // new name
}

export interface RenameThemeGroup {
  type: StyleType
  theme: string // source theme
  group: string // source group

  new: string // cloned theme group name
}

export interface RenameStyle {
  type: StyleType
  collection: string // "theme" | "group"
  id: string // style id

  // new names
  names: {
    group?: string // if has group - also move style in theme between groups
    name: string // new style name
  }
}

export interface AddPaintStyle {
  collection: string
  id: string

  paint?: Paint
}

export interface UpdatePaintStyle {
  collection: string
  id: string

  index: number
  paint: Paint
}

export interface RemovePaintStyle {
  collection: string
  id: string

  index: number
}

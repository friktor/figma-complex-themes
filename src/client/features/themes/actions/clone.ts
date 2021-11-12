import { createAsyncThunk } from "@reduxjs/toolkit"

import { RootState } from "client/features"
import { cloneDeep } from "utils/helpers"
import { styleNames } from "utils/style"
import { Collection } from "../types"
import * as api from "client/api"
import { RawStyle } from "models"

const { values } = Object

interface CloneCollectionParams {
  type: "paint" | "text"
  old: string // old name
  new: string // new name
}

interface CloneThemeGroupParams {
  type: "paint" | "text"
  theme: string // source theme
  group: string // source group

  new: string // cloned theme group name
}

export interface ClonedPayload {
  styles: Array<RawStyle>
  type: "paint" | "text"
}

const renameStyleCollection = (name: string) => (item: RawStyle) => {
  const style = cloneDeep<RawStyle>(item)
  style.base.id = "$temp"

  if (style.base.theme) {
    style.base.theme = name
  } else {
    style.base.group = name
  }

  style.base.fullname = styleNames.generate(style.base.theme, style.base.group, style.base.name)
  return style
}

const renameStyleThemeGroup = (name: string) => (item: RawStyle) => {
  const style = cloneDeep<RawStyle>(item)
  style.base.id = "$temp"
  style.base.group = name

  style.base.fullname = styleNames.generate(style.base.theme, style.base.group, style.base.name)
  return style
}

export const cloneCollection = createAsyncThunk<any, any, { state: RootState }>(
  "themes/cloneCollection",
  async ({ type, ...options }: CloneCollectionParams, { getState }): Promise<ClonedPayload> => {
    const state = getState()
    const collection = state.themes[type][options.old] as Collection<RawStyle>

    const draft = values(collection.items).map(renameStyleCollection(options.new))
    const styles = await api.syncThemeStyles(draft)

    return {
      styles,
      type,
    }
  },
)

export const cloneThemeGroup = createAsyncThunk<any, any, { state: RootState }>(
  "themes/cloneThemeGroup",
  async ({ type, ...options }: CloneThemeGroupParams, { getState }): Promise<ClonedPayload> => {
    const state = getState()
    const collection = state.themes[type]?.[options.theme]
    const groupIds = collection?.groups[options.group].ids

    // prettier-ignore
    const draft = values(collection.items)
      .filter(({ base: { id } }) => (groupIds.includes(id)))
      .map(renameStyleThemeGroup(options.new))

    const styles = await api.syncThemeStyles(draft)

    return {
      styles,
      type,
    }
  },
)
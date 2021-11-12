import { createAsyncThunk } from "@reduxjs/toolkit"

import { RootState } from "client/features"
import { cloneDeep } from "utils/helpers"
import { removeCollection, removeThemeGroup } from "./crud"
import { styleNames } from "utils/style"
import { Collection } from "../types"
import * as api from "client/api"
import { RawStyle } from "models"

const { values } = Object

interface RenameCollectionParams {
  type: "paint" | "text"
  old: string // old name
  new: string // new name
}

interface RenameThemeGroupParams {
  type: "paint" | "text"
  theme: string // source theme
  group: string // source group

  new: string // cloned theme group name
}

const renameStyleCollection = (name: string) => (raw: RawStyle) => {
  const style = cloneDeep(raw)

  if (style.base.theme) {
    style.base.theme = name
  } else {
    style.base.group = name
  }

  style.base.fullname = styleNames.generate(style.base.theme, style.base.group, style.base.name)
  return style
}

const renameStyleThemeGroup = (name: string) => (raw: RawStyle) => {
  const style = cloneDeep(raw)
  style.base.group = name

  style.base.fullname = styleNames.generate(style.base.theme, style.base.group, style.base.name)
  return style
}

export const renameCollection = createAsyncThunk<any, any, { state: RootState }>(
  "themes/renameCollection",
  async ({ type, ...options }: RenameCollectionParams, { getState, dispatch }): Promise<any> => {
    const state = getState()
    const collection = state.themes[type][options.old] as Collection<RawStyle>

    const updatedDraft = values(collection.items).map(renameStyleCollection(options.new))
    const styles = await api.syncThemeStyles(updatedDraft)

    dispatch({
      type: removeCollection.fulfilled.type,
      payload: { name: options.old, type },
    })

    return {
      styles,
      type,
    }
  },
)

export const renameThemeGroup = createAsyncThunk<any, any, { state: RootState }>(
  "themes/renameThemeGroup",
  async ({ type, ...options }: RenameThemeGroupParams, { getState, dispatch }): Promise<any> => {
    const state = getState()
    const collection = state.themes[type]?.[options.theme]
    const groupIds = collection?.groups[options.group].ids

    // prettier-ignore
    const draft = values(collection.items)
      .filter(({ base: { id } }) => (groupIds.includes(id)))
      .map(renameStyleThemeGroup(options.new))

    const styles = await api.syncThemeStyles(draft)

    dispatch({
      type: removeThemeGroup.fulfilled.type,
      payload: { theme: options.theme, group: options.group, type },
    })

    return {
      styles,
      type,
    }
  },
)

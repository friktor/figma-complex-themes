import { createAsyncThunk } from "@reduxjs/toolkit"

import { RootState } from "client/features"
import { updateStylename } from "./helpers"
import { cloneDeep } from "utils/helpers"
import { Collection } from "../types"
import * as Payload from "./payload"
import * as api from "client/api"
import { RawStyle } from "models"

const { values } = Object

const renameStyleCollection = (name: string) => (raw: RawStyle) => {
  const key = raw.base.theme ? "theme" : "group"

  return updateStylename(cloneDeep<RawStyle>(raw), {
    [key]: name,
    id: "$temp",
  })
}

const renameStyleThemeGroup = (name: string) => (raw: RawStyle) => {
  return updateStylename(cloneDeep<RawStyle>(raw), {
    group: name,
    id: "$temp",
  })
}

export const cloneCollection = createAsyncThunk<Payload.UpdatedStyles, Payload.CloneCollection, { state: RootState }>(
  "themes/cloneCollection",
  async ({ type, ...options }, { getState }) => {
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

export const cloneThemeGroup = createAsyncThunk<Payload.UpdatedStyles, Payload.CloneThemeGroup, { state: RootState }>(
  "themes/cloneThemeGroup",
  async ({ type, ...options }, { getState }) => {
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
import { createAsyncThunk } from "@reduxjs/toolkit"

import { createDraftStyle } from "utils/style"
import { RootState } from "client/features"
import * as Payload from "./payload"
import { RawStyle } from "models"
import * as api from "client/api"

const { keys } = Object

export const createStyle = createAsyncThunk<RawStyle, Payload.CreateStyle, { state: RootState }>(
  "themes/createStyle",
  async payload => {
    const style = await api.syncThemeStyle(
      createDraftStyle(payload.theme, payload.group, payload.name, payload.styleType),
    )

    return style
  },
)

// remove "theme" or "group"
export const removeCollection = createAsyncThunk<
  Payload.RemoveCollection,
  Payload.RemoveCollection,
  { state: RootState }
>("themes/removeCollection", async (payload, { getState }) => {
  const state = getState()

  const collection = state.themes[payload.type][payload.name]
  const tasks = keys(collection.items).map(id => api.removeThemeStyle(id))
  const removed = keys(collection.items)
  Promise.all(tasks)

  return {
    ...payload,
    removed,
  }
})

export const removeThemeGroup = createAsyncThunk<
  Payload.RemoveThemeGroup,
  Payload.RemoveThemeGroup,
  { state: RootState }
>("themes/removeThemeGroup", async (payload, { getState }) => {
  const state = getState()

  const group = state.themes[payload.type][payload.theme].groups[payload.group]
  const tasks = group.ids.map(id => api.removeThemeStyle(id))
  const removed = group.ids
  Promise.all(tasks)

  return {
    ...payload,
    removed,
  }
})

export const removeStyle = createAsyncThunk<Payload.RemoveStyle, Payload.RemoveStyle, { state: RootState }>(
  "themes/removeStyle",
  async (payload, { getState }) => {
    const state = getState()

    const style = state.themes[payload.type]?.[payload.collection].items[payload.id]
    await api.removeThemeStyle(style.base.id)

    return {
      ...payload,
      removed: [style.base.id],
    }
  },
)